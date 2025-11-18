# MIXR - Cocktail Recipe React App
## Technical Design & Implementation Plan

**Version:** 1.0
**Date:** 2025-11-18
**Author:** AI Planning Assistant

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Requirements Summary](#requirements-summary)
3. [Technical Architecture](#technical-architecture)
4. [UX Design Specifications](#ux-design-specifications)
5. [Data Models](#data-models)
6. [API Integration](#api-integration)
7. [Component Hierarchy](#component-hierarchy)
8. [Routing Structure](#routing-structure)
9. [State Management](#state-management)
10. [Authentication & Authorization](#authentication--authorization)
11. [Implementation Phases](#implementation-phases)
12. [Configuration & Setup](#configuration--setup)
13. [Testing Strategy](#testing-strategy)
14. [Deployment Considerations](#deployment-considerations)

---

## Project Overview

MIXR is a React-based web application for discovering and generating cocktail recipes based on user preferences, available equipment, ingredients, and mood. The app provides a personalized cocktail experience with community ratings and reviews.

### Key Features
- Visual mood-based recipe generation
- Equipment and ingredient inventory management
- Community recipe browsing and discovery
- Star ratings with optional text reviews
- Firebase authentication (email/password + Google OAuth)
- Responsive design following mail_box patterns

### Technology Stack
- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v7
- **State Management:**
  - Server State: @tanstack/react-query
  - Client State: React Context API
  - Remote State: Zustand (from mixr_client)
- **Authentication:** Firebase Auth
- **API Client:** @sudobility/mixr_client
- **Styling:** Tailwind CSS + @sudobility/design
- **UI Components:** @sudobility/components
- **Dependency Injection:** @sudobility/di

---

## Requirements Summary

### Functional Requirements

#### 1. Onboarding Flow
- Multi-step onboarding for new users
- Equipment selection with preset options
- Ingredient selection organized by subcategories
- Ability to skip and complete later
- Visual icons for equipment and ingredients

#### 2. Recipe Generation
- Visual mood selection (emoji + description)
- Generate recipes based on:
  - User's available equipment
  - User's available ingredients
  - Selected mood
- Generated recipes automatically available to all users

#### 3. Recipe Browsing
- Browse all recipes (anonymous users allowed)
- Filter by mood, rating, ingredients, equipment
- Search by recipe name
- Infinite scroll pagination
- Recipe cards with image, name, mood, rating

#### 4. Recipe Details
- Full recipe view with:
  - Name, description, image
  - Mood indicator
  - Ingredients with measurements
  - Step-by-step instructions
  - Required equipment
  - Aggregate rating
  - Individual reviews with user names

#### 5. Rating & Reviews
- Requires authentication
- 1-5 star rating
- Optional text review
- View all reviews for a recipe
- Display user name with review

#### 6. User Profile & Settings
- Manage equipment inventory
- Manage ingredient inventory
- Update profile information
- View generated recipes
- View submitted ratings/reviews

### Non-Functional Requirements

- **Performance:** First Contentful Paint < 1.5s
- **Accessibility:** WCAG 2.1 AA compliance
- **Responsiveness:** Mobile-first design, support desktop/tablet/mobile
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Security:** Secure authentication, token-based API access
- **Code Quality:** Follow mail_box patterns, ESLint/Prettier configured

---

## Technical Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        MIXR React App                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                     Presentation Layer                  │ │
│  │  - Pages (LandingPage, HomePage, RecipeDetailPage)    │ │
│  │  - Components (RecipeCard, MoodSelector, RatingForm)  │ │
│  │  - Layout (Header, Footer, TopBar, ScreenContainer)   │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   State Management Layer                │ │
│  │  - React Query (recipes, equipment, ingredients)       │ │
│  │  - Context API (auth, theme, user)                     │ │
│  │  - Zustand Stores (from mixr_client)                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Service Layer                        │ │
│  │  - Firebase Auth Service                               │ │
│  │  - MixrClient (API Client from mixr_client)            │ │
│  │  - NetworkClient (from @sudobility/types)              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│                                                              │
│  ┌──────────────────┐              ┌────────────────────┐   │
│  │   Firebase Auth  │              │    mixr_api        │   │
│  │  - User Auth     │              │  - Recipes         │   │
│  │  - Token Gen     │              │  - Equipment       │   │
│  └──────────────────┘              │  - Ingredients     │   │
│                                     │  - Moods           │   │
│                                     │  - User Profiles   │   │
│                                     │  - Ratings/Reviews │   │
│                                     └────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
mixr/
├── public/                          # Static assets
│   ├── favicon.ico
│   ├── logo.png
│   └── locales/                     # i18n translation files
│       └── en/
│           ├── common.json
│           ├── onboarding.json
│           ├── recipe.json
│           └── settings.json
├── src/
│   ├── components/                  # Reusable components
│   │   ├── ui/                      # Base UI components
│   │   │   ├── index.ts
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── ScreenContainer.tsx
│   │   ├── onboarding/              # Onboarding components
│   │   │   ├── OnboardingWizard.tsx
│   │   │   ├── EquipmentSelector.tsx
│   │   │   ├── IngredientSelector.tsx
│   │   │   └── OnboardingProgress.tsx
│   │   ├── recipe/                  # Recipe components
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── RecipeGrid.tsx
│   │   │   ├── RecipeDetail.tsx
│   │   │   ├── RecipeFilters.tsx
│   │   │   └── RecipeSearch.tsx
│   │   ├── mood/                    # Mood selection
│   │   │   ├── MoodSelector.tsx
│   │   │   ├── MoodCard.tsx
│   │   │   └── MoodGrid.tsx
│   │   ├── rating/                  # Rating & review components
│   │   │   ├── RatingForm.tsx
│   │   │   ├── RatingDisplay.tsx
│   │   │   ├── ReviewList.tsx
│   │   │   └── ReviewCard.tsx
│   │   ├── auth/                    # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── common/                  # Common components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   ├── pages/                       # Route pages
│   │   ├── LandingPage.tsx          # Landing/marketing page
│   │   ├── OnboardingPage.tsx       # Multi-step onboarding
│   │   ├── HomePage.tsx             # Main recipe browsing
│   │   ├── RecipeDetailPage.tsx     # Recipe detail view
│   │   ├── GeneratePage.tsx         # Mood selection & generation
│   │   ├── SettingsPage.tsx         # User settings
│   │   ├── ProfilePage.tsx          # User profile
│   │   ├── LoginPage.tsx            # Login page
│   │   ├── SignupPage.tsx           # Signup page
│   │   ├── TermsPage.tsx            # Terms of service
│   │   └── PrivacyPage.tsx          # Privacy policy
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.tsx          # Firebase auth state
│   │   ├── ThemeContext.tsx         # Dark/light theme
│   │   └── UserContext.tsx          # User profile & preferences
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts               # Auth hook
│   │   ├── useUserProfile.ts        # User profile hook
│   │   ├── useFirebaseToken.ts      # Firebase token hook
│   │   ├── useRecipes.ts            # Recipe queries
│   │   ├── useRatings.ts            # Rating mutations
│   │   └── useLocalizedNavigate.ts  # Localized navigation
│   ├── config/                      # Configuration files
│   │   ├── firebase.ts              # Firebase config
│   │   ├── queryConfig.ts           # React Query config
│   │   ├── mixrClient.ts            # MixrClient initialization
│   │   └── seo.ts                   # SEO configuration
│   ├── utils/                       # Utility functions
│   │   ├── networkClient.ts         # NetworkClient implementation
│   │   ├── tokenHelpers.ts          # Token management
│   │   └── validators.ts            # Form validators
│   ├── types/                       # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── index.ts
│   ├── i18n/                        # i18n configuration
│   │   └── config.ts
│   ├── App.tsx                      # Root App component
│   ├── main.tsx                     # App entry point
│   └── globals.d.ts                 # Global type declarations
├── .env.example                     # Example environment variables
├── .eslintrc.js                     # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
└── README.md                        # Project documentation
```

---

## UX Design Specifications

### Design Principles
1. **Simplicity First:** Minimize cognitive load, clear visual hierarchy
2. **Mobile-First:** Design for mobile, enhance for desktop
3. **Visual Delight:** Use emoji, icons, and images to make the experience fun
4. **Accessibility:** WCAG 2.1 AA compliant, keyboard navigation, screen reader support
5. **Performance:** Fast loading, smooth transitions, responsive interactions

### Color Palette (from @sudobility/design)
- Use existing gradient classes from mail_box
- Primary brand colors
- Mood-specific accent colors

### Typography
- Follow mail_box typography scale
- Use system fonts for performance

### Key User Flows

#### 1. First-Time User Flow
```
Landing Page → Sign Up → Onboarding (Equipment → Ingredients) → Home
```

#### 2. Recipe Generation Flow
```
Home → Generate Tab → Mood Selection → Loading → Recipe Detail → Rate
```

#### 3. Recipe Browsing Flow
```
Home → Browse Recipes → Filter/Search → Recipe Detail → Rate (if logged in)
```

#### 4. Settings Update Flow
```
Home → Settings → Equipment/Ingredients Management → Save
```

### Screen Specifications

#### Landing Page
- **Hero Section:** App name, tagline, CTA ("Get Started" / "Sign Up")
- **Features Section:** 3-4 key features with icons
- **How It Works:** 3-step visual guide
- **CTA Section:** "Start Mixing" button
- **Footer:** Links to Terms, Privacy, About

#### Onboarding Page
- **Progress Indicator:** Step 1 of 3, 2 of 3, etc.
- **Step 1 - Equipment:**
  - Title: "What equipment do you have?"
  - Preset buttons: "Beginner Kit", "Home Bar", "Pro Setup"
  - Custom selection: Grid of equipment with icons
  - Actions: "Skip", "Next"
- **Step 2 - Ingredients:**
  - Title: "What ingredients do you have?"
  - Tabs for subcategories: Spirits, Wine, Fruit, Spices, Other
  - Grid of ingredients with icons
  - Actions: "Back", "Skip", "Next"
- **Step 3 - Complete:**
  - Success message
  - "Start Exploring" button

#### Home Page
- **Top Bar:** Logo, Search, User Menu
- **Tabs:** "Discover", "Generate", "My Recipes"
- **Discover Tab:**
  - Filter bar: Mood, Rating, Ingredients
  - Recipe grid (infinite scroll)
  - Each card: Image, Name, Mood emoji, Rating
- **Generate Tab:**
  - Mood selector (visual grid)
  - "Generate Recipe" button
- **My Recipes Tab (Logged in only):**
  - List of user-generated recipes
  - List of user-rated recipes

#### Recipe Detail Page
- **Hero Image:** Large recipe photo
- **Header:** Recipe name, mood emoji, rating (stars + count)
- **Metadata Bar:** Difficulty, Prep Time, Glass Type
- **Sections:**
  - Ingredients (with icons and measurements)
  - Equipment Needed (with icons)
  - Instructions (numbered steps)
  - Ratings & Reviews (aggregate + list)
- **Actions:**
  - "Rate This Recipe" button (logged in)
  - "Generate Similar" button
  - "Share" button

#### Generate Page
- **Title:** "How are you feeling?"
- **Mood Grid:** Large cards with emoji, name, description
- **Selected Mood:** Highlighted card
- **Action:** "Generate Recipe" button
- **Loading State:** Animated cocktail shaker
- **Result:** Navigate to Recipe Detail Page

#### Settings Page
- **Tabs:** "Profile", "Equipment", "Ingredients"
- **Profile Tab:**
  - Display name
  - Email
  - Password reset link
- **Equipment Tab:**
  - Grid of equipment with add/remove toggles
  - Visual icons
- **Ingredients Tab:**
  - Subcategory tabs
  - Grid of ingredients with add/remove toggles

---

## Data Models

### Frontend Types (Extended from mixr_client)

#### User Profile
```typescript
interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  updatedAt: string;
}
```

#### User Equipment
```typescript
interface UserEquipment {
  userId: string;
  equipmentIds: number[];
  equipment: Equipment[]; // From mixr_client
}
```

#### User Ingredients
```typescript
interface UserIngredients {
  userId: string;
  ingredientIds: number[];
  ingredients: Ingredient[]; // From mixr_client
}
```

#### Recipe Rating
```typescript
interface RecipeRating {
  id: number;
  recipeId: number;
  userId: string;
  rating: number; // 1-5
  review: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    displayName: string | null;
  };
}
```

#### Recipe with Ratings (Extended)
```typescript
interface RecipeWithRatings extends Recipe {
  averageRating: number | null;
  ratingCount: number;
  userRating?: RecipeRating; // Current user's rating (if logged in)
}
```

### Existing Types from mixr_client
- `Equipment`
- `EquipmentSubcategory`
- `Ingredient`
- `IngredientSubcategory`
- `Mood`
- `Recipe`
- `RecipeIngredient`
- `RecipeEquipment`
- `GenerateRecipeRequest`

---

## API Integration

### mixr_api Backend Requirements

The backend (mixr_api) needs to implement the following endpoints:

#### Authentication Middleware
All authenticated endpoints must:
1. Accept `Authorization: Bearer <firebase-token>` header
2. Verify Firebase token
3. Extract user ID from token
4. Return 401 if invalid/expired

#### User Endpoints

**Create User Profile**
```
POST /api/users
Headers: Authorization: Bearer <firebase-token>
Body: {
  "email": "user@example.com",
  "displayName": "John Doe"
}
Response: {
  "success": true,
  "data": {
    "id": "user-uuid",
    "firebaseUid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "createdAt": "2025-11-18T10:00:00Z",
    "updatedAt": "2025-11-18T10:00:00Z"
  }
}
```

**Get Current User Profile**
```
GET /api/users/me
Headers: Authorization: Bearer <firebase-token>
Response: {
  "success": true,
  "data": {
    "id": "user-uuid",
    "firebaseUid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "createdAt": "2025-11-18T10:00:00Z",
    "updatedAt": "2025-11-18T10:00:00Z"
  }
}
```

**Update User Profile**
```
PATCH /api/users/me
Headers: Authorization: Bearer <firebase-token>
Body: {
  "displayName": "Jane Doe"
}
Response: {
  "success": true,
  "data": {
    "id": "user-uuid",
    "displayName": "Jane Doe",
    "updatedAt": "2025-11-18T10:05:00Z"
  }
}
```

**Get User Equipment**
```
GET /api/users/me/equipment
Headers: Authorization: Bearer <firebase-token>
Response: {
  "success": true,
  "data": {
    "userId": "user-uuid",
    "equipmentIds": [1, 2, 3],
    "equipment": [
      {
        "id": 1,
        "subcategory": "essential",
        "name": "Cocktail Shaker",
        "icon": "🍸",
        "createdAt": "2025-01-01T00:00:00Z"
      },
      ...
    ]
  }
}
```

**Update User Equipment**
```
PUT /api/users/me/equipment
Headers: Authorization: Bearer <firebase-token>
Body: {
  "equipmentIds": [1, 2, 3, 4]
}
Response: {
  "success": true,
  "data": {
    "userId": "user-uuid",
    "equipmentIds": [1, 2, 3, 4],
    "equipment": [...]
  }
}
```

**Get User Ingredients**
```
GET /api/users/me/ingredients
Headers: Authorization: Bearer <firebase-token>
Response: {
  "success": true,
  "data": {
    "userId": "user-uuid",
    "ingredientIds": [1, 2, 3],
    "ingredients": [
      {
        "id": 1,
        "subcategory": "spirit",
        "name": "Vodka",
        "icon": "🍸",
        "createdAt": "2025-01-01T00:00:00Z"
      },
      ...
    ]
  }
}
```

**Update User Ingredients**
```
PUT /api/users/me/ingredients
Headers: Authorization: Bearer <firebase-token>
Body: {
  "ingredientIds": [1, 2, 3, 4, 5]
}
Response: {
  "success": true,
  "data": {
    "userId": "user-uuid",
    "ingredientIds": [1, 2, 3, 4, 5],
    "ingredients": [...]
  }
}
```

#### Rating & Review Endpoints

**Create Rating**
```
POST /api/recipes/:recipeId/ratings
Headers: Authorization: Bearer <firebase-token>
Body: {
  "rating": 5,
  "review": "Amazing cocktail! Perfect balance."
}
Response: {
  "success": true,
  "data": {
    "id": 123,
    "recipeId": 456,
    "userId": "user-uuid",
    "rating": 5,
    "review": "Amazing cocktail! Perfect balance.",
    "createdAt": "2025-11-18T10:00:00Z",
    "updatedAt": "2025-11-18T10:00:00Z",
    "user": {
      "id": "user-uuid",
      "displayName": "John Doe"
    }
  }
}
```

**Update Rating**
```
PATCH /api/recipes/:recipeId/ratings/:ratingId
Headers: Authorization: Bearer <firebase-token>
Body: {
  "rating": 4,
  "review": "Good, but a bit too sweet."
}
Response: {
  "success": true,
  "data": {
    "id": 123,
    "rating": 4,
    "review": "Good, but a bit too sweet.",
    "updatedAt": "2025-11-18T10:05:00Z"
  }
}
```

**Delete Rating**
```
DELETE /api/recipes/:recipeId/ratings/:ratingId
Headers: Authorization: Bearer <firebase-token>
Response: {
  "success": true
}
```

**Get Recipe Ratings**
```
GET /api/recipes/:recipeId/ratings?limit=20&offset=0
Response: {
  "success": true,
  "data": [
    {
      "id": 123,
      "recipeId": 456,
      "userId": "user-uuid",
      "rating": 5,
      "review": "Amazing cocktail!",
      "createdAt": "2025-11-18T10:00:00Z",
      "updatedAt": "2025-11-18T10:00:00Z",
      "user": {
        "id": "user-uuid",
        "displayName": "John Doe"
      }
    },
    ...
  ],
  "count": 100
}
```

**Get User's Ratings**
```
GET /api/users/me/ratings
Headers: Authorization: Bearer <firebase-token>
Response: {
  "success": true,
  "data": [
    {
      "id": 123,
      "recipeId": 456,
      "userId": "user-uuid",
      "rating": 5,
      "review": "Amazing cocktail!",
      "createdAt": "2025-11-18T10:00:00Z",
      "recipe": {
        "id": 456,
        "name": "Margarita",
        ...
      }
    },
    ...
  ],
  "count": 10
}
```

#### Enhanced Recipe Endpoints

**Get Recipes with Ratings**
```
GET /api/recipes?limit=20&offset=0
Headers: Authorization: Bearer <firebase-token> (optional)
Response: {
  "success": true,
  "data": [
    {
      "id": 456,
      "name": "Margarita",
      "description": "Classic tequila cocktail",
      "moodId": 1,
      "createdAt": "2025-11-18T10:00:00Z",
      "mood": {...},
      "ingredients": [...],
      "steps": [...],
      "equipment": [...],
      "averageRating": 4.5,
      "ratingCount": 100,
      "userRating": {  // Only if user is authenticated
        "id": 123,
        "rating": 5,
        "review": "Amazing!"
      }
    },
    ...
  ],
  "count": 500
}
```

**Generate Recipe (Enhanced)**
```
POST /api/recipes/generate
Headers: Authorization: Bearer <firebase-token> (optional, but recommended)
Body: {
  "equipment_ids": [1, 2, 3],
  "ingredient_ids": [1, 2, 3, 4],
  "mood_id": 1
}
Response: {
  "success": true,
  "data": {
    "id": 456,
    "name": "Tropical Sunset",
    ...
    "averageRating": null,
    "ratingCount": 0,
    "userRating": null
  }
}
```

### Frontend API Client Setup

#### MixrClient Initialization
```typescript
// src/config/mixrClient.ts
import { MixrClient } from '@sudobility/mixr_client';
import { FetchNetworkClient } from '@sudobility/mixr_client';

const baseUrl = import.meta.env.VITE_MIXR_API_URL || 'http://localhost:3000';
const networkClient = new FetchNetworkClient();

export const mixrClient = new MixrClient(baseUrl, networkClient);
```

#### Network Client with Firebase Token
```typescript
// src/utils/networkClient.ts
import { NetworkClient, NetworkResponse } from '@sudobility/types';
import { getAuth } from 'firebase/auth';

export class AuthenticatedNetworkClient implements NetworkClient {
  async get<T>(url: string, options?: RequestInit): Promise<NetworkResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, body?: unknown, options?: RequestInit): Promise<NetworkResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(url: string, body?: unknown, options?: RequestInit): Promise<NetworkResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(url: string, body?: unknown, options?: RequestInit): Promise<NetworkResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(url: string, options?: RequestInit): Promise<NetworkResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  private async request<T>(url: string, options: RequestInit): Promise<NetworkResponse<T>> {
    try {
      // Get Firebase auth token if user is logged in
      const auth = getAuth();
      const user = auth.currentUser;
      let token: string | undefined;

      if (user) {
        token = await user.getIdToken();
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      return {
        ok: response.ok,
        status: response.status,
        data: data as T,
      };
    } catch (error) {
      return {
        ok: false,
        status: 0,
        error: error as Error,
      };
    }
  }
}
```

---

## Component Hierarchy

### Component Tree
```
App
├── AuthContext.Provider
│   ├── ThemeContext.Provider
│   │   ├── UserContext.Provider
│   │   │   ├── QueryClientProvider
│   │   │   │   ├── Router
│   │   │   │   │   ├── Routes
│   │   │   │   │   │   ├── LandingPage
│   │   │   │   │   │   │   ├── ScreenContainer
│   │   │   │   │   │   │   │   ├── Header
│   │   │   │   │   │   │   │   ├── HeroSection
│   │   │   │   │   │   │   │   ├── FeaturesSection
│   │   │   │   │   │   │   │   ├── HowItWorksSection
│   │   │   │   │   │   │   │   ├── CTASection
│   │   │   │   │   │   │   │   └── Footer
│   │   │   │   │   │   ├── OnboardingPage
│   │   │   │   │   │   │   ├── ScreenContainer
│   │   │   │   │   │   │   │   ├── OnboardingWizard
│   │   │   │   │   │   │   │   │   ├── OnboardingProgress
│   │   │   │   │   │   │   │   │   ├── EquipmentSelector
│   │   │   │   │   │   │   │   │   └── IngredientSelector
│   │   │   │   │   │   ├── HomePage
│   │   │   │   │   │   │   ├── ScreenContainer
│   │   │   │   │   │   │   │   ├── TopBar
│   │   │   │   │   │   │   │   ├── Tabs
│   │   │   │   │   │   │   │   │   ├── DiscoverTab
│   │   │   │   │   │   │   │   │   │   ├── RecipeFilters
│   │   │   │   │   │   │   │   │   │   └── RecipeGrid
│   │   │   │   │   │   │   │   │   │       └── RecipeCard[]
│   │   │   │   │   │   │   │   │   ├── GenerateTab
│   │   │   │   │   │   │   │   │   │   ├── MoodSelector
│   │   │   │   │   │   │   │   │   │   │   └── MoodCard[]
│   │   │   │   │   │   │   │   │   │   └── GenerateButton
│   │   │   │   │   │   │   │   │   └── MyRecipesTab
│   │   │   │   │   │   │   │   │       └── RecipeList
│   │   │   │   │   │   │   │   └── Footer
│   │   │   │   │   │   ├── RecipeDetailPage
│   │   │   │   │   │   │   ├── ScreenContainer
│   │   │   │   │   │   │   │   ├── TopBar
│   │   │   │   │   │   │   │   ├── RecipeDetail
│   │   │   │   │   │   │   │   │   ├── RecipeHero
│   │   │   │   │   │   │   │   │   ├── RecipeMetadata
│   │   │   │   │   │   │   │   │   ├── IngredientList
│   │   │   │   │   │   │   │   │   ├── EquipmentList
│   │   │   │   │   │   │   │   │   ├── InstructionSteps
│   │   │   │   │   │   │   │   │   ├── RatingDisplay
│   │   │   │   │   │   │   │   │   ├── RatingForm
│   │   │   │   │   │   │   │   │   └── ReviewList
│   │   │   │   │   │   │   │   │       └── ReviewCard[]
│   │   │   │   │   │   │   │   └── Footer
│   │   │   │   │   │   ├── SettingsPage
│   │   │   │   │   │   │   ├── ScreenContainer
│   │   │   │   │   │   │   │   ├── TopBar
│   │   │   │   │   │   │   │   ├── SettingsTabs
│   │   │   │   │   │   │   │   │   ├── ProfileTab
│   │   │   │   │   │   │   │   │   ├── EquipmentTab
│   │   │   │   │   │   │   │   │   │   └── EquipmentGrid
│   │   │   │   │   │   │   │   │   └── IngredientsTab
│   │   │   │   │   │   │   │   │       └── IngredientsGrid
│   │   │   │   │   │   │   │   └── Footer
│   │   │   │   │   │   └── ...more pages
```

### Key Component Specifications

#### RecipeCard
```typescript
interface RecipeCardProps {
  recipe: RecipeWithRatings;
  onClick: () => void;
}
```
- Displays recipe image, name, mood emoji, rating
- Clickable to navigate to detail page
- Responsive card layout

#### MoodCard
```typescript
interface MoodCardProps {
  mood: Mood;
  selected: boolean;
  onSelect: (mood: Mood) => void;
}
```
- Large emoji display
- Mood name and description
- Visual selection state

#### RatingForm
```typescript
interface RatingFormProps {
  recipeId: number;
  existingRating?: RecipeRating;
  onSuccess: () => void;
}
```
- Star rating input (1-5)
- Optional text review textarea
- Submit button
- Edit mode if existing rating

#### EquipmentSelector
```typescript
interface EquipmentSelectorProps {
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}
```
- Grid of equipment with icons
- Toggle selection
- Preset options
- Subcategory filtering

---

## Routing Structure

### Route Configuration
```typescript
// src/App.tsx
<Routes>
  {/* Public routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/terms" element={<TermsPage />} />
  <Route path="/privacy" element={<PrivacyPage />} />

  {/* Browse recipes (public) */}
  <Route path="/recipes" element={<HomePage />} />
  <Route path="/recipes/:id" element={<RecipeDetailPage />} />

  {/* Protected routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/onboarding" element={<OnboardingPage />} />
    <Route path="/generate" element={<GeneratePage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Route>

  {/* Catch-all */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
```

### Navigation Flow
1. Landing → Sign Up → Onboarding → Home
2. Home → Generate → Recipe Detail
3. Home → Recipe Card → Recipe Detail → Rate
4. Top Bar → Settings → Equipment/Ingredients Management

---

## State Management

### React Query Configuration
```typescript
// src/config/queryConfig.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Query Keys
```typescript
// src/hooks/queryKeys.ts
export const queryKeys = {
  // Equipment
  equipment: ['equipment'] as const,
  equipmentById: (id: number) => ['equipment', id] as const,
  equipmentSubcategories: ['equipment', 'subcategories'] as const,

  // Ingredients
  ingredients: ['ingredients'] as const,
  ingredientById: (id: number) => ['ingredients', id] as const,
  ingredientSubcategories: ['ingredients', 'subcategories'] as const,

  // Moods
  moods: ['moods'] as const,
  moodById: (id: number) => ['moods', id] as const,

  // Recipes
  recipes: (params?: RecipeListParams) => ['recipes', params] as const,
  recipeById: (id: number) => ['recipes', id] as const,

  // User
  userProfile: ['user', 'profile'] as const,
  userEquipment: ['user', 'equipment'] as const,
  userIngredients: ['user', 'ingredients'] as const,
  userRatings: ['user', 'ratings'] as const,

  // Ratings
  recipeRatings: (recipeId: number) => ['recipes', recipeId, 'ratings'] as const,
};
```

### Custom Hooks

#### useRecipes
```typescript
// src/hooks/useRecipes.ts
import { useQuery } from '@tanstack/react-query';
import { mixrClient } from '../config/mixrClient';
import { queryKeys } from './queryKeys';

export function useRecipes(params?: RecipeListParams) {
  return useQuery({
    queryKey: queryKeys.recipes(params),
    queryFn: () => mixrClient.getRecipes(params),
  });
}

export function useRecipeById(id: number) {
  return useQuery({
    queryKey: queryKeys.recipeById(id),
    queryFn: () => mixrClient.getRecipeById(id),
  });
}
```

#### useUserProfile
```typescript
// src/hooks/useUserProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { apiClient } from '../utils/apiClient';

export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: () => apiClient.getUserProfile(),
    enabled: !!auth.currentUser, // Only fetch if logged in
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { displayName: string }) =>
      apiClient.updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
    },
  });
}
```

#### useRatings
```typescript
// src/hooks/useRatings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { apiClient } from '../utils/apiClient';

export function useRecipeRatings(recipeId: number) {
  return useQuery({
    queryKey: queryKeys.recipeRatings(recipeId),
    queryFn: () => apiClient.getRecipeRatings(recipeId),
  });
}

export function useCreateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeId, rating, review }: {
      recipeId: number;
      rating: number;
      review?: string;
    }) => apiClient.createRating(recipeId, rating, review),
    onSuccess: (data) => {
      // Invalidate recipe ratings query
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipeRatings(data.recipeId)
      });
      // Invalidate recipe detail to update average rating
      queryClient.invalidateQueries({
        queryKey: queryKeys.recipeById(data.recipeId)
      });
    },
  });
}
```

### Context API Usage

#### AuthContext
```typescript
// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Authentication & Authorization

### Firebase Configuration
```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Protected Route Component
```typescript
// src/components/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

### Token Management
```typescript
// src/utils/tokenHelpers.ts
import { getAuth } from 'firebase/auth';

export async function getFirebaseToken(): Promise<string | null> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return null;
  }
}

export async function refreshFirebaseToken(): Promise<string | null> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  try {
    const token = await user.getIdToken(true); // Force refresh
    return token;
  } catch (error) {
    console.error('Error refreshing Firebase token:', error);
    return null;
  }
}
```

---

## Implementation Phases

### Phase 1: Project Setup & Infrastructure (Week 1)
**Goal:** Set up project foundation and development environment

**Tasks:**
1. **Initialize Project**
   - Create React + Vite + TypeScript project
   - Copy and adapt configuration files from mail_box:
     - `tsconfig.json`
     - `eslint.config.js`
     - `vite.config.ts`
     - `tailwind.config.js`
     - `.prettierrc`
   - Set up Git repository
   - Create `.env.example` file

2. **Install Dependencies**
   - Install core dependencies:
     - React 19, React Router v7
     - @tanstack/react-query
     - Firebase
     - @sudobility packages
     - Local dependencies (mixr_lib, mixr_client)
   - Install dev dependencies:
     - ESLint, Prettier
     - TypeScript
     - Testing libraries (Vitest, Testing Library)

3. **Configure Firebase**
   - Set up Firebase project
   - Enable Firebase Auth (Email/Password + Google)
   - Configure Firebase in app
   - Create `src/config/firebase.ts`

4. **Set up Project Structure**
   - Create folder structure as specified
   - Set up routing skeleton
   - Create placeholder pages
   - Set up context providers

5. **Configure API Client**
   - Create `AuthenticatedNetworkClient`
   - Initialize `MixrClient` with authenticated client
   - Create API client utilities

**Deliverables:**
- Working development environment
- Firebase auth configured
- API client ready
- Basic routing functional

---

### Phase 2: Core Layout & Navigation (Week 1-2)
**Goal:** Build reusable layout components and navigation

**Tasks:**
1. **Create Layout Components**
   - `Header.tsx` - Top navigation with logo, search, user menu
   - `Footer.tsx` - Footer with links
   - `TopBar.tsx` - Secondary navigation bar
   - `ScreenContainer.tsx` - Page wrapper with consistent padding

2. **Implement Theme System**
   - `ThemeContext.tsx` - Dark/light mode
   - Apply @sudobility/design styles
   - Set up Tailwind configuration

3. **Build Base UI Components**
   - Copy/adapt components from @sudobility/components
   - Create custom components:
     - `Button`, `Card`, `Input`, `Select`
     - `LoadingSpinner`, `ErrorBoundary`, `EmptyState`

4. **Implement Navigation**
   - Set up React Router routes
   - Create `ProtectedRoute` component
   - Implement navigation hooks

**Deliverables:**
- Reusable layout components
- Theme system working
- Navigation functional
- Base UI components library

---

### Phase 3: Authentication (Week 2)
**Goal:** Implement user authentication flow

**Tasks:**
1. **Create Auth Components**
   - `LoginForm.tsx` - Email/password + Google login
   - `SignupForm.tsx` - Email/password + Google signup
   - `LoginPage.tsx`, `SignupPage.tsx`

2. **Implement Auth Context**
   - `AuthContext.tsx` - Firebase auth state management
   - Auth hooks (`useAuth`)
   - Token management utilities

3. **Create User Profile System**
   - User profile API integration
   - `UserContext.tsx` - User profile state
   - `useUserProfile` hook
   - Auto-create user profile on first login

4. **Build Profile Page**
   - Display user info
   - Edit profile form
   - Password reset functionality

**Deliverables:**
- Working login/signup
- User authentication flow
- User profile management
- Protected routes enforced

---

### Phase 4: Onboarding Flow (Week 2-3)
**Goal:** Build multi-step onboarding for new users

**Tasks:**
1. **Create Onboarding Components**
   - `OnboardingWizard.tsx` - Multi-step wizard
   - `OnboardingProgress.tsx` - Progress indicator
   - `EquipmentSelector.tsx` - Equipment selection grid
   - `IngredientSelector.tsx` - Ingredient selection grid

2. **Implement Equipment Selection**
   - Fetch equipment from API
   - Display equipment with icons
   - Preset options (Beginner, Home Bar, Pro)
   - Custom selection grid
   - Save to backend

3. **Implement Ingredient Selection**
   - Fetch ingredients from API
   - Subcategory tabs
   - Display ingredients with icons
   - Save to backend

4. **Complete Onboarding Flow**
   - Welcome screen
   - Step navigation
   - Skip functionality
   - Redirect to home after completion

**Deliverables:**
- Working onboarding flow
- Equipment and ingredient selection
- Data saved to backend
- Smooth user experience

---

### Phase 5: Recipe Browsing & Discovery (Week 3-4)
**Goal:** Build recipe browsing and discovery features

**Tasks:**
1. **Create Recipe Components**
   - `RecipeCard.tsx` - Recipe card with image, name, mood, rating
   - `RecipeGrid.tsx` - Grid layout with infinite scroll
   - `RecipeFilters.tsx` - Filter by mood, rating, ingredients
   - `RecipeSearch.tsx` - Search input

2. **Implement Home Page**
   - Tab navigation (Discover, Generate, My Recipes)
   - Discover tab with recipe grid
   - Filter and search functionality
   - Infinite scroll with React Query

3. **Build Recipe Detail Page**
   - `RecipeDetail.tsx` - Full recipe view
   - Display all recipe information:
     - Hero image
     - Name, description, mood
     - Ingredients with measurements
     - Equipment needed
     - Step-by-step instructions
   - Navigation and actions

4. **Implement Recipe API Integration**
   - `useRecipes` hook
   - `useRecipeById` hook
   - Recipe caching and pagination
   - Error handling and loading states

**Deliverables:**
- Recipe browsing functional
- Filtering and search working
- Recipe detail page complete
- Good performance with caching

---

### Phase 6: Mood Selection & Recipe Generation (Week 4)
**Goal:** Build mood-based recipe generation

**Tasks:**
1. **Create Mood Components**
   - `MoodSelector.tsx` - Mood selection grid
   - `MoodCard.tsx` - Large mood card with emoji
   - Visual selection states

2. **Implement Generate Page**
   - Mood grid display
   - Mood selection interaction
   - Generate button
   - Loading state with animation

3. **Build Generation Flow**
   - Fetch user's equipment and ingredients
   - Send generation request to API
   - Handle loading state
   - Navigate to recipe detail on success
   - Error handling

4. **Add "Surprise Me" Feature**
   - Random mood selection
   - Quick generation

**Deliverables:**
- Mood selection interface
- Recipe generation working
- Smooth UX with loading states
- Error handling

---

### Phase 7: Rating & Review System (Week 5)
**Goal:** Implement rating and review functionality

**Tasks:**
1. **Create Rating Components**
   - `RatingForm.tsx` - Star rating + text review form
   - `RatingDisplay.tsx` - Aggregate rating display
   - `ReviewList.tsx` - List of reviews
   - `ReviewCard.tsx` - Individual review card

2. **Implement Rating API Integration**
   - `useRecipeRatings` hook
   - `useCreateRating` mutation
   - `useUpdateRating` mutation
   - `useDeleteRating` mutation

3. **Add Rating to Recipe Detail**
   - Display aggregate rating
   - Show all reviews
   - Rating form for logged-in users
   - Edit/delete own rating

4. **Implement Rating Flow**
   - Prompt to rate after generating recipe
   - Submit rating optimistically
   - Update UI immediately
   - Sync with backend

**Deliverables:**
- Rating system functional
- Reviews displayed correctly
- Optimistic UI updates
- Good UX for rating flow

---

### Phase 8: Settings & Profile Management (Week 5-6)
**Goal:** Build user settings and inventory management

**Tasks:**
1. **Create Settings Components**
   - `SettingsPage.tsx` - Settings page with tabs
   - `ProfileTab.tsx` - Profile information
   - `EquipmentTab.tsx` - Equipment management
   - `IngredientsTab.tsx` - Ingredient management

2. **Implement Equipment Management**
   - Display user's equipment
   - Visual grid with add/remove toggles
   - Subcategory filtering
   - Save changes to backend

3. **Implement Ingredient Management**
   - Display user's ingredients
   - Subcategory tabs
   - Visual grid with add/remove toggles
   - Save changes to backend

4. **Build Profile Management**
   - Display profile info
   - Edit display name
   - Email management
   - Password reset link

**Deliverables:**
- Settings page complete
- Equipment/ingredient management functional
- Profile editing working
- Data synced with backend

---

### Phase 9: Landing Page & Marketing (Week 6)
**Goal:** Create compelling landing page

**Tasks:**
1. **Design Landing Page**
   - Hero section with CTA
   - Features section
   - "How It Works" section
   - Social proof (if available)
   - CTA section

2. **Implement Landing Components**
   - `HeroSection.tsx`
   - `FeaturesSection.tsx`
   - `HowItWorksSection.tsx`
   - `CTASection.tsx`

3. **Add SEO Optimization**
   - Meta tags
   - Structured data
   - Open Graph tags
   - Twitter cards

4. **Create Legal Pages**
   - Terms of Service
   - Privacy Policy
   - Cookie Policy (if needed)

**Deliverables:**
- Professional landing page
- SEO optimized
- Legal pages complete
- Clear CTAs

---

### Phase 10: Polish & Optimization (Week 7)
**Goal:** Refine UX, fix bugs, optimize performance

**Tasks:**
1. **UX Refinement**
   - Smooth transitions and animations
   - Loading states for all async operations
   - Error messages and empty states
   - Mobile responsiveness testing

2. **Performance Optimization**
   - Code splitting and lazy loading
   - Image optimization
   - Bundle size analysis
   - Query caching optimization

3. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Screen reader testing
   - Color contrast

4. **Cross-browser Testing**
   - Test on Chrome, Firefox, Safari, Edge
   - Fix browser-specific issues
   - Mobile browser testing

**Deliverables:**
- Polished UX
- Optimized performance
- Accessible to all users
- Cross-browser compatible

---

### Phase 11: Testing (Week 7-8)
**Goal:** Comprehensive testing coverage

**Tasks:**
1. **Unit Testing**
   - Test utility functions
   - Test custom hooks
   - Test API client

2. **Component Testing**
   - Test UI components
   - Test form validation
   - Test user interactions

3. **Integration Testing**
   - Test authentication flow
   - Test recipe generation flow
   - Test rating flow

4. **E2E Testing**
   - Test critical user journeys
   - Test onboarding flow
   - Test recipe browsing and rating

**Deliverables:**
- >80% test coverage
- All critical flows tested
- E2E tests for key features

---

### Phase 12: Deployment & Launch (Week 8)
**Goal:** Deploy to production

**Tasks:**
1. **Production Build**
   - Configure environment variables
   - Build for production
   - Test production build

2. **Deployment**
   - Set up hosting (Vercel, Netlify, or other)
   - Configure domain
   - Set up CI/CD pipeline

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Set up analytics (Google Analytics)
   - Performance monitoring

4. **Launch**
   - Soft launch for testing
   - Collect user feedback
   - Fix critical issues
   - Full launch

**Deliverables:**
- App deployed to production
- Monitoring in place
- Launch complete

---

## Configuration & Setup

### Environment Variables
```env
# .env.example
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_MIXR_API_URL=http://localhost:3000
VITE_APP_NAME=MIXR
```

### package.json Dependencies
```json
{
  "name": "mixr",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "dev:local": "USE_LOCAL_LIB=true vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "@heroicons/react": "^2.0.18",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@sudobility/components": "^2.0.24",
    "@sudobility/design": "^1.1.3",
    "@sudobility/di": "^1.4.17",
    "@sudobility/mixr_client": "file:../mixr_client",
    "@sudobility/mixr_lib": "file:../mixr_lib",
    "@sudobility/types": "^1.9.12",
    "@tanstack/react-query": "^5.90.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^12.4.0",
    "i18next": "^25.5.3",
    "i18next-browser-languagedetector": "^8.2.0",
    "lucide-react": "^0.548.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-helmet-async": "^2.0.5",
    "react-hook-form": "^7.53.2",
    "react-i18next": "^16.2.1",
    "react-router-dom": "^7.9.4",
    "tailwind-merge": "^3.3.1",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.37.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^24.7.1",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "@typescript-eslint/eslint-plugin": "^8.46.0",
    "@typescript-eslint/parser": "^8.46.0",
    "@vitejs/plugin-react": "^5.1.0",
    "@vitest/coverage-v8": "^4.0.4",
    "autoprefixer": "^10.4.19",
    "eslint": "^9.37.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.23",
    "globals": "^16.3.0",
    "jsdom": "^27.0.1",
    "postcss": "^8.4.41",
    "prettier": "^3.6.2",
    "tailwindcss": "^3.4.18",
    "typescript": "^5.9.3",
    "vite": "^7.1.12",
    "vitest": "^4.0.4"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## Testing Strategy

### Unit Testing
- Test utility functions (validators, formatters, helpers)
- Test custom hooks (useAuth, useUserProfile, useRecipes)
- Test API client methods
- Coverage goal: >80%

### Component Testing
- Test UI components in isolation
- Test user interactions (clicks, inputs)
- Test conditional rendering
- Test error states

### Integration Testing
- Test authentication flow end-to-end
- Test onboarding flow
- Test recipe generation flow
- Test rating submission flow

### E2E Testing
- Critical user journeys:
  - New user signup → onboarding → recipe generation
  - Browse recipes → view detail → rate recipe
  - Settings → update equipment → generate recipe
- Use Playwright or Cypress

### Testing Tools
- **Unit/Component:** Vitest + Testing Library
- **E2E:** Playwright
- **Coverage:** Vitest coverage (c8)

---

## Deployment Considerations

### Hosting Options
1. **Vercel** (Recommended)
   - Automatic deployments from Git
   - Edge network (fast globally)
   - Easy environment variable management
   - Built-in CI/CD

2. **Netlify**
   - Similar to Vercel
   - Good for static sites
   - Easy setup

3. **Firebase Hosting**
   - Natural fit with Firebase Auth
   - Good performance
   - Integrated with other Firebase services

### CI/CD Pipeline
- Automated tests on PR
- Automated builds on merge to main
- Deploy preview for PRs
- Production deployment on release

### Monitoring & Analytics
- **Error Tracking:** Sentry
- **Analytics:** Google Analytics or Plausible
- **Performance:** Web Vitals, Lighthouse CI
- **Uptime:** UptimeRobot or similar

### Security Considerations
- HTTPS only
- Secure environment variables
- Firebase security rules
- Content Security Policy headers
- CORS configuration for API

### Performance Goals
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

---

## Summary

This technical design document provides a comprehensive plan for building the MIXR cocktail recipe React app. The implementation is broken down into 12 phases over approximately 8 weeks, covering:

1. Project setup and infrastructure
2. Core layout and navigation
3. Authentication system
4. Onboarding flow
5. Recipe browsing and discovery
6. Mood-based recipe generation
7. Rating and review system
8. Settings and profile management
9. Landing page and marketing
10. Polish and optimization
11. Testing
12. Deployment and launch

The architecture follows proven patterns from the mail_box reference project while adapting them for the cocktail recipe domain. The app uses modern technologies (React 19, Vite, TypeScript) and integrates with the existing mixr_lib and mixr_client libraries.

Key technical decisions:
- Firebase Auth for authentication
- mixr_api backend for all data storage (not Firestore)
- React Query for server state management
- Context API for client state
- Component-based architecture with reusable UI components
- Mobile-first, responsive design
- Performance-optimized with code splitting and caching

The result will be a polished, performant, and delightful cocktail recipe application that provides value to users through personalized recipe recommendations and community-driven ratings.

---

**Next Steps:**
1. Review and approve this plan
2. Set up Firebase project
3. Initialize React project with configurations
4. Begin Phase 1 implementation
5. Iterative development following the phase plan
