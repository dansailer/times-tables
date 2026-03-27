/**
 * Times Tables Quest - Internationalization System
 * 
 * Auto-detects browser language and provides translation functions.
 * Supports English (default) and German.
 */

import { en, type TranslationKey } from './translations/en';
import { de } from './translations/de';

// Supported languages
export type Language = 'en' | 'de';

// Translation dictionaries
const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  de,
};

// Current language (initialized on load)
let currentLanguage: Language = 'en';

/**
 * Detect browser language and return supported language code
 */
function detectLanguage(): Language {
  // Get browser language (e.g., "en-US", "de-DE", "de")
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en';
  
  // Extract primary language code (e.g., "en" from "en-US")
  const primaryLang = browserLang.split('-')[0]?.toLowerCase();
  
  // Return supported language or default to English
  if (primaryLang === 'de') {
    return 'de';
  }
  
  return 'en';
}

/**
 * Initialize i18n system with browser language detection
 */
export function initI18n(): Language {
  currentLanguage = detectLanguage();
  
  // Update document language attribute
  document.documentElement.lang = currentLanguage;
  
  return currentLanguage;
}

/**
 * Get current language
 */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * Set language manually
 */
export function setLanguage(lang: Language): void {
  if (translations[lang]) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
  }
}

/**
 * Translate a key to current language
 * 
 * @param key - Translation key
 * @param params - Optional parameters for interpolation (e.g., {count: 5})
 * @returns Translated string
 */
export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const dict = translations[currentLanguage];
  let text = dict[key];
  
  // Fallback to English if key not found
  if (!text) {
    text = translations.en[key];
  }
  
  // Final fallback to key itself
  if (!text) {
    console.warn(`[i18n] Missing translation for key: ${key}`);
    return key;
  }
  
  // Simple parameter interpolation: {{param}} -> value
  if (params) {
    for (const [param, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
    }
  }
  
  return text;
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): Language[] {
  return Object.keys(translations) as Language[];
}

// Re-export types
export type { TranslationKey };
