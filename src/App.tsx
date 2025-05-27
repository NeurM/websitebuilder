import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Toaster } from '@/components/ui/toaster';

// Import your existing components
import { Home } from '@/pages/Home';
import Templates from '@/pages/Templates';
import { Dashboard } from '@/pages/Dashboard';
import { SavedWebsites } from '@/pages/SavedWebsites';
import { CreateWebsite } from '@/pages/CreateWebsite';
import PreviewPage from '@/pages/PreviewPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/preview/:previewId" element={<PreviewPage />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="templates" element={<Templates />} />
            <Route path="saved-websites" element={<SavedWebsites />} />
            <Route path="create-website" element={<CreateWebsite />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};

export default App;
