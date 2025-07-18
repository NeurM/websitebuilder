import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import { expertRoutes } from './routes/expertRoutes';
import { tradecraftRoutes } from './routes/tradecraftRoutes';
import { retailRoutes } from './routes/retailRoutes';
import { serviceRoutes } from './routes/serviceRoutes';
import { ErrorBoundary } from 'react-error-boundary';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { TemplateThemeProvider } from '@/context/TemplateThemeContext';
import { CompanyDataProvider } from '@/context/CompanyDataContext';

// Use direct imports instead of dynamic imports for core pages
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import WebsiteEditor from './pages/WebsiteEditor';
import SavedWebsites from './pages/SavedWebsites';
import NotFound from './pages/NotFound';
import CleanSlate from './templates/cleanslate/CleanSlate';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import PreviewPage from './pages/PreviewPage';

// Loading fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Error fallback
const ErrorFallback = ({error}: {error?: Error}) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50">
    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
    <p className="text-gray-700 mb-4">We've encountered an error while loading this page.</p>
    {error && (
      <div className="mb-4 p-4 bg-red-100 rounded max-w-md overflow-auto">
        <p className="font-medium text-red-800">{error.message}</p>
      </div>
    )}
    <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Return to Home
    </a>
  </div>
);

// Website Editor Wrapper component that gets the template from URL params
const EditorWrapper: React.FC = () => {
  const { template } = useParams<{ template: string }>();
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <WebsiteEditor template={template || ''} />
    </ErrorBoundary>
  );
};

// Wrap all routes with Suspense and ErrorBoundary
const withSuspense = (Component: React.ComponentType<any>) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

// Main app routes (higher z-index navbars)
const mainRoutes = [
  {
    path: '/',
    element: (
      <TemplateThemeProvider>
        <CompanyDataProvider>
          <Layout>
            <Index />
          </Layout>
        </CompanyDataProvider>
      </TemplateThemeProvider>
    ),
    errorElement: <ErrorFallback />,
    children: [
      {
        index: true,
        element: withSuspense(Dashboard)
      },
      {
        path: 'templates',
        element: withSuspense(Templates)
      },
      {
        path: 'saved-websites',
        element: withSuspense(SavedWebsites)
      },
      {
        path: 'editor/:template',
        element: withSuspense(EditorWrapper)
      }
    ]
  },
  {
    path: '/auth',
    element: withSuspense(Login),
    errorElement: <ErrorFallback />
  },
  {
    path: '/register',
    element: withSuspense(Register),
    errorElement: <ErrorFallback />
  },
  {
    path: '/preview/:previewId',
    element: withSuspense(PreviewPage),
    errorElement: <ErrorFallback />
  }
];

// Template routes (lower z-index navbars)
const templateRoutes = [
  {
    path: '/cleanslate/*',
    element: withSuspense(CleanSlate),
    errorElement: <ErrorFallback />
  },
  ...expertRoutes,
  ...tradecraftRoutes,
  ...retailRoutes,
  ...serviceRoutes,
];

export const router = createBrowserRouter([
  ...mainRoutes,
  ...templateRoutes,
  {
    path: '*',
    element: withSuspense(NotFound),
    errorElement: <ErrorFallback />
  }
]);

export default router;
