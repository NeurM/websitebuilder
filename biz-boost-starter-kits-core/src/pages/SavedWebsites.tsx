import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WebsiteConfig } from '@/types/api';
import { websiteService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import GlobalAppNavbar from '@/components/GlobalAppNavbar';
import WebsiteActions from '@/components/website/WebsiteActions';
import { format } from 'date-fns';

export const SavedWebsites: React.FC = () => {
  const [websites, setWebsites] = useState<WebsiteConfig[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadWebsites = async () => {
      try {
        const response = await websiteService.getAllWebsiteConfigs();
        setWebsites(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load websites',
          variant: 'destructive',
        });
      }
    };

    loadWebsites();
  }, [toast]);

  const handleEdit = (id: string) => {
    navigate(`/websites/${id}/edit`);
  };

  const handleView = (id: string) => {
    navigate(`/websites/${id}`);
  };

  const getTemplateDisplayName = (templateId: string) => {
    const templates: Record<string, string> = {
      'tradecraft': 'Tradecraft',
      'retail': 'Retail Ready',
      'service': 'Service Pro',
      'expert': 'Local Expert',
      'cleanslate': 'Clean Slate',
    };
    
    return templates[templateId] || templateId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalAppNavbar />
      <div className="container mx-auto py-10 px-4">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Saved Websites</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Manage your website projects
              </p>
            </div>
            <Button onClick={() => navigate('/templates')}>Create New Website</Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {websites.map((website) => (
              <Card key={website.id}>
                <CardHeader>
                  <CardTitle>{website.company_name}</CardTitle>
                  <CardDescription>{website.domain_name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => handleView(website.id)}>
                      View
                    </Button>
                    <Button onClick={() => handleEdit(website.id)}>Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedWebsites;
