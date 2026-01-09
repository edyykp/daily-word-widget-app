/**
 * Application configuration
 * Environment-specific and app-wide configuration
 */

// Environment configuration
export const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  environment: process.env.NODE_ENV || 'development',
  enableLogging: __DEV__,
  version: '1.0.0',
};

// Feature flags
export const features = {
  enableAnalytics: true,
  enableCrashReporting: true,
};
