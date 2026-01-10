/**
 * Application constants
 * Centralized constants used throughout the app
 */

// API endpoints
export const API_BASE_URL = 'https://api.example.com';

// App configuration
export const APP_NAME = 'DailyWordWidget';
export const APP_VERSION = '1.0.0';

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_DATA: '@user_data',
  THEME: '@theme',
} as const;

// Re-export languages
export * from './languages';

// Screen names (when using navigation)
// export const SCREENS = {
//   HOME: 'Home',
//   PROFILE: 'Profile',
// } as const;
