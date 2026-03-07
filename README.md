# MIXR

React web application for the MIXR cocktail recipe platform -- discover and generate cocktail recipes based on your mood, equipment, and available ingredients.

## Tech Stack

- React 19, Vite 7, TypeScript
- Tailwind CSS + Radix UI
- React Router v7, TanStack React Query v5, Zustand
- Firebase Auth, i18next

## Development

```bash
bun run dev          # Start Vite dev server
bun run dev:local    # Dev with local library aliases (USE_LOCAL_LIB=true)
bun run build        # Build for production (tsc + vite)
bun run test         # Run Vitest
bun run lint         # ESLint check
bun run typecheck    # TypeScript check
bun run verify       # Typecheck + lint + test
```

## Environment Variables

Configure in `.env.local`:

```bash
VITE_MIXR_API_URL=http://localhost:6174
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_APP_NAME=MIXR
```

## Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Landing | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/recipes` | Home (Browse/Generate/My Recipes) | Generate requires auth |
| `/recipes/:id` | Recipe Detail | No |
| `/onboarding` | Preferences Setup | Yes |
| `/settings` | Account Settings | Yes |

## Features

- Mood-based recipe generation via multi-step wizard
- Equipment and ingredient preference management
- Infinite scroll recipe browsing
- Star ratings and reviews
- Firebase auth (email/password + Google)
- Responsive design with Tailwind CSS

## Related Packages

- `@sudobility/mixr_client` -- API client and hooks
- `@sudobility/mixr_lib` -- business logic and utilities
- `@sudobility/mixr_types` -- shared type definitions
- `mixr_api` -- backend API server

## License

MIT
