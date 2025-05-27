import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from './apiLogger';
import axios from 'axios';
import { WebsiteConfig, ApiResponse } from '@/types/api';

const API_URL = import.meta.env.VITE_API_URL;

// Website configuration functions
export const saveWebsiteConfig = async (config: {
  template_id: string;
  company_name: string;
  domain_name: string;
  logo: string;
  color_scheme?: string;
  secondary_color_scheme?: string;
  deployment_status?: string;
  last_deployed_at?: string;
  deployment_url?: string;
}) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User must be logged in to save website configurations");
    }
    
    const { data, error } = await supabase
      .from('website_configs')
      .upsert({
        user_id: user.user.id,
        template_id: config.template_id,
        company_name: config.company_name,
        domain_name: config.domain_name,
        logo: config.logo,
        color_scheme: config.color_scheme,
        secondary_color_scheme: config.secondary_color_scheme,
        deployment_status: config.deployment_status,
        last_deployed_at: config.last_deployed_at,
        deployment_url: config.deployment_url
      })
      .select()
      .single();
      
    await logApiCall(
      '/website-configs', 
      'POST', 
      config, 
      data, 
      error
    );
      
    return { data, error };
  } catch (error) {
    await logApiCall('/website-configs', 'POST', config, null, error as Error);
    throw error;
  }
};

export const getWebsiteConfig = async (templateId: string): Promise<ApiResponse<WebsiteConfig>> => {
  const response = await axios.get(`${API_URL}/websites/configs/${templateId}/`);
  return response.data;
};

export const getAllWebsiteConfigs = async (): Promise<ApiResponse<WebsiteConfig[]>> => {
  const response = await axios.get(`${API_URL}/websites/configs/`);
  return response.data;
};

export const deleteWebsiteConfig = async (websiteId: string): Promise<ApiResponse<void>> => {
  const response = await axios.delete(`${API_URL}/websites/configs/${websiteId}/`);
  return response.data;
};

export const createWebsiteConfig = async (config: Partial<WebsiteConfig>): Promise<ApiResponse<WebsiteConfig>> => {
  const response = await axios.post(`${API_URL}/websites/configs/`, config);
  return response.data;
};

export const updateWebsiteConfig = async (id: string, config: Partial<WebsiteConfig>): Promise<ApiResponse<WebsiteConfig>> => {
  const response = await axios.put(`${API_URL}/websites/configs/${id}/`, config);
  return response.data;
};
