/**
 * API service
 * Centralized API calls and HTTP client configuration
 */

import { DictionaryEntry } from '../types';

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const RANDOM_WORD_API = 'https://random-word-api.herokuapp.com/word';

/**
 * Fetches a random word from the random word API
 */
export const fetchRandomWord = async (): Promise<string> => {
  try {
    const response = await fetch(RANDOM_WORD_API);
    if (!response.ok) {
      throw new Error('Failed to fetch random word');
    }
    const words: string[] = await response.json();
    return words[0] || 'hello';
  } catch (error) {
    console.error('Error fetching random word:', error);
    // Fallback to a default word if API fails
    return 'hello';
  }
};

/**
 * Fetches word definition from the dictionary API
 */
export const fetchWordDefinition = async (
  word: string,
): Promise<DictionaryEntry | null> => {
  try {
    const response = await fetch(
      `${DICTIONARY_API_BASE}/${word.toLowerCase()}`,
    );
    if (!response.ok) {
      if (response.status === 404) {
        // Word not found, try fetching a new random word
        return null;
      }
      throw new Error('Failed to fetch word definition');
    }
    const entries: DictionaryEntry[] = await response.json();
    return entries[0] || null;
  } catch (error) {
    console.error('Error fetching word definition:', error);
    return null;
  }
};

/**
 * Fetches a random word with its definition
 * Retries with a new word if the current word doesn't have a definition
 */
export const fetchRandomWordWithDefinition = async (
  maxRetries: number = 5,
): Promise<DictionaryEntry | null> => {
  for (let i = 0; i < maxRetries; i++) {
    const word = await fetchRandomWord();
    const definition = await fetchWordDefinition(word);

    if (definition) {
      return definition;
    }

    // Wait a bit before retrying to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // If all retries fail, return a fallback word
  return fetchWordDefinition('hello');
};

export default {
  fetchRandomWord,
  fetchWordDefinition,
  fetchRandomWordWithDefinition,
};
