import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { getWebsiteConfig } from '@/utils/supabase';
import { useToast } from '@/hooks/use-toast';
import { WebsiteConfig } from '@/types/api';

interface CompanyData {
  companyName: string;
  domainName: string;
  logo: string | null;
  colorScheme: string | null;
  secondaryColorScheme: string | null;
}

interface CompanyDataContextType {
  companyData: CompanyData | null;
  setCompanyData: React.Dispatch<React.SetStateAction<CompanyData | null>>;
  loading: boolean;
}

const CompanyDataContext = createContext<CompanyDataContextType | undefined>(undefined);

export const CompanyDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const websiteId = sessionStorage.getItem('websiteId');
        if (!websiteId) {
          setLoading(false);
          return;
        }

        const response = await getWebsiteConfig(websiteId);
        if (response.data) {
          const config = response.data as WebsiteConfig;
          setCompanyData({
            companyName: config.company_name,
            domainName: config.domain_name,
            logo: config.logo,
            colorScheme: config.color_scheme,
            secondaryColorScheme: config.secondary_color_scheme
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load company data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [location.pathname, toast]);

  return (
    <CompanyDataContext.Provider value={{ companyData, setCompanyData, loading }}>
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
