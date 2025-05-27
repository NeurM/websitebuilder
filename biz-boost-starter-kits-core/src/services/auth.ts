import axios from 'axios';
import { User } from '@/types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
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
      const response = await axios.post(`${API_URL}/auth/login/`, { email, password });
      const { token, user } = response.data;
      this.setToken(token);
      return { token, user };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/register/`, { email, password, name });
      const { token, user } = response.data;
      this.setToken(token);
      return { token, user };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async logout(): Promise<void> {
    try {
      await axios.post(`${API_URL}/auth/logout/`);
      this.clearToken();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async getCurrentUser(): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/auth/user/`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
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
  }

  public getAuthHeaders(): { Authorization: string } {
    return {
      Authorization: `Token ${this.token}`,
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