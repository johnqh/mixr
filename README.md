# MIXR - Cocktail Recipe App

A React-based web application for discovering and generating cocktail recipes based on your mood, equipment, and available ingredients.

## Features

- 🍹 Mood-based recipe generation
- 📦 Equipment and ingredient inventory management
- 🔍 Browse and discover recipes
- ⭐ Rate and review cocktails
- 🔐 Firebase authentication (Email/Password + Google)
- 📱 Responsive design

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router v7
- @tanstack/react-query
- Firebase Auth
- Tailwind CSS
- @sudobility packages (components, design, di, types)

## Getting Started

### Prerequisites

- Node.js >= 20.18.0
- npm >= 8.0.0

### Installation

1. Clone the repository
```bash
git clone git@github.com:johnqh/mixr.git
cd mixr
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your Firebase and API configuration
```

4. Start development server
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run dev:local` - Start development server with local libraries
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
mixr/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route pages
│   ├── context/        # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── config/         # Configuration files
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── plans/              # Technical design documents
└── ...config files
```

## Documentation

See `/plans/APP.md` for comprehensive technical design and implementation plan.

## License

MIT
