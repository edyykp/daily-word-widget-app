/**
 * API service
 * Centralized API calls and HTTP client configuration
 */

import { DictionaryEntry } from '../types';

const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

// Local dictionary loading (fallbacks to networked random-word API only if the local list is missing)
let DICTIONARY_WORDS: string[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dict = require('../assets/dictionary.json') as Record<string, number>;
  DICTIONARY_WORDS = Object.keys(dict);
} catch (e) {
  console.warn('Local dictionary not found or failed to load:', e);
}

/**
 * Fetches a random word — prefers the bundled `dictionary.json` for offline operation.
 */
export const fetchRandomWord = async (): Promise<string> => {
  // Prefer local dictionary
  if (DICTIONARY_WORDS.length > 0) {
    // Try several attempts to find a word that passes local filters
    for (let i = 0; i < 20; i++) {
      const candidate =
        DICTIONARY_WORDS[Math.floor(Math.random() * DICTIONARY_WORDS.length)];
      const norm = normalizeWord(candidate);
      if (!norm) continue;
      if (isCommonWord(norm)) continue;
      if (norm.length <= 4) continue;
      if (/[^a-z'-]/.test(candidate)) continue;
      return candidate;
    }
  }

  // Fallback to any local word if filters didn't succeed
  return (
    DICTIONARY_WORDS[Math.floor(Math.random() * DICTIONARY_WORDS.length)] ||
    'hello'
  );
};

/**
 * Fetches word definition from the dictionary API (online-first).
 * Falls back to a minimal offline placeholder if network fails; returns null on 404.
 */
export const fetchWordDefinition = async (
  word: string,
): Promise<DictionaryEntry | null> => {
  const normalized = normalizeWord(word);
  if (!normalized) return null;

  try {
    const response = await fetch(`${DICTIONARY_API_BASE}/${normalized}`);
    if (!response.ok) {
      if (response.status === 404) {
        // Not found - let caller retry with another word
        return null;
      }
      throw new Error('Failed to fetch word definition');
    }
    const entries: DictionaryEntry[] = await response.json();
    return entries[0] || null;
  } catch (error) {
    // Network error / offline: return a minimal placeholder so UI still shows something
    console.warn(
      'Online dictionary fetch failed, using minimal fallback:',
      error,
    );
    const entry: DictionaryEntry = {
      word: normalized,
      meanings: [
        {
          partOfSpeech: 'noun',
          definitions: [{ definition: 'Definition not available (offline).' }],
        },
      ],
    };
    return entry;
  }
};

/**
 * A more comprehensive stoplist and heuristics for filtering out very common/simple words.
 *
 * This uses an English stopword list (adapted from common NLP stop lists) and a few
 * simple normalization rules (strip punctuation, simple plural stripping) to better
 * identify function words and common vocabulary that shouldn't be shown as "interesting".
 */
const ENGLISH_STOP_WORDS = new Set<string>([
  'i',
  'me',
  'my',
  'myself',
  'we',
  'our',
  'ours',
  'ourselves',
  'you',
  'your',
  'yours',
  'yourself',
  'yourselves',
  'he',
  'him',
  'his',
  'himself',
  'she',
  'her',
  'hers',
  'herself',
  'it',
  'its',
  'itself',
  'they',
  'them',
  'their',
  'theirs',
  'themselves',
  'what',
  'which',
  'who',
  'whom',
  'this',
  'that',
  'these',
  'those',
  'am',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'having',
  'do',
  'does',
  'did',
  'doing',
  'a',
  'an',
  'the',
  'and',
  'but',
  'if',
  'or',
  'because',
  'as',
  'until',
  'while',
  'of',
  'at',
  'by',
  'for',
  'with',
  'about',
  'against',
  'between',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'to',
  'from',
  'up',
  'down',
  'in',
  'out',
  'on',
  'off',
  'over',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'any',
  'both',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  's',
  't',
  'can',
  'will',
  'just',
  'don',
  'should',
  'now',
  'd',
  'll',
  'm',
  'o',
  're',
  've',
  'y',
  'ain',
  'aren',
  'couldn',
  'didn',
  'doesn',
  'hadn',
  'hasn',
  'haven',
  'isn',
  'ma',
  'mightn',
  'mustn',
  'needn',
  'shan',
  'shouldn',
  'wasn',
  'weren',
  'won',
  'wouldn',
  'please',
  'thanks',
  'thank',
  'hey',
  'ok',
  'okay',
]);

const normalizeWord = (w: string): string => {
  return (w || '')
    .toLowerCase()
    .replace(/[^a-z']/g, '')
    .replace(/^'+|'+$/g, '');
};

const isCommonWord = (word: string): boolean => {
  const n = normalizeWord(word);
  if (!n) return false;
  if (ENGLISH_STOP_WORDS.has(n)) return true;
  // Check simple plural/possessive forms by stripping trailing s or 's
  if (n.endsWith("'s")) {
    if (ENGLISH_STOP_WORDS.has(n.replace(/'s$/, ''))) return true;
  }
  if (n.endsWith('s')) {
    if (ENGLISH_STOP_WORDS.has(n.replace(/s$/, ''))) return true;
  }
  return false;
};

const isInteresting = (entry: DictionaryEntry): boolean => {
  const word = entry.word || '';
  const normalized = normalizeWord(word);
  if (!normalized) return false;

  // Exclude extremely common words and function words
  if (isCommonWord(normalized)) return false;

  // Exclude very short words (<= 4) to prefer less-common vocabulary
  if (normalized.length <= 4) return false;

  // Avoid words with numbers or weird characters
  if (/[^a-z'-]/.test(word)) return false;

  const firstMeaning = entry.meanings?.[0];
  if (firstMeaning) {
    const pos = (firstMeaning.partOfSpeech || '').toLowerCase();
    // Accept nouns, verbs, adjectives, adverbs; avoid pronouns, determiners, conjunctions, prepositions
    if (!/(noun|verb|adject|adv)/.test(pos)) return false;

    const def = firstMeaning.definitions?.[0]?.definition || '';
    // If a definition exists, require it to be reasonably informative (but be lenient for offline placeholders)
    if (def && def.length < 10) return false;
  }

  return true;
};

/**
 * Fetches a random word with its definition
 * Retries with a new word if the current word doesn't have a definition or is too common
 */
export const fetchRandomWordWithDefinition = async (
  maxRetries: number = 10,
): Promise<DictionaryEntry | null> => {
  for (let i = 0; i < maxRetries; i++) {
    const word = await fetchRandomWord();
    const definition = await fetchWordDefinition(word);

    if (definition && isInteresting(definition)) {
      return definition;
    }

    // Wait a bit before retrying to avoid rate limiting
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  }

  // If all retries fail, return a fallback word if it's interesting
  const fallback = await fetchWordDefinition('hello');
  return fallback && isInteresting(fallback) ? fallback : null;
};

export default {
  fetchRandomWord,
  fetchWordDefinition,
  fetchRandomWordWithDefinition,
};
