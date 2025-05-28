import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';
import { AppProviders } from './components/AppProviders';

// Debug logging setup
const DEBUG = process.env.NODE_ENV === 'development';

const debugLog = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, ...args);
  }
};

// Create a wrapper component that includes the router
const AppWithRouter = () => {
  debugLog('Initializing AppWithRouter');
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
};

debugLog('Starting application render');
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>,
);
debugLog('Application render complete');
