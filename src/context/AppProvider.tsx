import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ChatbotProvider } from '@/context/ChatbotContext';
import { ToastProvider } from '@/context/ToastContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ChatbotProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ChatbotProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}; 