/**
 * Supported languages with country flags
 * Based on dictionaryapi.dev supported languages
 */

export interface Language {
  code: string; // ISO 639-1 language code
  name: string; // Display name
  flag: string; // Country flag emoji or code
  nativeName?: string; // Native language name
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    nativeName: 'English',
  },
  {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    nativeName: 'Español',
  },
  {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    nativeName: 'Français',
  },
  {
    code: 'de',
    name: 'German',
    flag: '🇩🇪',
    nativeName: 'Deutsch',
  },
  {
    code: 'it',
    name: 'Italian',
    flag: '🇮🇹',
    nativeName: 'Italiano',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    flag: '🇵🇹',
    nativeName: 'Português',
  },
  {
    code: 'ru',
    name: 'Russian',
    flag: '🇷🇺',
    nativeName: 'Русский',
  },
  {
    code: 'ja',
    name: 'Japanese',
    flag: '🇯🇵',
    nativeName: '日本語',
  },
  {
    code: 'ko',
    name: 'Korean',
    flag: '🇰🇷',
    nativeName: '한국어',
  },
  {
    code: 'zh',
    name: 'Chinese',
    flag: '🇨🇳',
    nativeName: '中文',
  },
  {
    code: 'ar',
    name: 'Arabic',
    flag: '🇸🇦',
    nativeName: 'العربية',
  },
  {
    code: 'hi',
    name: 'Hindi',
    flag: '🇮🇳',
    nativeName: 'हिन्दी',
  },
  {
    code: 'tr',
    name: 'Turkish',
    flag: '🇹🇷',
    nativeName: 'Türkçe',
  },
  {
    code: 'nl',
    name: 'Dutch',
    flag: '🇳🇱',
    nativeName: 'Nederlands',
  },
  {
    code: 'pl',
    name: 'Polish',
    flag: '🇵🇱',
    nativeName: 'Polski',
  },
];

export const DEFAULT_LANGUAGE: Language = SUPPORTED_LANGUAGES[0]; // English

export const getLanguageByCode = (code: string): Language => {
  return (
    SUPPORTED_LANGUAGES.find(lang => lang.code === code) || DEFAULT_LANGUAGE
  );
};
