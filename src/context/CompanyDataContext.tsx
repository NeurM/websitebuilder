import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { getWebsiteConfig } from '@/utils/websiteService';
import { WebsiteConfig, ApiResponse } from '@/types/api';

interface CompanyDataContextType {
  companyData: WebsiteConfig | null;
  loading: boolean;
  error: string | null;
  fetchCompanyData: (websiteId: string) => Promise<void>;
}

const CompanyDataContext = createContext<CompanyDataContextType | undefined>(undefined);

// Helper function to handle errors consistently
const handleError = (error: unknown): string => {
  try {
    console.error("🔴 Error in CompanyDataContext:");

    if (error instanceof Error) {
      console.error("• Name   :", error.name);
      console.error("• Message:", error.message);
      console.error("• Stack  :", error.stack);
      return error.message;
    } else if (error && typeof error === "object") {
      if ("value" in error) console.error("• Value  :", error.value);
      if ("message" in error) {
        console.error("• Message:", error.message);
        return String(error.message);
      }
      console.error("• Object :", JSON.stringify(error, null, 2));
      return "An unexpected error occurred";
    } else if (typeof error === "string") {
      console.error("• String :", error);
      return error;
    } else if (error === null) {
      console.error("• Error is null");
      return "An unexpected error occurred";
    } else if (typeof error === "undefined") {
      console.error("• Error is undefined");
      return "An unexpected error occurred";
    } else {
      console.error("• Unknown type:", error);
      return "An unexpected error occurred";
    }
  } catch (loggingError) {
    console.error("🔴 Error in error handler:", loggingError);
    return "An unexpected error occurred";
  }
};

export const CompanyDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyData, setCompanyData] = useState<WebsiteConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();

  const fetchCompanyData = async (websiteId: string) => {
    if (!websiteId) {
      setCompanyData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getWebsiteConfig(websiteId);
      
      if (!response || !response.data) {
        throw new Error('No data received from server');
      }

      setCompanyData(response.data);
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      setCompanyData(null);
      toast({
        title: 'Error Loading Company Data',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      // Only fetch data if we're on a website-specific route
      const pathParts = location.pathname.split('/');
      const websiteId = pathParts.length > 2 ? pathParts[2] : null;
      
      if (websiteId) {
        fetchCompanyData(websiteId);
      } else {
        setCompanyData(null);
      }
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      setCompanyData(null);
    }
  }, [location.pathname]);

  return (
    <CompanyDataContext.Provider value={{ companyData, loading, error, fetchCompanyData }}>
      {children}
    </CompanyDataContext.Provider>
  );
};

export const useCompanyData = () => {
  const context = useContext(CompanyDataContext);
  if (context === undefined) {
    throw new Error('useCompanyData must be used within a CompanyDataProvider');
  }
  return context;
};
