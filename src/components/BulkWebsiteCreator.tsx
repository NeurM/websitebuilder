import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { WebsiteConfig } from '@/types/api';
import { createWebsiteConfig } from '@/utils/websiteService';
import { sendPreviewEmail } from '@/services/emailPreviewService';
import { Mail, Upload } from 'lucide-react';

interface BulkWebsiteCreatorProps {
  templates: { id: string; name: string }[];
  onWebsitesCreated: (websites: WebsiteConfig[]) => void;
}

export const BulkWebsiteCreator: React.FC<BulkWebsiteCreatorProps> = ({
  templates,
  onWebsitesCreated,
}) => {
  const [names, setNames] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [previewEmail, setPreviewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!names.trim() || !selectedTemplate) {
      toast({
        title: 'Error',
        description: 'Please enter company names and select a template',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const companyNames = names.split('\n').map(name => name.trim()).filter(Boolean);
    const createdWebsites: WebsiteConfig[] = [];

    try {
      for (const companyName of companyNames) {
        const response = await createWebsiteConfig({
          template_id: selectedTemplate,
          company_name: companyName,
          domain_name: `${companyName.toLowerCase().replace(/\s+/g, '-')}.com`,
        });

        if (response.data) {
          createdWebsites.push(response.data);

          // Send preview email if provided
          if (previewEmail) {
            try {
              await sendPreviewEmail(response.data, previewEmail);
            } catch (error) {
              console.error(`Failed to send preview email for ${companyName}:`, error);
            }
          }
        }
      }

      toast({
        title: 'Success',
        description: `Created ${createdWebsites.length} websites successfully`,
      });

      onWebsitesCreated(createdWebsites);
      setNames('');
      setPreviewEmail('');
    } catch (error) {
      console.error('Error creating websites:', error);
      toast({
        title: 'Error',
        description: 'Failed to create websites',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Website Creator</CardTitle>
        <CardDescription>
          Create multiple websites from a list of company names
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Template
            </label>
            <Select
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Company Names (one per line)
            </label>
            <Textarea
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Enter company names, one per line"
              rows={5}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Preview Email (optional)
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={previewEmail}
                onChange={(e) => setPreviewEmail(e.target.value)}
                placeholder="Enter email to receive previews"
              />
              <Button
                onClick={handleCreate}
                disabled={isLoading}
                className="whitespace-nowrap"
              >
                {isLoading ? (
                  'Creating...'
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Create Websites
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 