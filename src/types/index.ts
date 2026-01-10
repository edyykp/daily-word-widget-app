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

// Word-related types
export interface WordDefinition {
  definition: string;
  partOfSpeech: string;
  example?: string;
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }>;
  }>;
  sourceUrls?: string[];
}

export interface DailyWord {
  word: string;
  definition: string;
  phonetic?: string;
  partOfSpeech?: string;
  example?: string;
  date: string; // ISO date string
  language?: string; // Language code (e.g., 'en', 'es')
}

// Navigation types (when using React Navigation)
// export type RootStackParamList = {
//   Home: undefined;
//   Profile: { userId: string };
// };
