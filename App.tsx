/**
 * Daily Word Widget App
 * Shows a daily word with definition and provides lock screen widget
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from './src/screens/HomeScreen';
import { getCurrentDailyWord } from './src/services/wordService';
import { updateWidget } from './src/services/widgetService';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Initialize widget on app start
    const initializeWidget = async () => {
      try {
        const word = await getCurrentDailyWord();
        await updateWidget(word);
      } catch (error) {
        console.error('Error initializing widget:', error);
      }
    };

    initializeWidget();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <HomeScreen />
    </SafeAreaProvider>
  );
}

export default App;
