/**
 * Word Service
 * Manages daily word fetching and updates
 */

import { DailyWord, DictionaryEntry } from '../types';
import { fetchRandomWordWithDefinition, fetchWordDefinition } from './api';
import { getDailyWord, saveDailyWord, shouldUpdateWord } from './storage';

/**
 * Converts a DictionaryEntry to a DailyWord format
 */
const convertToDailyWord = (entry: DictionaryEntry): DailyWord => {
  const firstMeaning = entry.meanings[0];
  const firstDefinition = firstMeaning?.definitions[0];

  return {
    word: entry.word,
    definition: firstDefinition?.definition || 'No definition available',
    phonetic: entry.phonetic,
    partOfSpeech: firstMeaning?.partOfSpeech,
    example: firstDefinition?.example,
    date: new Date().toISOString(),
  };
};

/**
 * Fetches and saves a new daily word
 */
export const fetchAndSaveDailyWord = async (): Promise<DailyWord> => {
  try {
    const dictionaryEntry = await fetchRandomWordWithDefinition();

    if (!dictionaryEntry) {
      // Fallback to a default word if API fails
      const fallbackEntry = await fetchWordDefinition('hello');
      if (!fallbackEntry) {
        throw new Error('Failed to fetch word definition');
      }
      const dailyWord = convertToDailyWord(fallbackEntry);
      await saveDailyWord(dailyWord);
      return dailyWord;
    }

    const dailyWord = convertToDailyWord(dictionaryEntry);
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
    const needsUpdate = await shouldUpdateWord();

    if (needsUpdate) {
      // Fetch a new word for today
      return await fetchAndSaveDailyWord();
    }

    // Return the existing word
    const existingWord = await getDailyWord();
    if (!existingWord) {
      // No word exists, fetch a new one
      return await fetchAndSaveDailyWord();
    }

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
    };
  }
};

/**
 * Forces a refresh of the daily word
 */
export const refreshDailyWord = async (): Promise<DailyWord> => {
  return await fetchAndSaveDailyWord();
};

export default {
  getCurrentDailyWord,
  fetchAndSaveDailyWord,
  refreshDailyWord,
};
