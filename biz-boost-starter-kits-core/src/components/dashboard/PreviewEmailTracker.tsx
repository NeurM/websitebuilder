import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { WebsiteConfig } from '@/types/api';
import { sendPreviewEmail, getPreviewEmails, PreviewEmail } from '@/services/emailPreviewService';
import { Mail, Eye, Clock } from 'lucide-react';

interface PreviewEmailTrackerProps {
  websiteConfig: WebsiteConfig;
}

export const PreviewEmailTracker: React.FC<PreviewEmailTrackerProps> = ({ websiteConfig }) => {
  const [email, setEmail] = useState('');
  const [previewEmails, setPreviewEmails] = useState<PreviewEmail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPreviewEmails();
  }, [websiteConfig.id]);

  const loadPreviewEmails = async () => {
    try {
      const emails = await getPreviewEmails(websiteConfig.id);
      setPreviewEmails(emails);
    } catch (error) {
      console.error('Error loading preview emails:', error);
      toast({
        title: 'Error',
        description: 'Failed to load preview emails',
        variant: 'destructive',
      });
    }
  };

  const handleSendPreview = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendPreviewEmail(websiteConfig, email);
      toast({
        title: 'Success',
        description: 'Preview email sent successfully',
      });
      setEmail('');
      loadPreviewEmails();
    } catch (error) {
      console.error('Error sending preview email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send preview email',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview Email Tracking</CardTitle>
        <CardDescription>Send and track website preview emails</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter recipient email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleSendPreview} disabled={isLoading}>
              <Mail className="mr-2 h-4 w-4" />
              Send Preview
            </Button>
          </div>

          <div className="space-y-2">
            {previewEmails.map((preview) => (
              <div
                key={preview.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{preview.recipient_email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(preview.sent_at).toLocaleDateString()}
                  </div>
                  {preview.opened_at ? (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <Eye className="h-4 w-4" />
                      Opened {new Date(preview.opened_at).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      Not opened
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 