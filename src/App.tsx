import { type ReactNode, lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { SudobilityAppWithFirebaseAuth } from '@sudobility/building_blocks/firebase';
import i18n from './i18n';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScreenContainer } from './components/layout/ScreenContainer';
import LandingPage from './pages/LandingPage';
import { AuthProviderWrapper } from './components/providers/AuthProviderWrapper';

/** Global loading fallback displayed during lazy page loads. */
function LoadingFallback() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl animate-bounce" aria-hidden="true">
          🍸
        </div>
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"
          aria-hidden="true"
        ></div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

// Lazy load pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const RecipeDetailPage = lazy(() => import('./pages/RecipeDetailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// App-specific providers
function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

/**
 * Route-level layout wrapping all pages in ScreenContainer.
 * ScreenContainer provides PageConfigProvider so child pages
 * can use useSetPageConfig for layout overrides.
 */
function ScreenContainerLayout() {
  return (
    <ScreenContainer>
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </ScreenContainer>
  );
}

/** App routes wrapped with error boundary and suspense. */
function AppRoutes() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<ScreenContainerLayout />}>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/recipes" element={<HomePage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Full-screen pages outside layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

const baseUrl = import.meta.env.VITE_MIXR_API_URL || 'http://localhost:6174';
const testMode = import.meta.env.DEV;

function App() {
  return (
    <SudobilityAppWithFirebaseAuth
      i18n={i18n}
      AppProviders={AppProviders}
      baseUrl={baseUrl}
      testMode={testMode}
      storageKeyPrefix="mixr"
      AuthProviderWrapper={AuthProviderWrapper}
    >
      <AppRoutes />
    </SudobilityAppWithFirebaseAuth>
  );
}

export default App;
