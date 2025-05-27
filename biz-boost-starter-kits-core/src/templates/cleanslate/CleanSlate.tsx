
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";
import { Mail, Phone, ArrowRight, Users, Briefcase, HeartHandshake } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import Testimonial from "@/components/Testimonial";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CleanSlate = () => {
  const location = useLocation();
  const [companyData, setCompanyData] = useState<{
    companyName?: string;
    domainName?: string;
    logo?: string;
    colorScheme?: string | null;
    secondaryColorScheme?: string | null;
  } | null>(null);
  
  // Refs for scrolling
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Navigation items with hash links that will work for scrolling
  const navItems = [
    { name: "Home", path: "#home" },
    { name: "About", path: "#about" },
    { name: "Services", path: "#services" },
    { name: "Contact", path: "#contact" },
  ];
  
  // Load company data from sessionStorage or URL state
  useEffect(() => {
    // Try to get data from sessionStorage first
    const storedData = sessionStorage.getItem('companyData');
    
    if (storedData) {
      setCompanyData(JSON.parse(storedData));
    } 
    // Fall back to location state if available
    else if (location.state) {
      const { companyName, domainName, logo, colorScheme, secondaryColorScheme } = location.state;
      setCompanyData({
        companyName,
        domainName,
        logo,
        colorScheme,
        secondaryColorScheme
      });
      
      // Also store in sessionStorage for persistence
      sessionStorage.setItem('companyData', JSON.stringify({
        companyName,
        domainName,
        logo,
        colorScheme,
        secondaryColorScheme
      }));
    }
  }, [location.state]);

  // Handle navigation with hash links
  useEffect(() => {
    // Function to handle hash navigation
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#about" && aboutRef.current) {
        aboutRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === "#services" && servicesRef.current) {
        servicesRef.current.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === "#contact" && contactRef.current) {
        contactRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Initial check on mount
    handleHashChange();
    
    // Add listener for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Check if we're in template preview mode (no company data)
  const isTemplatePreview = () => {
    // If there's no company data or company name, it's a template preview
    return !companyData || !companyData.companyName;
  };
  
  // Get company name or default to Clean Slate
  const getCompanyName = () => {
    if (companyData && companyData.companyName) {
      return companyData.companyName;
    }
    return "Clean Slate";
  };

  // Check if we're in the main website view vs editor/preview
  const isMainWebsiteView = () => {
    // If path starts with /cleanslate, we're in the main website view
    return location.pathname.startsWith('/cleanslate');
  };

  // Services data
  const services = [
    {
      title: "Strategic Planning",
      description: "We help you develop comprehensive strategies tailored to your business goals.",
      icon: <Briefcase className="h-8 w-8 text-primary" />
    },
    {
      title: "Team Development",
      description: "Build high-performing teams with our coaching and development programs.",
      icon: <Users className="h-8 w-8 text-primary" />
    },
    {
      title: "Customer Success",
      description: "Enhance your customer relationships and boost satisfaction rates.",
      icon: <HeartHandshake className="h-8 w-8 text-primary" />
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      quote: `${getCompanyName()} transformed our business with their strategic insights and practical solutions.`,
      author: "Sarah Johnson",
      role: "CEO",
      company: "TechForward"
    },
    {
      quote: `Working with the ${getCompanyName()} team has been revolutionary for our company culture.`,
      author: "Michael Chen",
      role: "Director",
      company: "InnovateCorp"
    },
  ];

  // Handle smooth scroll for button clicks
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Only render the template navbar if we're in the main website view */}
      {isMainWebsiteView() && (
        <Navbar 
          logo={getCompanyName()}
          basePath="cleanslate"
          navItems={navItems}
          ctaText="Get Started"
          ctaLink="#contact"
          className="sticky top-0 z-40"
          forceTemplateName={isTemplatePreview()}
        />
      )}

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="home" className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{getCompanyName()}</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {companyData && companyData.domainName ? 
                `Welcome to ${companyData.domainName}` : 
                "This clean slate template gives you the foundation to create something amazing."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => scrollToSection(contactRef)}>Get Started</Button>
              <Button variant="outline" size="lg" onClick={() => scrollToSection(aboutRef)}>Learn More</Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" ref={aboutRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">About Us</h2>
              <Separator className="w-24 mx-auto" />
              <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
                We're passionate about helping businesses grow and reach their full potential.
                Our team of experts brings years of industry experience to every project.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                {companyData && companyData.logo && companyData.logo.startsWith('http') ? (
                  <img 
                    src={companyData.logo} 
                    alt={`${getCompanyName()} logo`} 
                    className="rounded-lg w-full h-auto"
                  />
                ) : (
                  <div className="aspect-video bg-gray-200 rounded-lg"></div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-6">
                  To provide businesses with the tools, strategies, and support they need to thrive
                  in today's competitive market. We believe in creating sustainable growth through
                  thoughtful planning and execution.
                </p>
                <h3 className="text-2xl font-bold mb-4">Our Values</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>Integrity in everything we do</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>Innovation that drives results</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span>Commitment to client success</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" ref={servicesRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <Separator className="w-24 mx-auto" />
              <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
                We offer a comprehensive range of services designed to help your business reach its goals.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <Separator className="w-24 mx-auto" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Testimonial
                  key={index}
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  company={testimonial.company}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={contactRef} className="py-16 bg-gray-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <Separator className="w-24 mx-auto bg-gray-600" />
              <p className="mt-4 text-gray-300 max-w-3xl mx-auto">
                Ready to take the next step? Reach out to us to discuss how we can help your business grow.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 p-3 w-full rounded-md bg-gray-700 border-gray-600 text-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 p-3 w-full rounded-md bg-gray-700 border-gray-600 text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="mt-1 p-3 w-full rounded-md bg-gray-700 border-gray-600 text-white"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <Button className="w-full" size="lg">Send Message</Button>
                </form>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-6">Get In Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-700 p-3 rounded-full">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-gray-300">
                        {companyData && companyData.domainName ? 
                          `contact@${companyData.domainName}` : 
                          "contact@cleanslate.com"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-700 p-3 rounded-full">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-gray-300">(123) 456-7890</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="text-xl font-semibold mb-4">Office Hours</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>Monday - Friday: 9:00 AM - 5:00 PM</li>
                    <li>Saturday: 10:00 AM - 2:00 PM</li>
                    <li>Sunday: Closed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Only render the template footer if we're in the main website view */}
      {isMainWebsiteView() && (
        <Footer 
          logo={getCompanyName()}
          description="Your foundation for building amazing web applications."
          basePath="cleanslate"
          navItems={navItems}
          contactInfo={{
            address: "123 Business Ave, Suite 100, San Francisco, CA 94107",
            phone: "(123) 456-7890",
            email: companyData && companyData.domainName ? 
              `contact@${companyData.domainName}` : 
              "contact@cleanslate.com"
          }}
        />
      )}
    </div>
  );
};

export default CleanSlate;
