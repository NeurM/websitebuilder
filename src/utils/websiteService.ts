import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from './apiLogger';
import axios from 'axios';
import { WebsiteConfig, ApiResponse } from '@/types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function for error logging
const logError = (context: string, error: unknown) => {
  console.error(`🔴 Error in ${context}:`);
  
  if (error instanceof Error) {
    console.error(`• Name   : ${error.name}`);
    console.error(`• Message: ${error.message}`);
    console.error(`• Stack  : ${error.stack}`);
  } else if (error && typeof error === "object") {
    if ("value" in error) console.error(`• Value  : ${error.value}`);
    if ("message" in error) console.error(`• Message: ${error.message}`);
    console.error(`• Object : ${JSON.stringify(error, null, 2)}`);
  } else if (typeof error === "string") {
    console.error(`• String : ${error}`);
  } else if (error === null) {
    console.error(`• Error is null`);
  } else if (typeof error === "undefined") {
    console.error(`• Error is undefined`);
  } else {
    console.error(`• Unknown type: ${error}`);
  }
};

// Website configuration functions
export const saveWebsiteConfig = async (config: Partial<WebsiteConfig>): Promise<ApiResponse<WebsiteConfig>> => {
  try {
    console.log("🔵 Saving website config:", config);
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User must be logged in to save website configurations");
    }
    
    const response = await axios.post(`${API_URL}/websites/configs/`, {
      ...config,
      user_id: user.user.id
    });

    console.log("✅ Successfully saved website config");
    await logApiCall(
      '/website-configs', 
      'POST', 
      config, 
      response.data, 
      null as unknown as Error
    );
      
    return response.data;
  } catch (error) {
    logError('saveWebsiteConfig', error);
    await logApiCall('/website-configs', 'POST', config, null, error as Error);
    throw error;
  }
};

export const getWebsiteConfig = async (id: string): Promise<ApiResponse<WebsiteConfig>> => {
  try {
    console.log(`🔵 Fetching website config with ID: ${id}`);
    const response = await axios.get(`${API_URL}/websites/configs/${id}/`);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    console.log(`✅ Successfully fetched website config: ${response.data.company_name || 'Unknown'}`);
    await logApiCall(
      '/website-configs', 
      'GET', 
      { id }, 
      response.data, 
      null as unknown as Error
    );

    return response.data;
  } catch (error) {
    logError('getWebsiteConfig', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Website configuration not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch website configuration');
    }
    
    await logApiCall('/website-configs', 'GET', { id }, null, error as Error);
    throw error;
  }
};

export const getAllWebsiteConfigs = async (): Promise<ApiResponse<WebsiteConfig[]>> => {
  try {
    console.log("🔵 Fetching all website configs");
    const response = await axios.get(`${API_URL}/websites/configs/`);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    console.log(`✅ Successfully fetched ${response.data.length} website configs`);
    await logApiCall(
      '/website-configs', 
      'GET', 
      null, 
      response.data, 
      null as unknown as Error
    );

    return response.data;
  } catch (error) {
    logError('getAllWebsiteConfigs', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch website configurations');
    }
    
    await logApiCall('/website-configs', 'GET', null, null, error as Error);
    throw error;
  }
};

export const deleteWebsiteConfig = async (websiteId: string): Promise<ApiResponse<void>> => {
  try {
    if (!websiteId) {
      throw new Error('Website ID is required');
    }

    const response = await axios.delete(`${API_URL}/websites/configs/${websiteId}/`);
    
    await logApiCall(
      '/website-configs', 
      'DELETE', 
      { websiteId }, 
      response.data, 
      null as unknown as Error
    );

    return response.data;
  } catch (error) {
    console.error('Error deleting website config:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Website configuration not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete website configuration');
    }
    
    await logApiCall('/website-configs', 'DELETE', { websiteId }, null, error as Error);
    throw error;
  }
};

export const createWebsiteConfig = async (config: Partial<WebsiteConfig>): Promise<ApiResponse<WebsiteConfig>> => {
  try {
    if (!config) {
      throw new Error('Configuration data is required');
    }

    const response = await axios.post(`${API_URL}/websites/configs/`, config);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    await logApiCall(
      '/website-configs', 
      'POST', 
      config, 
      response.data, 
      null as unknown as Error
    );

    return response.data;
  } catch (error) {
    console.error('Error creating website config:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied');
      }
      throw new Error(error.response?.data?.message || 'Failed to create website configuration');
    }
    
    await logApiCall('/website-configs', 'POST', config, null, error as Error);
    throw error;
  }
};

export const updateWebsiteConfig = async (id: string, config: Partial<WebsiteConfig>): Promise<ApiResponse<WebsiteConfig>> => {
  try {
    if (!id) {
      throw new Error('Website ID is required');
    }
    if (!config) {
      throw new Error('Configuration data is required');
    }

    const response = await axios.put(`${API_URL}/websites/configs/${id}/`, config);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }

    await logApiCall(
      '/website-configs', 
      'PUT', 
      { id, ...config }, 
      response.data, 
      null as unknown as Error
    );

    return response.data;
  } catch (error) {
    console.error('Error updating website config:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Website configuration not found');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied');
      }
      throw new Error(error.response?.data?.message || 'Failed to update website configuration');
    }
    
    await logApiCall('/website-configs', 'PUT', { id, ...config }, null, error as Error);
    throw error;
  }
};
