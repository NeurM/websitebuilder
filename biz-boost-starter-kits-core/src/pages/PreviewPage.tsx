import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WebsiteConfig } from '@/types/api';
import { trackPreviewOpen } from '@/services/emailPreviewService';
import { Skeleton } from '@/components/ui/skeleton';

const PreviewPage: React.FC = () => {
  const { previewId } = useParams<{ previewId: string }>();
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreview = async () => {
      if (!previewId) return;

      try {
        // Track that the preview was opened
        await trackPreviewOpen(previewId);

        // Load the website configuration
        const response = await fetch(`/api/websites/${previewId}`);
        if (!response.ok) throw new Error('Failed to load website preview');
        
        const data = await response.json();
        setWebsiteConfig(data);
      } catch (error) {
        console.error('Error loading preview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [previewId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-8 px-4">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!websiteConfig) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Preview Not Found</h1>
          <p className="text-muted-foreground">
            The website preview you're looking for doesn't exist or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{websiteConfig.company_name}</h1>
          <p className="text-muted-foreground mb-6">
            This is a preview of your website. The actual website will be available at{' '}
            <a
              href={`https://${websiteConfig.domain_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {websiteConfig.domain_name}
            </a>
          </p>

          {/* Add your website preview content here */}
          <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Website Preview Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage; 