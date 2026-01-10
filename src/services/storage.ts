/**
 * Storage service
 * Handles local storage using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyWord } from '../types';

const DAILY_WORD_KEY = '@DailyWordWidget:dailyWord';
const LAST_UPDATE_DATE_KEY = '@DailyWordWidget:lastUpdateDate';
const SELECTED_LANGUAGE_KEY = '@DailyWordWidget:selectedLanguage';

/**
 * Stores the daily word
 */
export const saveDailyWord = async (word: DailyWord): Promise<void> => {
  try {
    await AsyncStorage.setItem(DAILY_WORD_KEY, JSON.stringify(word));
    await AsyncStorage.setItem(LAST_UPDATE_DATE_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error saving daily word:', error);
    throw error;
  }
};

/**
 * Retrieves the stored daily word
 */
export const getDailyWord = async (): Promise<DailyWord | null> => {
  try {
    const wordData = await AsyncStorage.getItem(DAILY_WORD_KEY);
    if (!wordData) {
      return null;
    }
    return JSON.parse(wordData) as DailyWord;
  } catch (error) {
    console.error('Error retrieving daily word:', error);
    return null;
  }
};

/**
 * Gets the last update date
 */
export const getLastUpdateDate = async (): Promise<Date | null> => {
  try {
    const dateString = await AsyncStorage.getItem(LAST_UPDATE_DATE_KEY);
    if (!dateString) {
      return null;
    }
    return new Date(dateString);
  } catch (error) {
    console.error('Error retrieving last update date:', error);
    return null;
  }
};

/**
 * Checks if the word needs to be updated (if it's a new day)
 */
export const shouldUpdateWord = async (): Promise<boolean> => {
  try {
    const lastUpdate = await getLastUpdateDate();
    if (!lastUpdate) {
      return true;
    }

    const today = new Date();
    const lastUpdateDate = new Date(lastUpdate);

    // Check if it's a different day
    return (
      today.getFullYear() !== lastUpdateDate.getFullYear() ||
      today.getMonth() !== lastUpdateDate.getMonth() ||
      today.getDate() !== lastUpdateDate.getDate()
    );
  } catch (error) {
    console.error('Error checking if word should update:', error);
    return true;
  }
};

/**
 * Saves the selected language
 */
export const saveSelectedLanguage = async (
  languageCode: string,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(SELECTED_LANGUAGE_KEY, languageCode);
  } catch (error) {
    console.error('Error saving selected language:', error);
    throw error;
  }
};

/**
 * Gets the selected language code
 */
export const getSelectedLanguage = async (): Promise<string> => {
  try {
    const languageCode = await AsyncStorage.getItem(SELECTED_LANGUAGE_KEY);
    return languageCode || 'en'; // Default to English
  } catch (error) {
    console.error('Error retrieving selected language:', error);
    return 'en';
  }
};

/**
 * Checks if the word needs to be updated (if it's a new day or language changed)
 */
export const shouldUpdateWordWithLanguage = async (
  currentLanguage: string,
): Promise<boolean> => {
  try {
    const needsDayUpdate = await shouldUpdateWord();
    if (needsDayUpdate) {
      return true;
    }

    // Check if language changed
    const storedWord = await getDailyWord();

    // If stored word exists but language doesn't match, update
    if (storedWord && storedWord.language !== currentLanguage) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking if word should update with language:', error);
    return true;
  }
};

/**
 * Clears all stored data
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DAILY_WORD_KEY);
    await AsyncStorage.removeItem(LAST_UPDATE_DATE_KEY);
    await AsyncStorage.removeItem(SELECTED_LANGUAGE_KEY);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

export default {
  saveDailyWord,
  getDailyWord,
  getLastUpdateDate,
  shouldUpdateWord,
  shouldUpdateWordWithLanguage,
  saveSelectedLanguage,
  getSelectedLanguage,
  clearStorage,
};
