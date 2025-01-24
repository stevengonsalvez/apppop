# Ionic React Template

A production-ready template with authentication, testing, and common UI components.

## Features

- 🔐 Authentication with Supabase
- 📱 PWA support
- 🎨 Tailwind CSS
- 🧪 Testing (Vitest + Playwright)
- 🔄 Tanstack Query
- 🍪 Cookie consent
- 📊 Analytics ready
- 📱 iOS/Android builds
- ⚡ Edge Functions

## Prerequisites

- Node.js 18+
- Supabase CLI
- iOS/Android development setup (optional)

## Quick Start

1. Clone the repository:
```bash
git clone [your-repo-url]
cd ionic-template
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Initialize Supabase
supabase init

# Start Supabase locally
supabase start

# Get local credentials
supabase status
```

4. Create environment file:
```bash
cp .env.example .env
```

Update with your Supabase credentials:
```
VITE_APP_SUPABASE_URL=your_supabase_url
VITE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
VITE_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

5. Run migrations:
```bash
supabase db reset
```

6. Start development server:
```bash
npm run dev
```

## Edge Functions

Deploy edge functions:
```bash
npm run functions:deploy
```

Run locally:
```bash
npm run functions:serve
```

## Testing

Run unit tests:
```bash
npm run test
```

Run E2E tests:
```bash
npm run test:e2e
```

Run all tests:
```bash
npm run test:all
```

## iOS Setup

```bash
npm run build
npx cap add ios
npx cap open ios
```

## Android Setup

```bash
npm run build
npx cap add android
npx cap open android
```

## Project Structure

```
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Route pages
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── supabase/
│   ├── functions/      # Edge functions
│   └── migrations/     # Database migrations
├── tests/              # Test utilities
└── playwright/         # E2E tests
```

## Contributing

1. Create a feature branch
2. Commit changes
3. Push to the branch
4. Open a pull request

## License

MIT