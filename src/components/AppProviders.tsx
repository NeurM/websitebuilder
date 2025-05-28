import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from '@/components/ui/toaster';

// Debug logging setup
const DEBUG = process.env.NODE_ENV === 'development';

const debugLog = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  debugLog('Initializing AppProviders');
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
        <Toaster />
      </LanguageProvider>
    </AuthProvider>
  );
};
