// API endpoints
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  WEBSITES: '/api/websites',
  TEMPLATES: '/api/templates',
  ANALYTICS: '/api/analytics',
} as const;

// Theme constants
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  TEMPLATES: '/templates',
  WEBSITES: '/websites',
  SETTINGS: '/settings',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  THEME: 'theme',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_CHATBOT: true,
  ENABLE_ANALYTICS: true,
  ENABLE_MULTI_TENANT: true,
} as const;

// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const; 