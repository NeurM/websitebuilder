import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getWebsiteConfig, saveWebsiteConfig } from '@/utils/supabase';
import { toast } from '@/hooks/use-toast';

interface TemplateThemeContextProps {
  templateColor: string;
  setTemplateColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  previousTemplateColor: string | null;
  undoTemplateColorChange: () => void;
  templateType: string;
  colorClasses: {
    bg: string;
    text: string;
    hover: string;
    muted: string;
    border: string;
    secondaryBg: string;
    secondaryText: string;
    secondaryHover: string;
    secondaryMuted: string;
    secondaryBorder: string;
  };
}

const TemplateThemeContext = createContext<TemplateThemeContextProps>({
  templateColor: 'blue',
  setTemplateColor: () => {},
  secondaryColor: 'orange',
  setSecondaryColor: () => {},
  previousTemplateColor: null,
  undoTemplateColorChange: () => {},
  templateType: '',
  colorClasses: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-700',
    muted: 'text-blue-500',
    border: 'border-blue-600',
    secondaryBg: 'bg-orange-600',
    secondaryText: 'text-orange-600',
    secondaryHover: 'hover:bg-orange-700',
    secondaryMuted: 'text-orange-500',
    secondaryBorder: 'border-orange-600',
  },
});

export const useTemplateTheme = () => useContext(TemplateThemeContext);

