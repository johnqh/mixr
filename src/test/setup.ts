import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Set environment variables for tests
process.env.VITE_MIXR_API_URL = 'http://localhost:6174';

// Mock Firebase Auth
vi.mock('@sudobility/auth_lib', () => ({
  getFirebaseAuth: vi.fn(() => null),
  initializeFirebaseAuth: vi.fn(),
  FirebaseAuthNetworkService: vi.fn(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  })),
  getFirebaseErrorMessage: vi.fn((code: string) => code || 'Unknown error'),
}));

// Mock Firebase auth functions
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
    onAuthStateChanged: vi.fn(),
  })),
  initializeAuth: vi.fn(),
  getReactNativePersistence: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((_auth: unknown, callback: (user: null) => void) => {
    callback(null);
    return vi.fn(); // unsubscribe
  }),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn(), language: 'en' },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

// Mock mixr client
vi.mock('../config/mixrClient', () => ({
  mixrClient: {
    getRecipes: vi.fn(),
    getRecipeById: vi.fn(),
    generateRecipe: vi.fn(),
    getMoods: vi.fn(),
    getMoodById: vi.fn(),
    getEquipment: vi.fn(),
    getEquipmentSubcategories: vi.fn(),
    getIngredients: vi.fn(),
    getIngredientSubcategories: vi.fn(),
    getRecipeRatings: vi.fn(),
    getRecipeRatingAggregate: vi.fn(),
    submitRecipeRating: vi.fn(),
    deleteRecipeRating: vi.fn(),
    getCurrentUser: vi.fn(),
    updateCurrentUser: vi.fn(),
    getUserPreferences: vi.fn(),
    updateUserPreferences: vi.fn(),
    getUserFavorites: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    getUserRecipes: vi.fn(),
  },
}));

// Mock web vitals
vi.mock('../utils/webVitals', () => ({
  measureCLS: vi.fn(),
  measureFCP: vi.fn(),
  measureLCP: vi.fn(),
  measureFID: vi.fn(),
  measureTTFB: vi.fn(),
  measureINP: vi.fn(),
  initWebVitals: vi.fn(),
  reportRouteChange: vi.fn(),
  reportCustomMetric: vi.fn(),
  reportApiCall: vi.fn(),
}));
