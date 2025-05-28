import { supabase } from '@/integrations/supabase/client';
import { logApiCall } from './apiLogger';
import { PostgrestError } from '@supabase/supabase-js';

// Helper function to check Supabase initialization
const checkSupabase = () => {
  if (!supabase) {
    const error = new Error('Authentication service is not available. Please try again later.');
    error.name = 'SupabaseInitError';
    throw error;
  }
};

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    checkSupabase();

    const response = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (response.error) {
      await logApiCall('/auth/sign-up', 'POST', { email }, null, response.error);
      throw new Error(response.error.message || 'Failed to sign up');
    }
    
    if (!response.data?.user) {
      throw new Error('No user data received from sign up');
    }
    
    await logApiCall('/auth/sign-up', 'POST', { email }, response.data, undefined);
    return response;
  } catch (error) {
    const errorToLog = error instanceof Error ? error : new Error('Unknown error during sign up');
    await logApiCall('/auth/sign-up', 'POST', { email }, null, errorToLog);
    throw errorToLog;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    checkSupabase();

    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (response.error) {
      await logApiCall('/auth/sign-in', 'POST', { email }, null, response.error);
      throw new Error(response.error.message || 'Failed to sign in');
    }
    
    if (!response.data?.user) {
      throw new Error('No user data received from sign in');
    }
    
    await logApiCall('/auth/sign-in', 'POST', { email }, response.data, undefined);
    return response;
  } catch (error) {
    const errorToLog = error instanceof Error ? error : new Error('Unknown error during sign in');
    await logApiCall('/auth/sign-in', 'POST', { email }, null, errorToLog);
    throw errorToLog;
  }
};

export const signOut = async () => {
  try {
    checkSupabase();

    const response = await supabase.auth.signOut();
    
    if (response.error) {
      await logApiCall('/auth/sign-out', 'POST', null, null, response.error);
      throw new Error(response.error.message || 'Failed to sign out');
    }
    
    await logApiCall('/auth/sign-out', 'POST', null, response, undefined);
    return response;
  } catch (error) {
    const errorToLog = error instanceof Error ? error : new Error('Unknown error during sign out');
    await logApiCall('/auth/sign-out', 'POST', null, null, errorToLog);
    throw errorToLog;
  }
};

export const getCurrentUser = async () => {
  try {
    checkSupabase();

    const response = await supabase.auth.getUser();
    
    if (response.error) {
      await logApiCall('/auth/user', 'GET', null, null, response.error);
      throw new Error(response.error.message || 'Failed to get current user');
    }
    
    if (!response.data?.user) {
      return { data: { user: null } };
    }
    
    await logApiCall('/auth/user', 'GET', null, response.data, undefined);
    return response;
  } catch (error) {
    const errorToLog = error instanceof Error ? error : new Error('Unknown error getting current user');
    await logApiCall('/auth/user', 'GET', null, null, errorToLog);
    throw errorToLog;
  }
};
