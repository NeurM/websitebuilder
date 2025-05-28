import React from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error first
    console.error('🔴 Error caught in ErrorBoundary:');
    console.error(`• Error: ${error.name}: ${error.message}`);
    console.error(`• Stack: ${error.stack}`);
    console.error(`• Component Stack: ${errorInfo.componentStack}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error handler
const GlobalErrorHandler: React.FC<Props> = ({ children }) => {
  const { toast } = useToast();

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Prevent default error handling
      event.preventDefault();
      
      // Log error first
      console.error('🔴 Global error caught:');
      console.error(`• Message: ${event.message}`);
      console.error(`• Source: ${event.filename}:${event.lineno}:${event.colno}`);
      console.error(`• Error: ${event.error?.stack || 'No stack trace'}`);
      
      // Then show toast
      toast({
        title: 'Error',
        description: event.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });

      // Return true to prevent the error from propagating
      return true;
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Prevent default error handling
      event.preventDefault();
      
      // Log error first
      console.error('🔴 Unhandled promise rejection:');
      console.error(`• Reason: ${event.reason}`);
      
      // Then show toast
      toast({
        title: 'Error',
        description: event.reason?.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });

      // Return true to prevent the error from propagating
      return true;
    };

    // Add error handlers
    window.addEventListener('error', handleError, true); // Use capture phase
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true); // Use capture phase

    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
    };
  }, [toast]);

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default GlobalErrorHandler; 