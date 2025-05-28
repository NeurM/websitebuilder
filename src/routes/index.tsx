import { createBrowserRouter } from 'react-router-dom';
import { retailRoutes } from './retailRoutes';
import { expertRoutes } from './expertRoutes';
import LandingPage from '../pages/LandingPage';

// Create a root route that will be the default landing page
const rootRoute = {
  path: '/',
  element: <LandingPage />,
};

// Combine all routes
export const router = createBrowserRouter([
  rootRoute,
  ...retailRoutes,
  ...expertRoutes,
]); 