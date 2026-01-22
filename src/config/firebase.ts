import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Log config status for debugging (remove sensitive values)
console.log('Firebase Config Status:', {
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
  authDomain: firebaseConfig.authDomain || 'Missing',
  projectId: firebaseConfig.projectId || 'Missing',
  appId: firebaseConfig.appId ? 'Set' : 'Missing',
});

// Check if Firebase config is valid
const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

// Initialize Firebase only if properly configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    console.log('Initializing Firebase...');
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');

    // Initialize auth with a slight delay to ensure component registration
    auth = getAuth(app);

    // Set persistence to help ensure auth is fully initialized
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Firebase Auth initialized successfully with persistence');
      })
      .catch((error) => {
        console.warn('Could not set auth persistence:', error);
      });

    console.log('Firebase Auth initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
} else {
  console.warn('Firebase Auth is not configured. Authentication features will be disabled.');
}

// Export auth with a fallback
export { auth };
export default app;
