/// <reference types="vite/client" />

declare global {
  interface Window {
    dataLayer: any[];
    fbq: any;
    cookieConsent: {
      accept: () => void;
      decline: () => void;
      getPreferences: () => {
        necessary: boolean;
        analytics: boolean;
        marketing: boolean;
        preferences: boolean;
      };
    };
  }
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {}; 