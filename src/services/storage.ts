/**
 * Storage service
 * Handles local storage using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyWord } from '../types';

const DAILY_WORD_KEY = '@DailyWordWidget:dailyWord';
const LAST_UPDATE_DATE_KEY = '@DailyWordWidget:lastUpdateDate';

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
 * Clears all stored data
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DAILY_WORD_KEY);
    await AsyncStorage.removeItem(LAST_UPDATE_DATE_KEY);
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
  clearStorage,
};
