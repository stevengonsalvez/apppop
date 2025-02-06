# Setup Guide

## Prerequisites

- Node.js >= 18
- npm >= 7
- Git

## Initial Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Required)
VITE_APP_SUPABASE_URL=your-project-url
VITE_APP_SUPABASE_ANON_KEY=your-anon-key
```

## Core Services Setup

### 1. Supabase Setup (Required)

1. Create a project at [Supabase](https://app.supabase.io)
2. Get credentials from Project Settings > API
3. Configure Authentication:
   - Go to Authentication > Settings
   - Configure Email & OAuth providers
   - Set up Row Level Security (RLS)

For detailed authentication setup, see [Authentication Guide](./auth.md).

### 2. Additional Features (Optional)

Configure these features as needed:

- [🔍 Google Tag Manager Setup](./gtm-setup.md)
- [📊 Google Analytics Integration](./GoogleAnalytics.md)
- [📈 Application Monitoring](./monitoring.md)
- [🔥 Heatmap Analytics](./heatmap.md)
- [🍪 Cookie Consent](./cookieconsent.md)

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI

# Code Quality
npm run lint         # Run linter
npm run lint:fix     # Fix linting issues
```

For detailed development guidelines, see [Development Guide](./development.md).

## Project Structure

```
├── src/
│   ├── components/          # Reusable components
│   ├── contexts/           # React contexts
│   ├── hooks/             # Custom hooks
│   ├── pages/             # Page components
│   ├── theme/             # Theme configuration
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   └── index.tsx          # Entry point
├── docs/                  # Documentation
├── playwright/           # E2E tests
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Additional Documentation

- [🎨 Theme System](./theme-system.md) - Customize the application theme
- [🧩 Components](./components.md) - Available components and usage
- [🔄 CI/CD Setup](./ci.md) - Continuous Integration and Deployment

## Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
   - Verify credentials in `.env`
   - Check RLS policies
   - Ensure database is running

2. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check TypeScript errors
   - Verify import paths

3. **Test Failures**
   - Update test snapshots: `npm test -- -u`
   - Check test environment variables
   - Verify test database state 