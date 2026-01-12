/**
 * API service
 * Centralized API calls and HTTP client configuration
 */

import { DictionaryEntry } from '../types';
import DICTIONARY_WORDS from '../assets/dictionary.json';
const dictionaryWords = DICTIONARY_WORDS as string[];

// Dictionary API base - supports multiple languages via language code
const getDictionaryApiBase = (languageCode: string = 'en'): string => {
  return `https://api.dictionaryapi.dev/api/v2/entries/${languageCode}`;
};

// Helper: fetch a random title from Wiktionary for a specific language
export const fetchRandomWordFromWiktionary = async (
  languageCode: string,
): Promise<string | null> => {
  try {
    const url = `https://${languageCode}.wiktionary.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const json = await resp.json();
    return json?.query?.random?.[0]?.title || null;
  } catch (e) {
    console.warn('Wiktionary fetch failed for', languageCode, e);
    return null;
  }
};

/**
 * Fetches a random word — prefers the bundled `dictionary.json` for offline operation.
 * For non-English languages, uses a random word API.
 */
export const fetchRandomWord = async (
  languageCode: string = 'en',
): Promise<string> => {
  // For English, use local dictionary
  if (languageCode === 'en' && dictionaryWords.length > 0) {
    // Try several attempts to find a word that passes local filters
    for (let i = 0; i < 20; i++) {
      const candidate =
        dictionaryWords[Math.floor(Math.random() * dictionaryWords.length)];
      const norm = normalizeWord(candidate);
      if (!norm) continue;
      if (isCommonWord(norm)) continue;
      if (norm.length <= 4) continue;
      if (/[^a-z'-]/.test(candidate)) continue;
      return candidate;
    }
    // Fallback to any local word if filters didn't succeed
    return (
      dictionaryWords[Math.floor(Math.random() * dictionaryWords.length)] ||
      'hello'
    );
  }

  // Try Wiktionary random word for this language before falling back to English
  try {
    const wikWord = await fetchRandomWordFromWiktionary(languageCode);
    if (wikWord) {
      const norm = normalizeWord(wikWord);
      if (norm) return wikWord;
      // If the word uses non-Latin scripts (normalizeWord strips it), accept non-empty titles
      if (wikWord && wikWord.trim().length > 0) return wikWord;
    }
  } catch (e) {
    console.warn(
      'Wiktionary lookup failed, falling back to local English list',
      e,
    );
  }

  // Last resort: fallback to English word (will need translation/definition)
  console.warn(
    `No word list available for language: ${languageCode}, using English fallback`,
  );
  return (
    dictionaryWords[Math.floor(Math.random() * dictionaryWords.length)] ||
    'hello'
  );
};

/**
 * Fetches word definition from the dictionary API (online-first).
 * Falls back to a minimal offline placeholder if network fails; returns null on 404.
 */
export const fetchWordDefinition = async (
  word: string,
  languageCode: string = 'en',
): Promise<DictionaryEntry | null> => {
  const normalized = normalizeWord(word);
  if (!normalized) return null;

  try {
    const apiBase = getDictionaryApiBase(languageCode);
    const response = await fetch(`${apiBase}/${normalized}`);
    if (!response.ok) {
      if (response.status === 404) {
        // Not found - let caller retry with another word
        return null;
      }
      console.log(normalized, response.status, await response.text());
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
  languageCode: string = 'en',
  maxRetries: number = 10,
): Promise<DictionaryEntry | null> => {
  // For non-English, adjust retries (API might have fewer words)
  const retries = languageCode === 'en' ? maxRetries : Math.min(maxRetries, 5);

  for (let i = 0; i < retries; i++) {
    const word = await fetchRandomWord(languageCode);
    const definition = await fetchWordDefinition(word, languageCode);

    if (definition) {
      // For non-English, be less strict with "interesting" filter
      if (languageCode === 'en') {
        if (isInteresting(definition)) {
          return definition;
        }
      } else {
        // Accept any word with a definition for non-English
        return definition;
      }
    }

    // Wait a bit before retrying to avoid rate limiting
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  }

  // If all retries fail, return a fallback word
  const fallbackWord = languageCode === 'en' ? 'hello' : 'bonjour';
  const fallback = await fetchWordDefinition(fallbackWord, languageCode);
  if (fallback) {
    return fallback;
  }

  // Last resort: return null to let caller handle
  return null;
};

export default {
  fetchRandomWord,
  fetchWordDefinition,
  fetchRandomWordWithDefinition,
};
