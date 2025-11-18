import { FC, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './config/queryConfig';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';

// Loading component
const PageLoader: FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-4">
      <div className="text-6xl animate-bounce">🍸</div>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  </div>
);

// Lazy load pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const RecipeDetailPage = lazy(() => import('./pages/RecipeDetailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App: FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Recipe browsing - public */}
                  <Route path="/recipes" element={<HomePage />} />
                  <Route path="/recipes/:id" element={<RecipeDetailPage />} />

                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>

                  {/* 404 - Keep as last route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
