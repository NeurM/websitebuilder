
import { lazy, Suspense } from "react";
import { RouteConfig } from "../types/template";
import { tradecraftData } from "../data/tradecraftData";
import { 
  AboutPageComponent, 
  ServicesPageComponent, 
  BlogPageComponent,
  ContactPageGenericComponent
} from "../components/generic/GenericTemplatePages";

// Lazy load templates
const TradeHome = lazy(() => import("../templates/tradecraft/Home"));
const TradecraftContact = lazy(() => import("../templates/tradecraft/Contact"));
const TradecraftAuth = lazy(() => import("../templates/tradecraft/Auth"));

// Create component wrapper for consistent rendering
const createSuspenseWrapper = (Component) => (
  <Suspense fallback={<div className="w-full h-64 flex items-center justify-center">Loading...</div>}>
    <Component />
  </Suspense>
);

export const TradecraftAbout = () => (
  <AboutPageComponent
    template="TradeCraft"
    title="About TradeCraft"
    description={tradecraftData.description}
    logo={tradecraftData.logo}
    basePath={tradecraftData.basePath}
    navItems={tradecraftData.navItems}
    contactInfo={tradecraftData.contactInfo}
    primaryColor="blue"
  />
);

export const TradecraftServices = () => (
  <ServicesPageComponent
    template="TradeCraft"
    title="Our Services"
    serviceType="Services"
    description={tradecraftData.description}
    logo={tradecraftData.logo}
    basePath={tradecraftData.basePath}
    navItems={tradecraftData.navItems}
    contactInfo={tradecraftData.contactInfo}
    primaryColor="blue"
  />
);

export const TradecraftBlog = () => (
  <BlogPageComponent
    template="TradeCraft"
    title="TradeCraft Blog"
    description={tradecraftData.description}
    logo={tradecraftData.logo}
    basePath={tradecraftData.basePath}
    navItems={tradecraftData.navItems}
    contactInfo={tradecraftData.contactInfo}
    primaryColor="blue"
  />
);

export const tradecraftRoutes: RouteConfig[] = [
  {
    path: "/tradecraft",
    element: createSuspenseWrapper(TradeHome),
  },
  {
    path: "/tradecraft/about",
    element: <TradecraftAbout />,
  },
  {
    path: "/tradecraft/services",
    element: <TradecraftServices />,
  },
  {
    path: "/tradecraft/blog",
    element: <TradecraftBlog />,
  },
  {
    path: "/tradecraft/contact",
    element: createSuspenseWrapper(TradecraftContact),
  },
  {
    path: "/tradecraft/auth",
    element: createSuspenseWrapper(TradecraftAuth),
  },
];