export const TemplateThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let pathname = '/';
  try {
    const location = useLocation();
    pathname = location?.pathname || '/';
  } catch (error) {
    console.warn('Router not yet initialized:', error);
  }
  
  const getTemplateTypeFromPath = (path: string) => {
    if (path.startsWith('/tradecraft')) return 'tradecraft';
    if (path.startsWith('/retail')) return 'retail';
    if (path.startsWith('/service')) return 'service';
    if (path.startsWith('/expert')) return 'expert';
    if (path.startsWith('/cleanslate')) return 'cleanslate';
    return '';
  };
  
  const getDefaultColors = (template: string) => {
    switch (template) {
      case 'cleanslate': return { primary: 'black', secondary: 'gray' };
      case 'tradecraft': return { primary: 'blue', secondary: 'orange' };
      case 'retail': return { primary: 'purple', secondary: 'pink' };
      case 'service': return { primary: 'teal', secondary: 'green' };
      case 'expert': return { primary: 'amber', secondary: 'yellow' };
      default: return { primary: 'blue', secondary: 'orange' };
    }
  };
  
  const templateType = getTemplateTypeFromPath(pathname);
  const defaultColors = getDefaultColors(templateType);
  
  const [templateColor, setTemplateColor] = useState<string>(defaultColors.primary);
  const [secondaryColor, setSecondaryColor] = useState<string>(defaultColors.secondary);
  const [previousTemplateColor, setPreviousTemplateColor] = useState<string | null>(null);
  const [previousSecondaryColor, setPreviousSecondaryColor] = useState<string | null>(null);

  // Update colors when pathname changes
  useEffect(() => {
    try {
      const newTemplateType = getTemplateTypeFromPath(pathname);
      const newDefaultColors = getDefaultColors(newTemplateType);
      setTemplateColor(newDefaultColors.primary);
      setSecondaryColor(newDefaultColors.secondary);
    } catch (error) {
      console.warn('Error updating colors:', error);
    }
  }, [pathname]);
  
  const updateTemplateColor = async (color: string) => {
    setPreviousTemplateColor(templateColor);
    setTemplateColor(color);
    
    // Check sessionStorage for companyData first
    try {
      const sessionData = sessionStorage.getItem('companyData');
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        // Update the color in sessionStorage
        parsedData.colorScheme = color;
        sessionStorage.setItem('companyData', JSON.stringify(parsedData));
      }
      
      // Update in database if template is specified
      if (templateType) {
        try {
          const { data: config } = await getWebsiteConfig(templateType);
          if (config) {
            await saveWebsiteConfig({
              template_id: templateType,
              company_name: config.company_name,
              domain_name: config.domain_name,
              logo: config.logo,
              color_scheme: color,
              secondary_color_scheme: secondaryColor
            });
            
            toast({
              title: "Color Updated",
              description: "Primary color has been updated successfully.",
            });
          }
        } catch (error) {
          console.error('Error saving color scheme:', error);
        }
      }
    } catch (error) {
      console.error('Error updating color:', error);
    }
  };

  const updateSecondaryColor = async (color: string) => {
    setPreviousSecondaryColor(secondaryColor);
    setSecondaryColor(color);
    
    // Check sessionStorage for companyData first
    try {
      const sessionData = sessionStorage.getItem('companyData');
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        // Update the secondary color in sessionStorage
        parsedData.secondaryColorScheme = color;
        sessionStorage.setItem('companyData', JSON.stringify(parsedData));
      }
      
      // Update in database if template is specified
      if (templateType) {
        try {
          const { data: config } = await getWebsiteConfig(templateType);
          if (config) {
            await saveWebsiteConfig({
              template_id: templateType,
              company_name: config.company_name,
              domain_name: config.domain_name,
              logo: config.logo,
              color_scheme: templateColor,
              secondary_color_scheme: color
            });
            
            toast({
              title: "Color Updated",
              description: "Secondary color has been updated successfully.",
            });
          }
        } catch (error) {
          console.error('Error saving secondary color scheme:', error);
        }
      }
    } catch (error) {
      console.error('Error updating secondary color:', error);
    }
  };

  const undoTemplateColorChange = async () => {
    if (previousTemplateColor || previousSecondaryColor) {
      const defaultColors = getDefaultColors(templateType);
      setTemplateColor(previousTemplateColor || defaultColors.primary);
      setSecondaryColor(previousSecondaryColor || defaultColors.secondary);
      setPreviousTemplateColor(null);
      setPreviousSecondaryColor(null);
      
      // Check sessionStorage for companyData first
      try {
        const sessionData = sessionStorage.getItem('companyData');
        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          // Update the colors in sessionStorage
          parsedData.colorScheme = previousTemplateColor || defaultColors.primary;
          parsedData.secondaryColorScheme = previousSecondaryColor || defaultColors.secondary;
          sessionStorage.setItem('companyData', JSON.stringify(parsedData));
        }
        
        // Update in database if template is specified
        if (templateType) {
          try {
            const { data: config } = await getWebsiteConfig(templateType);
            if (config) {
              await saveWebsiteConfig({
                template_id: templateType,
                company_name: config.company_name,
                domain_name: config.domain_name,
                logo: config.logo,
                color_scheme: previousTemplateColor || defaultColors.primary,
                secondary_color_scheme: previousSecondaryColor || defaultColors.secondary
              });
              
              toast({
                title: "Colors Restored",
                description: "Colors have been restored to their previous values.",
              });
            }
          } catch (error) {
            console.error('Error restoring color scheme:', error);
          }
        }
      } catch (error) {
        console.error('Error restoring colors:', error);
      }
    }
  };

  const getColorClasses = (primaryColor: string, secondaryColor: string) => {
    const safeColor = (color: string) => {
      const validColors = ['blue', 'green', 'red', 'yellow', 'purple', 'pink', 'indigo', 'gray', 'black', 'white', 'orange', 'teal', 'amber'];
      return validColors.includes(color) ? color : 'blue';
    };

    const primary = safeColor(primaryColor);
    const secondary = safeColor(secondaryColor);

    return {
      bg: `bg-${primary}-600`,
      text: `text-${primary}-600`,
      hover: `hover:bg-${primary}-700`,
      muted: `text-${primary}-500`,
      border: `border-${primary}-600`,
      secondaryBg: `bg-${secondary}-600`,
      secondaryText: `text-${secondary}-600`,
      secondaryHover: `hover:bg-${secondary}-700`,
      secondaryMuted: `text-${secondary}-500`,
      secondaryBorder: `border-${secondary}-600`,
    };
  };

  const value = {
    templateColor,
    setTemplateColor: updateTemplateColor,
    secondaryColor,
    setSecondaryColor: updateSecondaryColor,
    previousTemplateColor,
    undoTemplateColorChange,
    templateType,
    colorClasses: getColorClasses(templateColor, secondaryColor),
  };

  return (
    <TemplateThemeContext.Provider value={value}>
      {children}
    </TemplateThemeContext.Provider>
  );
};
