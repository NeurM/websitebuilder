import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WebsiteConfig } from '@/types/api';

interface DeploymentInfoProps {
  websiteConfig: WebsiteConfig;
}

const DeploymentInfo: React.FC<DeploymentInfoProps> = ({ websiteConfig }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Information</CardTitle>
        <CardDescription>Current deployment status and details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Status</h3>
            <p className="text-sm text-muted-foreground">{websiteConfig.deployment_status}</p>
          </div>
          {websiteConfig.deployment_url && (
            <div>
              <h3 className="font-medium">Deployment URL</h3>
              <a 
                href={websiteConfig.deployment_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {websiteConfig.deployment_url}
              </a>
            </div>
          )}
          {websiteConfig.last_deployed_at && (
            <div>
              <h3 className="font-medium">Last Deployed</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(websiteConfig.last_deployed_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentInfo;
