import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Supported languages
const supportedLngs = ["en"];

// Detect language from URL path first, then localStorage
const detectLanguageFromPath = (): string => {
  if (typeof window === "undefined") {
    return "en";
  }

  // Check URL path first
  const pathLang = window.location.pathname.split("/")[1];
  if (pathLang && supportedLngs.includes(pathLang)) {
    return pathLang;
  }

  // Fall back to localStorage
  try {
    const stored = localStorage.getItem("language");
    if (stored && supportedLngs.includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage may throw in Safari private browsing
  }

  return "en";
};

/**
 * Initialize i18n
 * Call this function to initialize internationalization
 */
export function initializeI18n(): void {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: detectLanguageFromPath(),
      fallbackLng: "en",
      supportedLngs,
      initImmediate: false,
      debug: false,
      nonExplicitSupportedLngs: true,

      interpolation: {
        escapeValue: false,
      },

      backend: {
        loadPath: `/locales/{{lng}}/{{ns}}.json`,
      },

      detection: {
        order: ["path", "localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "language",
        lookupFromPathIndex: 0,
      },

      load: "languageOnly",
      preload: [],
      cleanCode: false,
      lowerCaseLng: false,

      defaultNS: "common",
      ns: ["common"],
    });
}

export default i18n;
