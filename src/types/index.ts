/**
 * TypeScript type definitions
 * Shared types and interfaces used across the application
 */

// Example types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Navigation types (when using React Navigation)
// export type RootStackParamList = {
//   Home: undefined;
//   Profile: { userId: string };
// };
