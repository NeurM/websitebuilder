import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          // TODO: Replace with actual API call
          const mockUser: User = {
            id: '1',
            username: 'test@example.com',
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            date_joined: new Date().toISOString(),
            last_login: new Date().toISOString(),
            is_active: true,
            is_staff: false,
            is_superuser: false,
          };
          setUser(mockUser);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: '1',
        username: email,
        email: email,
        first_name: 'Test',
        last_name: 'User',
        date_joined: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        is_staff: false,
        is_superuser: false,
      };
      localStorage.setItem('token', 'mock-token');
      setUser(mockUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: '1',
        username: email,
        email: email,
        first_name: name.split(' ')[0] || '',
        last_name: name.split(' ').slice(1).join(' ') || '',
        date_joined: new Date().toISOString(),
        last_login: new Date().toISOString(),
        is_active: true,
        is_staff: false,
        is_superuser: false,
      };
      localStorage.setItem('token', 'mock-token');
      setUser(mockUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setLoading(true);
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to logout';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
