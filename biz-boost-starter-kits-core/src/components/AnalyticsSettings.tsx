import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AnalyticsConfig } from '@/types/api';

interface AnalyticsSettingsProps {
  config: AnalyticsConfig;
  onChange: (config: AnalyticsConfig) => void;
}

export const AnalyticsSettings: React.FC<AnalyticsSettingsProps> = ({ config, onChange }) => {
  const handleChange = (field: keyof AnalyticsConfig, value: string | null) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Settings</CardTitle>
        <CardDescription>Configure analytics tracking for your website</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="google-analytics">Google Analytics ID</Label>
          <Input
            id="google-analytics"
            placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
            value={config.google_analytics_id || ''}
            onChange={(e) => handleChange('google_analytics_id', e.target.value || null)}
          />
          <p className="text-sm text-muted-foreground">
            Enter your Google Analytics tracking ID (starts with UA- or G-)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gtm">Google Tag Manager ID</Label>
          <Input
            id="gtm"
            placeholder="GTM-XXXXXX"
            value={config.google_tag_manager_id || ''}
            onChange={(e) => handleChange('google_tag_manager_id', e.target.value || null)}
          />
          <p className="text-sm text-muted-foreground">
            Enter your Google Tag Manager container ID (starts with GTM-)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook-pixel">Facebook Pixel ID</Label>
          <Input
            id="facebook-pixel"
            placeholder="XXXXXXXXXXXXXXX"
            value={config.facebook_pixel_id || ''}
            onChange={(e) => handleChange('facebook_pixel_id', e.target.value || null)}
          />
          <p className="text-sm text-muted-foreground">
            Enter your Facebook Pixel ID
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-script">Custom Analytics Script</Label>
          <Textarea
            id="custom-script"
            placeholder="Paste your custom analytics script here"
            value={config.custom_analytics_script || ''}
            onChange={(e) => handleChange('custom_analytics_script', e.target.value || null)}
            className="font-mono text-sm"
            rows={4}
          />
          <p className="text-sm text-muted-foreground">
            Add any custom analytics scripts (e.g., Hotjar, Mixpanel, etc.)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 