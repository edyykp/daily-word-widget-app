/**
 * Word Service
 * Manages daily word fetching and updates
 */

import { DailyWord, DictionaryEntry } from '../types';
import { fetchRandomWordWithDefinition, fetchWordDefinition } from './api';
import {
  getDailyWord,
  saveDailyWord,
  shouldUpdateWordWithLanguage,
  getSelectedLanguage,
} from './storage';

/**
 * Converts a DictionaryEntry to a DailyWord format
 */
const convertToDailyWord = (
  entry: DictionaryEntry,
  languageCode: string = 'en',
): DailyWord => {
  const firstMeaning = entry.meanings[0];
  const firstDefinition = firstMeaning?.definitions[0];

  return {
    word: entry.word,
    definition: firstDefinition?.definition || 'No definition available',
    phonetic: entry.phonetic,
    partOfSpeech: firstMeaning?.partOfSpeech,
    example: firstDefinition?.example,
    date: new Date().toISOString(),
    language: languageCode,
  };
};

/**
 * Fetches and saves a new daily word for the specified language
 */
export const fetchAndSaveDailyWord = async (
  languageCode: string = 'en',
): Promise<DailyWord> => {
  try {
    const dictionaryEntry = await fetchRandomWordWithDefinition(languageCode);

    if (!dictionaryEntry) {
      // Fallback to a default word if API fails
      const fallbackWord = languageCode === 'en' ? 'hello' : 'bonjour';
      const fallbackEntry = await fetchWordDefinition(
        fallbackWord,
        languageCode,
      );
      if (!fallbackEntry) {
        throw new Error('Failed to fetch word definition');
      }
      const dailyWord = convertToDailyWord(fallbackEntry, languageCode);
      await saveDailyWord(dailyWord);
      return dailyWord;
    }

    const dailyWord = convertToDailyWord(dictionaryEntry, languageCode);
    await saveDailyWord(dailyWord);
    return dailyWord;
  } catch (error) {
    console.error('Error fetching and saving daily word:', error);
    throw error;
  }
};

/**
 * Gets the current daily word, fetching a new one if needed
 */
export const getCurrentDailyWord = async (): Promise<DailyWord> => {
  try {
    const selectedLanguage = await getSelectedLanguage();
    const existingWord = await getDailyWord();

    // Check if we need to update (new day or language changed)
    const needsUpdate = await shouldUpdateWordWithLanguage(selectedLanguage);

    if (needsUpdate || !existingWord) {
      // Fetch a new word for today with selected language
      return await fetchAndSaveDailyWord(selectedLanguage);
    }

    // Return the existing word if it's still valid
    return existingWord;
  } catch (error) {
    console.error('Error getting current daily word:', error);
    // Return a fallback word if everything fails
    const existingWord = await getDailyWord();
    if (existingWord) {
      return existingWord;
    }

    // Last resort: return a hardcoded word
    return {
      word: 'hello',
      definition: 'a greeting or expression of goodwill',
      date: new Date().toISOString(),
      language: 'en',
    };
  }
};

/**
 * Forces a refresh of the daily word
 */
export const refreshDailyWord = async (): Promise<DailyWord> => {
  const selectedLanguage = await getSelectedLanguage();
  return await fetchAndSaveDailyWord(selectedLanguage);
};

export default {
  getCurrentDailyWord,
  fetchAndSaveDailyWord,
  refreshDailyWord,
};
