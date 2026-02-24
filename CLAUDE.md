# MIXR

React frontend application for MIXR - AI-powered cocktail recipe generation platform.

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js (npm for package management)
- **Framework**: React 19
- **Build**: Vite 7
- **Styling**: Tailwind CSS + Radix UI
- **Routing**: React Router v7
- **Data Fetching**: TanStack React Query v5
- **State**: Zustand
- **Auth**: Firebase
- **i18n**: i18next

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Root component with routing
├── App.test.tsx          # Smoke test
├── index.css             # Global styles (Tailwind)
├── initialize.ts         # Firebase, i18n, service worker setup
├── pages/
│   ├── LandingPage.tsx       # Public landing
│   ├── LoginPage.tsx         # Email + Google login
│   ├── RegisterPage.tsx      # Registration
│   ├── HomePage.tsx          # Browse / Generate / My Recipes tabs
│   ├── RecipeDetailPage.tsx  # Full recipe with ratings
│   ├── OnboardingPage.tsx    # Equipment/ingredient preferences
│   ├── SettingsPage.tsx      # Account settings
│   └── NotFoundPage.tsx      # 404
├── components/
│   ├── recipe/
│   │   ├── RecipeGenerator.tsx   # Multi-step wizard (Mood -> Equipment -> Ingredients -> Generate)
│   │   ├── RecipeGrid.tsx        # Infinite scroll grid
│   │   ├── RecipeCard.tsx        # Card display
│   │   └── RecipeFilters.tsx     # Search filter
│   ├── onboarding/
│   │   ├── PreferencesSelector.tsx   # Master-detail preferences UI
│   │   ├── EquipmentSelector.tsx     # Equipment grid with presets
│   │   ├── IngredientSelector.tsx    # Ingredient grid with subcategory tabs
│   │   ├── CategoryMasterPanel.tsx   # Category navigation
│   │   ├── SubcategoryDetailPanel.tsx # Item selection
│   │   └── OnboardingProgress.tsx    # Progress indicator
│   ├── mood/
│   │   └── MoodSelector.tsx      # Mood grid selector
│   ├── ratings/
│   │   ├── StarRating.tsx        # Interactive stars
│   │   ├── ReviewForm.tsx        # Rating submission
│   │   ├── ReviewList.tsx        # Community reviews
│   │   └── AggregateRating.tsx   # Stats display
│   ├── layout/
│   │   ├── StandardPageLayout.tsx
│   │   ├── ScreenContainer.tsx   # SEO + breadcrumbs
│   │   ├── TopBar.tsx
│   │   ├── Footer.tsx
│   │   └── Breadcrumb.tsx
│   └── auth/
│       ├── ProtectedRoute.tsx    # Auth guard
│       └── AuthProviderWrapper.tsx
├── context/
│   └── AuthContext.tsx       # Firebase auth (signIn, signUp, Google, signOut)
├── hooks/
│   ├── useRecipes.ts         # Wraps mixr_client recipe hooks
│   ├── useGenerateRecipe.ts  # Recipe generation mutation
│   ├── useRatings.ts         # Rating queries & mutations
│   ├── useEquipment.ts       # Equipment queries
│   ├── useIngredients.ts     # Ingredient queries
│   ├── useMoods.ts           # Mood queries
│   ├── useUser.ts            # User profile & preferences
│   ├── useFavorites.ts       # Favorite management
│   └── useUserRecipes.ts     # User's generated recipes
├── config/
│   ├── constants.ts          # Env vars (VITE_* pattern)
│   ├── mixrClient.ts         # MixrClient singleton
│   ├── queryConfig.ts        # TanStack Query defaults
│   └── auth-config.ts        # Firebase error messages
└── utils/
    ├── networkClient.ts      # AuthenticatedNetworkClient (adds Firebase token)
    ├── BreadcrumbBuilder.ts
    ├── i18n.ts
    └── webVitals.ts
public/
└── locales/                  # i18n translation files
```

## Commands

```bash
bun run dev          # Start Vite dev server
bun run dev:local    # Dev with local library aliases (USE_LOCAL_LIB=true)
bun run build        # Build for production (tsc + vite)
bun run preview      # Preview production build
bun run test         # Run Vitest
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint issues
bun run typecheck    # TypeScript type check
bun run format       # Format with Prettier
bun run verify       # Run typecheck + lint + test (use before committing)
```

## Routing

| Path | Page | Auth Required |
|------|------|---------------|
| `/` | Landing | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/recipes` | Home (Browse/Generate/MyRecipes tabs) | No (Generate requires auth) |
| `/recipes/:id` | Recipe Detail | No |
| `/onboarding` | Preferences Setup | Yes |
| `/settings` | Account Settings | Yes |

## Environment Variables

Configure in `.env.local`:

```bash
# API
VITE_MIXR_API_URL=http://localhost:6174

# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Branding
VITE_APP_NAME=MIXR
VITE_APP_DOMAIN=
VITE_SUPPORT_EMAIL=
```

## Internal Dependencies

- `@sudobility/mixr_client` - API client & hooks
- `@sudobility/mixr_lib` - Business logic & types
- `@sudobility/mixr_types` - Type definitions
- `@sudobility/components` - Shared UI components (MasterDetailLayout, etc.)
- `@sudobility/building_blocks` - Design primitives
- `@sudobility/auth-components` - Auth UI components
- `@sudobility/di` - Dependency injection

## Code Patterns

### Protected Routes
```tsx
<Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
```

### Data Fetching (hooks wrap mixr_client)
```typescript
// src/hooks/useEquipment.ts
export function useEquipment(subcategory?: string) {
  const client = getMixrClient();
  return useEquipments(client, subcategory as EquipmentSubcategory);
}
```

### Auth Context
```typescript
const { user, signIn, signUp, signInWithGoogle, signOut } = useAuth();
```

## Vite Config

- `USE_LOCAL_LIB=true` resolves `@sudobility/mixr_*` to local source
- Manual chunk splitting: react, router, firebase, i18n, tanstack, radix, icons
- Terser minification removes console/debugger in production

## Architecture

```
mixr (this app)
    ├── mixr_lib (business logic)
    │   └── mixr_client (API hooks)
    │       └── mixr_types (types)
    └── @sudobility/components (shared UI)
```
