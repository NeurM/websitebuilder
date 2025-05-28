export interface TemplateData {
  description: string;
  logo: string;
  basePath: string;
  navItems: { name: string; path: string }[];
  contactInfo: { address: string; phone: string; email: string };
}

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  content: Record<string, any>;
  metadata: {
    author: string;
    version: string;
    lastUpdated: string;
    tags: string[];
  };
  settings: {
    isPublic: boolean;
    isFeatured: boolean;
    category: string;
  };
}
