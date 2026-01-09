/**
 * Widget Service
 * Bridge service to communicate with native widget code
 */

import { NativeModules, Platform } from 'react-native';
import { DailyWord } from '../types';

const { WidgetModule } = NativeModules;

/**
 * Updates the widget with the current daily word
 */
export const updateWidget = async (word: DailyWord): Promise<void> => {
  try {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      if (WidgetModule && typeof WidgetModule.updateWidget === 'function') {
        await WidgetModule.updateWidget({
          word: word.word,
          definition: word.definition,
          phonetic: word.phonetic || '',
          partOfSpeech: word.partOfSpeech || '',
          example: word.example || '',
          date: word.date,
        });
      } else {
        console.warn('WidgetModule not available');
      }
    }
  } catch (error) {
    console.error('Error updating widget:', error);
    // Don't throw - widget update is not critical for app functionality
  }
};

/**
 * Requests widget reload (for iOS WidgetKit)
 */
export const reloadWidget = async (): Promise<void> => {
  try {
    if (Platform.OS === 'ios') {
      if (WidgetModule && typeof WidgetModule.reloadWidget === 'function') {
        await WidgetModule.reloadWidget();
      } else {
        console.warn('WidgetModule not available');
      }
    }
  } catch (error) {
    console.error('Error reloading widget:', error);
    // Don't throw - widget reload is not critical
  }
};

export default {
  updateWidget,
  reloadWidget,
};
