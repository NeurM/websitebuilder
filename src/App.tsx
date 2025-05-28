import { BrowserRouter as Router } from 'react-router-dom';
import { AppProviders } from '@/components/AppProviders';
import GlobalErrorHandler from '@/components/ErrorBoundary';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <GlobalErrorHandler>
      <Router>
        <AppProviders>
          <Outlet />
        </AppProviders>
      </Router>
    </GlobalErrorHandler>
  );
}

export default App;
