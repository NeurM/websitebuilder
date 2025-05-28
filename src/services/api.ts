import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, WebsiteConfig, Template, WebsiteStats, DeploymentInfo, PaginatedResponse } from '@/types/api';
import { authService } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/public/api';

// Debug logging setup
const DEBUG = process.env.NODE_ENV === 'development';

const debugLog = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(`[API DEBUG] ${message}`, ...args);
  }
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  debugLog('Making API request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    headers: config.headers,
    data: config.data,
  });

  const token = authService.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    debugLog('Added auth token to request');
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    debugLog('Received API response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    debugLog('API request failed:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      debugLog('Authentication failed, logging out user');
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const websiteService = {
  // Get all website configs for the current user
  getAllWebsiteConfigs: async (): Promise<ApiResponse<WebsiteConfig[]>> => {
    const response = await api.get<ApiResponse<WebsiteConfig[]>>('/websites/');
    return response.data;
  },

  // Get a single website config by ID
  getWebsiteConfig: async (id: string): Promise<ApiResponse<WebsiteConfig>> => {
    const response = await api.get<ApiResponse<WebsiteConfig>>(`/websites/${id}/`);
    return response.data;
  },

  // Create a new website config
  createWebsiteConfig: async (data: Partial<WebsiteConfig>): Promise<ApiResponse<WebsiteConfig>> => {
    const response = await api.post<ApiResponse<WebsiteConfig>>('/websites/', data);
    return response.data;
  },

  // Update a website config
  updateWebsiteConfig: async (id: string, data: Partial<WebsiteConfig>): Promise<ApiResponse<WebsiteConfig>> => {
    const response = await api.patch<ApiResponse<WebsiteConfig>>(`/websites/${id}/`, data);
    return response.data;
  },

  // Delete a website config
  deleteWebsiteConfig: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/websites/${id}/`);
    return response.data;
  },

  // Get website statistics
  getWebsiteStats: async (id: string): Promise<ApiResponse<WebsiteStats>> => {
    const response = await api.get<ApiResponse<WebsiteStats>>(`/websites/${id}/stats/`);
    return response.data;
  },

  // Deploy a website
  deployWebsite: async (id: string): Promise<ApiResponse<DeploymentInfo>> => {
    const response = await api.post<ApiResponse<DeploymentInfo>>(`/websites/${id}/deploy/`);
    return response.data;
  },

  // Get deployment status
  getDeploymentStatus: async (id: string): Promise<ApiResponse<DeploymentInfo>> => {
    const response = await api.get<ApiResponse<DeploymentInfo>>(`/websites/${id}/deployment-status/`);
    return response.data;
  },
};

export const templateService = {
  // Get all templates
  getAllTemplates: async (): Promise<ApiResponse<PaginatedResponse<Template>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Template>>>('/templates/');
    return response.data;
  },

  // Get a single template by ID
  getTemplate: async (id: string): Promise<ApiResponse<Template>> => {
    const response = await api.get<ApiResponse<Template>>(`/templates/${id}/`);
    return response.data;
  },

  // Get templates by category
  getTemplatesByCategory: async (category: string): Promise<ApiResponse<PaginatedResponse<Template>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Template>>>(`/templates/category/${category}/`);
    return response.data;
  },
};

export const userService = {
  // Get current user profile
  getCurrentUser: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/users/me/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.patch<ApiResponse<any>>('/users/me/', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: { old_password: string; new_password: string }): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/users/change-password/', data);
    return response.data;
  },
};

export default api; 