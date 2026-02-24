import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getFirebaseAuth } from '@sudobility/auth_lib';

/** Shape of the authentication context provided to consumers. */
interface AuthContextType {
  /** The currently authenticated Firebase user, or null if not signed in. */
  user: User | null;
  /** Whether the auth state is still being determined (e.g., on initial load). */
  loading: boolean;
  /**
   * Sign in with email and password via Firebase Auth.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @throws Error if Firebase Auth is not configured or credentials are invalid.
   */
  signIn: (email: string, password: string) => Promise<void>;
  /**
   * Create a new account with email and password via Firebase Auth.
   * @param email - The user's email address.
   * @param password - The user's desired password (min 6 characters).
   * @throws Error if Firebase Auth is not configured or registration fails.
   */
  signUp: (email: string, password: string) => Promise<void>;
  /**
   * Sign in using a Google account via popup flow.
   * @throws Error if Firebase Auth is not configured or the popup is blocked/closed.
   */
  signInWithGoogle: () => Promise<void>;
  /**
   * Sign the current user out of Firebase Auth.
   * @throws Error if Firebase Auth is not configured.
   */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provides Firebase authentication state and methods to the component tree.
 * Listens to `onAuthStateChanged` to keep the user state in sync.
 * If Firebase is not configured, authentication features are disabled gracefully.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = getFirebaseAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => {
    // Initialize loading based on whether Firebase is configured
    return auth !== null;
  });

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase Auth is not configured. Authentication features will be disabled.');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth is not configured');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth is not configured');
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase Auth is not configured');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    if (!auth) throw new Error('Firebase Auth is not configured');
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access the authentication context.
 * Provides the current user, loading state, and auth methods (signIn, signUp, signInWithGoogle, signOut).
 *
 * @returns The current {@link AuthContextType} value.
 * @throws Error if called outside of an {@link AuthProvider}.
 *
 * @example
 * ```tsx
 * const { user, signIn, signOut } = useAuth();
 * ```
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
