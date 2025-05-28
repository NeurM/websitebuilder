import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/public/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem('token');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Try Django JWT first
      try {
        const response = await axios.post(`${API_URL}/token/`, { email, password });
        const { access, refresh, user } = response.data;
        this.setToken(access);
        localStorage.setItem('refresh_token', refresh);
        return { token: access, user };
      } catch (djangoError) {
        console.warn('Django auth failed, trying Supabase:', djangoError);
        
        // Fallback to Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Convert Supabase user to our User type
        const user: User = {
          id: data.user.id,
          username: data.user.email || '',
          email: data.user.email || '',
          first_name: data.user.user_metadata?.full_name?.split(' ')[0] || '',
          last_name: data.user.user_metadata?.full_name?.split(' ')[1] || '',
          date_joined: data.user.created_at,
          last_login: data.user.last_sign_in_at || null,
          is_active: true,
          is_staff: false,
          is_superuser: false,
        };
        
        this.setToken(data.session?.access_token || '');
        return { token: data.session?.access_token || '', user };
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // Try Django JWT first
      try {
        const response = await axios.post(`${API_URL}/users/`, { email, password, name });
        const { access, refresh, user } = response.data;
        this.setToken(access);
        localStorage.setItem('refresh_token', refresh);
        return { token: access, user };
      } catch (djangoError) {
        console.warn('Django registration failed, trying Supabase:', djangoError);
        
        // Fallback to Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        
        if (error) throw error;
        
        // Convert Supabase user to our User type
        const user: User = {
          id: data.user?.id || '',
          username: data.user?.email || '',
          email: data.user?.email || '',
          first_name: name.split(' ')[0],
          last_name: name.split(' ')[1] || '',
          date_joined: data.user?.created_at || new Date().toISOString(),
          last_login: null,
          is_active: true,
          is_staff: false,
          is_superuser: false,
        };
        
        this.setToken(data.session?.access_token || '');
        return { token: data.session?.access_token || '', user };
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async logout(): Promise<void> {
    try {
      // Try Django JWT first
      try {
        await axios.post(`${API_URL}/token/blacklist/`, { refresh_token: localStorage.getItem('refresh_token') });
      } catch (djangoError) {
        console.warn('Django logout failed, trying Supabase:', djangoError);
        // Fallback to Supabase
        await supabase.auth.signOut();
      }
    } catch (error) {
      throw this.handleError(error);
    } finally {
      this.clearToken();
    }
  }

  public async getCurrentUser(): Promise<User> {
    try {
      // Try Django JWT first
      try {
        const response = await axios.get(`${API_URL}/users/me/`, {
          headers: this.getAuthHeaders(),
        });
        return response.data;
      } catch (djangoError) {
        console.warn('Django getCurrentUser failed, trying Supabase:', djangoError);
        
        // Fallback to Supabase
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        // Convert Supabase user to our User type
        return {
          id: data.user.id,
          username: data.user.email || '',
          email: data.user.email || '',
          first_name: data.user.user_metadata?.full_name?.split(' ')[0] || '',
          last_name: data.user.user_metadata?.full_name?.split(' ')[1] || '',
          date_joined: data.user.created_at,
          last_login: data.user.last_sign_in_at || null,
          is_active: true,
          is_staff: false,
          is_superuser: false,
        };
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  private clearToken(): void {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  }

  public getAuthHeaders(): { Authorization: string } {
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  private handleError(error: any): Error {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up request');
    }
  }
}

export const authService = AuthService.getInstance(); 