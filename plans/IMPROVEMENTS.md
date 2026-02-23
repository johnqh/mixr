# Improvement Plans for @sudobility/mixr (Frontend App)

## Priority 1 - High Impact

### 1. Expand Test Coverage Beyond Smoke Test
- The entire app has a single test file: `src/App.test.tsx` (smoke test).
- Zero tests for any of the 8 pages (`LandingPage`, `LoginPage`, `RegisterPage`, `HomePage`, `RecipeDetailPage`, `OnboardingPage`, `SettingsPage`, `NotFoundPage`).
- Zero tests for any of the 9 app-level hooks (`useRecipes`, `useGenerateRecipe`, `useRatings`, `useEquipment`, `useIngredients`, `useMoods`, `useUser`, `useFavorites`, `useUserRecipes`).
- Zero tests for critical components like `RecipeGenerator` (multi-step wizard), `ProtectedRoute` (auth guard), `AuthContext` (Firebase auth), and `PreferencesSelector` (master-detail UI).
- At minimum, page-level rendering tests and auth flow tests should be added.

### 2. Add Error Boundary Components
- No `ErrorBoundary` component exists in the application.
- If the `RecipeGenerator` wizard, `RecipeDetailPage`, or any data-fetching component throws, the entire app crashes with no recovery path.
- React error boundaries should wrap route-level components and critical features (recipe generation, ratings) to show fallback UIs and enable error reporting.

### 3. Add JSDoc to App-Level Hooks and Context
- The 9 hooks in `src/hooks/` wrap `mixr_client` hooks but add app-specific logic (e.g., `getMixrClient()` singleton usage, auth token injection). None have JSDoc.
- `AuthContext.tsx` exports `useAuth()` with methods (`signIn`, `signUp`, `signInWithGoogle`, `signOut`) that lack JSDoc explaining parameters, error handling, or redirect behavior.
- `networkClient.ts` contains `AuthenticatedNetworkClient` which automatically injects Firebase tokens -- this critical behavior is undocumented.

## Priority 2 - Medium Impact

### 4. Improve Accessibility (a11y) Across Components
- The `LoadingFallback` component in `App.tsx` uses an emoji (`div` with text "cocktail emoji") and spinner without any `aria-label` or `role="status"` attributes.
- Rating components (`StarRating`, `ReviewForm`) likely need ARIA labels for screen readers.
- Form components (`LoginPage`, `RegisterPage`, `OnboardingPage`) should be audited for proper label associations, focus management, and keyboard navigation.

### 5. Add Loading/Error States to All Pages
- Page components use lazy loading with a single global `Suspense` fallback.
- Individual pages should have their own loading skeletons and error states for data fetching (e.g., `RecipeDetailPage` should show a recipe skeleton while loading, not just a spinner).
- The `HomePage` with its Browse/Generate/My Recipes tabs should handle partial loading states (one tab loaded, another still loading).

### 6. Extract Shared Constants and Configuration
- `src/config/constants.ts` holds environment variables, but domain-specific constants (pagination limits, rating ranges, form validation rules) are likely scattered across components.
- These should be centralized in `mixr_lib` or at minimum in a single `src/config/` file, not inline in components.
- The `baseUrl` in `App.tsx` (`import.meta.env.VITE_MIXR_API_URL || 'http://localhost:3000'`) uses port 3000 as fallback but the API default is port 6174, which could cause confusion.

## Priority 3 - Nice to Have

### 7. Add Service Worker for Offline Support
- `initialize.ts` references service worker setup, but the extent of offline support is unclear.
- Recipe detail pages could be cached for offline viewing (especially useful for following recipes while making drinks).
- Equipment and ingredient lists (static data with long cache times) are good candidates for service worker caching.

### 8. Add Analytics and Performance Monitoring
- `src/utils/webVitals.ts` exists but its integration into the app is unclear.
- Adding structured analytics for key user flows (recipe generation completion rate, onboarding drop-off points, rating submission frequency) would inform product decisions.
- Core Web Vitals reporting should be confirmed as active, especially for the lazy-loaded pages.
