import api from '@/lib/api';

export interface Website {
  id: number;
  name: string;
  domain: string;
  // Add other website properties as needed
}

export const websiteService = {
  // Get all websites
  getAllWebsites: async () => {
    const response = await api.get<Website[]>('/websites/');
    return response.data;
  },

  // Get a single website
  getWebsite: async (id: number) => {
    const response = await api.get<Website>(`/websites/${id}/`);
    return response.data;
  },

  // Create a new website
  createWebsite: async (website: Partial<Website>) => {
    const response = await api.post<Website>('/websites/', website);
    return response.data;
  },

  // Update a website
  updateWebsite: async (id: number, website: Partial<Website>) => {
    const response = await api.patch<Website>(`/websites/${id}/`, website);
    return response.data;
  },

  // Delete a website
  deleteWebsite: async (id: number) => {
    await api.delete(`/websites/${id}/`);
  },
}; 