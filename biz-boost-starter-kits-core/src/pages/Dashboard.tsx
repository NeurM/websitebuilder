import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import ApiAnalyticsCard from "@/components/dashboard/ApiAnalyticsCard";
import WebsiteAnalyticsCard from "@/components/dashboard/WebsiteAnalyticsCard";
import WebsiteVisitAnalytics from "@/components/dashboard/WebsiteVisitAnalytics";
import DeploymentInfo from '@/components/dashboard/DeploymentInfo';
import { CodeDownloader } from '@/components/dashboard/CodeDownloader';
import { PreviewEmailTracker } from '@/components/dashboard/PreviewEmailTracker';
import GlobalAppNavbar from '@/components/GlobalAppNavbar';
import { getAllWebsiteConfigs } from '@/utils/websiteService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { WebsiteConfig } from '@/types/api';

const stats = [
  {
    title: 'Total Websites',
    value: '12',
    description: 'Active websites',
  },
  {
    title: 'Total Clients',
    value: '8',
    description: 'Active clients',
  },
  {
    title: 'Monthly Views',
    value: '24.5K',
    description: 'Across all websites',
  },
];

const recentWebsites = [
  {
    id: 1,
    name: 'Acme Corp',
    template: 'Business Portfolio',
    lastUpdated: '2 days ago',
  },
  {
    id: 2,
    name: 'Tech Solutions',
    template: 'E-commerce Store',
    lastUpdated: '5 days ago',
  },
  {
    id: 3,
    name: 'Gourmet Delights',
    template: 'Restaurant Website',
    lastUpdated: '1 week ago',
  },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<WebsiteConfig[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const loadWebsites = async () => {
      setIsLoading(true);
      try {
        const response = await getAllWebsiteConfigs();
        setWebsites(response.data);
        // If there's a stored website ID in session storage, select that website
        const storedWebsiteId = sessionStorage.getItem('selectedWebsiteId');
        if (storedWebsiteId) {
          const website = response.data.find(w => w.id === storedWebsiteId);
          if (website) {
            setSelectedWebsite(website);
          }
        }
      } catch (error) {
        console.error('Error loading websites:', error);
        toast({
          title: 'Error',
          description: 'Failed to load websites. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWebsites();
  }, [user, navigate, toast]);

  const handleWebsiteSelect = (website: WebsiteConfig) => {
    setSelectedWebsite(website);
    sessionStorage.setItem('selectedWebsiteId', website.id);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <GlobalAppNavbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {isLoading ? (
          <div className="mb-6">
            <Skeleton className="h-10 w-full max-w-md mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
            <Skeleton className="h-96" />
          </div>
        ) : (
          <>
            {websites.length > 0 ? (
              <div className="mb-6">
                <Label htmlFor="website-selector" className="text-base font-semibold mb-2 block">
                  Select Website
                </Label>
                <Select
                  value={selectedWebsite?.id || ""}
                  onValueChange={(value) => {
                    const website = websites.find(w => w.id === value);
                    if (website) handleWebsiteSelect(website);
                  }}
                >
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Select a website" />
                  </SelectTrigger>
                  <SelectContent>
                    {websites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.company_name} ({site.template_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <Card className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
                <CardContent className="pt-6">
                  <p>You don't have any websites yet. Create one from the templates page.</p>
                </CardContent>
              </Card>
            )}

            {selectedWebsite && (
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Analytics</TabsTrigger>
                  <TabsTrigger value="deployment">Deployment</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ApiAnalyticsCard />
                    <WebsiteAnalyticsCard />
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Website Visit Analytics</CardTitle>
                      <CardDescription>
                        Detailed breakdown of visitors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WebsiteVisitAnalytics 
                        websiteId={selectedWebsite.id}
                        websiteName={selectedWebsite.company_name}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="deployment">
                  <DeploymentInfo websiteConfig={selectedWebsite} />
                </TabsContent>
                
                <TabsContent value="code">
                  <CodeDownloader websiteConfig={selectedWebsite} />
                </TabsContent>

                <TabsContent value="preview">
                  <PreviewEmailTracker websiteConfig={selectedWebsite} />
                </TabsContent>
              </Tabs>
            )}

            <div className="grid gap-6 md:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader>
                    <CardTitle>{stat.title}</CardTitle>
                    <CardDescription>{stat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Websites</CardTitle>
                <CardDescription>Your recently updated websites</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentWebsites.map((website) => (
                    <div
                      key={website.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{website.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {website.template} • Updated {website.lastUpdated}
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => navigate(`/saved-websites/${website.id}`)}>
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
