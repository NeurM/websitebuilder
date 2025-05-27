import axios from 'axios';
import { WebsiteConfig } from '@/types/api';

export interface PreviewEmail {
  id: string;
  website_id: string;
  recipient_email: string;
  sent_at: string;
  opened_at: string | null;
  preview_url: string;
}

export const sendPreviewEmail = async (
  websiteConfig: WebsiteConfig,
  recipientEmail: string
): Promise<PreviewEmail> => {
  try {
    const response = await axios.post('/api/preview-emails', {
      website_id: websiteConfig.id,
      recipient_email: recipientEmail,
      preview_url: `${window.location.origin}/preview/${websiteConfig.id}`
    });
    return response.data;
  } catch (error) {
    console.error('Error sending preview email:', error);
    throw error;
  }
};

export const getPreviewEmails = async (websiteId: string): Promise<PreviewEmail[]> => {
  try {
    const response = await axios.get(`/api/preview-emails/${websiteId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching preview emails:', error);
    throw error;
  }
};

export const trackPreviewOpen = async (previewId: string): Promise<void> => {
  try {
    await axios.post(`/api/preview-emails/${previewId}/track`);
  } catch (error) {
    console.error('Error tracking preview open:', error);
    throw error;
  }
}; 