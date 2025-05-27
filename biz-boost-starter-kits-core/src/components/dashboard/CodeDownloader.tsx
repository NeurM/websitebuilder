import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { WebsiteConfig } from '@/types/api';

interface CodeDownloaderProps {
  websiteConfig: WebsiteConfig;
}

export const CodeDownloader: React.FC<CodeDownloaderProps> = ({ websiteConfig }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/websites/${websiteConfig.id}/download`);
      if (!response.ok) throw new Error('Failed to download code');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${websiteConfig.company_name.toLowerCase().replace(/\s+/g, '-')}-website.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading code:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Website Code</CardTitle>
        <CardDescription>Download the complete website code for local development</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleDownload} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download Code
        </Button>
      </CardContent>
    </Card>
  );
};
