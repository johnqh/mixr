/**
 * @fileoverview Language configuration for the app.
 *
 * The `SUPPORTED_LANGUAGES` array is the single source of truth for which
 * languages the app supports. It must stay in sync with the translation
 * directories under `public/locales/`. The i18n initialization in `src/i18n.ts`
 * reads from this array to set `supportedLngs`.
 */

export const SUPPORTED_LANGUAGES = ['en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
};

/**
 * Type guard that checks whether a given string is a supported language code.
 */
export const isLanguageSupported = (lang: string): lang is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
};
