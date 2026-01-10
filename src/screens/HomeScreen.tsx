/**
 * Home Screen
 * Main screen showing the daily word and widget configuration
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DailyWord } from '../types';
import { getCurrentDailyWord, refreshDailyWord } from '../services/wordService';
import { updateWidget } from '../services/widgetService';
import { LanguageSelector } from '../components/LanguageSelector';

export const HomeScreen: React.FC = () => {
  const [dailyWord, setDailyWord] = useState<DailyWord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDailyWord();
  }, []);

  const loadDailyWord = async () => {
    try {
      setLoading(true);
      const word = await getCurrentDailyWord();
      setDailyWord(word);
      // Update widget with the current word
      await updateWidget(word);
    } catch (error) {
      console.error('Error loading daily word:', error);
      Alert.alert('Error', 'Failed to load daily word');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const word = await refreshDailyWord();
      setDailyWord(word);
      await updateWidget(word);
      Alert.alert('Success', 'Word refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing word:', error);
      Alert.alert('Error', 'Failed to refresh word');
    } finally {
      setRefreshing(false);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      // Language change triggers a new word fetch
      setLoading(true);
      const word = await refreshDailyWord();
      setDailyWord(word);
      await updateWidget(word);
    } catch (error) {
      console.error('Error loading word for new language:', error);
      Alert.alert('Error', 'Failed to load word for selected language');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading daily word...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Word</Text>
          <Text style={styles.subtitle}>Your word of the day</Text>
        </View>

        <View style={styles.languageSelectorContainer}>
          <Text style={styles.sectionLabel}>Language</Text>
          <LanguageSelector onLanguageChange={handleLanguageChange} />
        </View>

        {dailyWord && (
          <View style={styles.wordCard}>
            <View style={styles.wordHeader}>
              <Text style={styles.word}>{dailyWord.word}</Text>
              {dailyWord.phonetic && (
                <Text style={styles.phonetic}>{dailyWord.phonetic}</Text>
              )}
            </View>

            {dailyWord.partOfSpeech && (
              <Text style={styles.partOfSpeech}>{dailyWord.partOfSpeech}</Text>
            )}

            <Text style={styles.definition}>{dailyWord.definition}</Text>

            {dailyWord.example && (
              <View style={styles.exampleContainer}>
                <Text style={styles.exampleLabel}>Example:</Text>
                <Text style={styles.example}>{dailyWord.example}</Text>
              </View>
            )}

            <Text style={styles.date}>
              {new Date(dailyWord.date).toLocaleDateString()}
            </Text>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.refreshButtonText}>Refresh Word</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.widgetInfoContainer}>
          <Text style={styles.widgetInfoTitle}>Widget Setup</Text>
          <Text style={styles.widgetInfoText}>
            {Platform.OS === 'ios'
              ? 'To add the widget to your lock screen:\n1. Long press on your lock screen\n2. Tap "Customize"\n3. Tap the widget area\n4. Add "Daily Word Widget"'
              : 'To add the widget to your home screen:\n1. Long press on your home screen\n2. Tap "Widgets"\n3. Find "Daily Word Widget"\n4. Drag it to your home screen'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  languageSelectorContainer: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wordHeader: {
    marginBottom: 12,
  },
  word: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  phonetic: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
  },
  partOfSpeech: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  definition: {
    fontSize: 18,
    color: '#000',
    lineHeight: 26,
    marginBottom: 16,
  },
  exampleContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  exampleLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  example: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
  date: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  widgetInfoContainer: {
    backgroundColor: '#E8F4F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  widgetInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  widgetInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
