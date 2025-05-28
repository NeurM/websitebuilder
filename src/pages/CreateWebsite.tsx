import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Template, WebsiteConfig, AnalyticsConfig, CookieConfig } from '@/types/api';
import { websiteService, templateService } from '@/services/api';
import { AnalyticsSettings } from '@/components/AnalyticsSettings';
import { CookieSettings } from '@/components/CookieSettings';
import { BulkWebsiteCreator } from '@/components/BulkWebsiteCreator';

const defaultAnalytics: AnalyticsConfig = {
  google_analytics_id: null,
  google_tag_manager_id: null,
  facebook_pixel_id: null,
  custom_analytics_script: null,
};

const defaultCookies: CookieConfig = {
  enabled: true,
  banner_text: 'We use cookies to enhance your experience.',
  accept_button_text: 'Accept All',
  decline_button_text: 'Decline All',
  cookie_policy_url: null,
  cookie_duration: 365,
  cookie_categories: {
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true,
  },
};

export const CreateWebsite: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [companyName, setCompanyName] = useState('');
  const [domainName, setDomainName] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsConfig>(defaultAnalytics);
  const [cookies, setCookies] = useState<CookieConfig>(defaultCookies);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await templateService.getAllTemplates();
        setTemplates(response.data.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load templates',
          variant: 'destructive',
        });
      }
    };

    loadTemplates();
  }, [toast]);

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
    // Auto-generate domain name
    setDomainName(value.toLowerCase().replace(/\s+/g, '-'));
  };

  const handleCreate = async () => {
    if (!selectedTemplate) {
      toast({
        title: 'Error',
        description: 'Please select a template',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const website: Partial<WebsiteConfig> = {
        template_id: selectedTemplate,
        company_name: companyName,
        domain_name: domainName,
        analytics,
        cookies,
      };

      const response = await websiteService.createWebsiteConfig(website);
      toast({
        title: 'Success',
        description: 'Website created successfully',
      });
      navigate(`/websites/${response.data.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create website',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="single" className="space-y-6">
        <TabsList>
          <TabsTrigger value="single">Create Single Website</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Create Websites</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Website</CardTitle>
                <CardDescription>Configure your website settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="template">Select Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => handleCompanyNameChange(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain-name">Domain Name</Label>
                  <Input
                    id="domain-name"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="your-domain.com"
                  />
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={isLoading || !selectedTemplate || !companyName || !domainName}
                  className="w-full"
                >
                  {isLoading ? 'Creating...' : 'Create Website'}
                </Button>
              </CardContent>
            </Card>

            <AnalyticsSettings config={analytics} onChange={setAnalytics} />
            <CookieSettings config={cookies} onChange={setCookies} />
          </div>
        </TabsContent>

        <TabsContent value="bulk">
          <BulkWebsiteCreator
            templates={templates}
            onWebsitesCreated={() => navigate('/websites')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}; 