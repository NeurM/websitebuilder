export interface User {
  id: string | number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  last_login: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface AnalyticsConfig {
  google_analytics_id: string | null;
  google_tag_manager_id: string | null;
  facebook_pixel_id: string | null;
  custom_analytics_script: string | null;
}

export interface CookieConfig {
  enabled: boolean;
  banner_text: string | null;
  accept_button_text: string;
  decline_button_text: string;
  cookie_policy_url: string | null;
  cookie_duration: number;
  cookie_categories: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  };
}

export interface PreviewEmail {
  id: string;
  website_id: string;
  recipient_email: string;
  sent_at: string;
  opened_at: string | null;
  preview_url: string;
}

export interface WebsiteConfig {
  id: string;
  template_id: string;
  company_name: string;
  domain_name: string;
  logo: string | null;
  color_scheme: string | null;
  secondary_color_scheme: string | null;
  deployment_status: string | null;
  deployment_url: string | null;
  last_deployed_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  analytics: AnalyticsConfig;
  cookies: CookieConfig;
  preview_emails: PreviewEmail[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  preview_url: string;
  category: string;
  features: string[];
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface WebsiteStats {
  total_views: number;
  unique_visitors: number;
  average_time_on_site: number;
  bounce_rate: number;
  top_pages: Array<{
    path: string;
    views: number;
  }>;
  traffic_sources: Array<{
    source: string;
    visitors: number;
  }>;
}

export interface DeploymentInfo {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  url: string | null;
  last_deployed_at: string | null;
  build_logs: string[];
} 