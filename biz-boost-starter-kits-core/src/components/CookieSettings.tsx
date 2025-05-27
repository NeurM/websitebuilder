import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CookieConfig } from '@/types/api';

interface CookieSettingsProps {
  config: CookieConfig;
  onChange: (config: CookieConfig) => void;
}

export const CookieSettings: React.FC<CookieSettingsProps> = ({ config, onChange }) => {
  const handleChange = (field: keyof CookieConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleCategoryChange = (category: keyof CookieConfig['cookie_categories'], value: boolean) => {
    onChange({
      ...config,
      cookie_categories: {
        ...config.cookie_categories,
        [category]: value,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>Configure cookie consent banner and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="cookie-enabled"
            checked={config.enabled}
            onCheckedChange={(checked) => handleChange('enabled', checked)}
          />
          <Label htmlFor="cookie-enabled">Enable Cookie Consent Banner</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="banner-text">Banner Text</Label>
          <Input
            id="banner-text"
            value={config.banner_text}
            onChange={(e) => handleChange('banner_text', e.target.value)}
            placeholder="We use cookies to enhance your experience..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="accept-button">Accept Button Text</Label>
          <Input
            id="accept-button"
            value={config.accept_button_text}
            onChange={(e) => handleChange('accept_button_text', e.target.value)}
            placeholder="Accept All"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="decline-button">Decline Button Text</Label>
          <Input
            id="decline-button"
            value={config.decline_button_text}
            onChange={(e) => handleChange('decline_button_text', e.target.value)}
            placeholder="Decline All"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="policy-url">Cookie Policy URL</Label>
          <Input
            id="policy-url"
            value={config.cookie_policy_url || ''}
            onChange={(e) => handleChange('cookie_policy_url', e.target.value || null)}
            placeholder="https://yourdomain.com/cookie-policy"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cookie-duration">Cookie Duration (days)</Label>
          <Input
            id="cookie-duration"
            type="number"
            value={config.cookie_duration}
            onChange={(e) => handleChange('cookie_duration', parseInt(e.target.value))}
            min={1}
            max={365}
          />
        </div>

        <div className="space-y-4">
          <Label>Cookie Categories</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="necessary"
                checked={config.cookie_categories.necessary}
                onCheckedChange={(checked) => handleCategoryChange('necessary', checked)}
                disabled
              />
              <Label htmlFor="necessary">Necessary (Always enabled)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="analytics"
                checked={config.cookie_categories.analytics}
                onCheckedChange={(checked) => handleCategoryChange('analytics', checked)}
              />
              <Label htmlFor="analytics">Analytics</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="marketing"
                checked={config.cookie_categories.marketing}
                onCheckedChange={(checked) => handleCategoryChange('marketing', checked)}
              />
              <Label htmlFor="marketing">Marketing</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="preferences"
                checked={config.cookie_categories.preferences}
                onCheckedChange={(checked) => handleCategoryChange('preferences', checked)}
              />
              <Label htmlFor="preferences">Preferences</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 