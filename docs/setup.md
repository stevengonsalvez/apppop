# Setup Guide

## Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd apppop

# Install dependencies
npm install
```

## Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```env
# Supabase Configuration
VITE_APP_SUPABASE_URL=your-project-url
VITE_APP_SUPABASE_ANON_KEY=your-anon-key

# Microsoft Clarity (Optional)
VITE_CLARITY_ID=your-clarity-project-id
```

## Supabase Setup

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)
2. Copy your project's URL and anon key from Project Settings > API
3. Configure Authentication Settings in Supabase Dashboard:
   - Go to Authentication > Settings > Email Auth
   - Turn off "Enable email confirmations" 
   - Click "Save"

## Microsoft Clarity Setup (Optional)

1. Create a project at [https://clarity.microsoft.com](https://clarity.microsoft.com)
2. Get your Clarity project ID
3. Add it to your `.env` file as `VITE_CLARITY_ID`

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

## Project Structure

```
src/
├── components/     # Reusable components
│   ├── LeftDrawer.tsx
│   ├── BottomNav.tsx
│   └── CookieConsentBanner.tsx
├── contexts/       # React contexts
│   ├── ThemeContext.tsx
│   └── AuthContext.tsx
├── pages/         # Page components
│   ├── Landing.tsx
│   ├── Login.tsx
│   └── Profile.tsx
├── theme/         # Material UI theme
│   ├── colorScheme.ts
│   ├── fontScheme.ts
│   └── theme.ts
├── utils/         # Utility functions
│   ├── supabaseClient.ts
│   └── cookieManager.ts
└── App.tsx        # Main app component
```

## Adding New Pages

1. Create your page component in `src/pages`
2. Add the route in `App.tsx`
3. Add navigation item in `LeftDrawer.tsx` if needed

Example:
```typescript
// In LeftDrawer.tsx
const mainNavItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/home' },
  { text: 'Your New Page', icon: <YourIcon />, path: '/your-path' },
];
```

## Best Practices

1. **Cookie Consent**: Always check consent before initializing analytics:
```typescript
if (cookieManager.hasConsent('analytics')) {
  // Initialize analytics
}
```

2. **Navigation**: Use the `useHistory` hook for navigation:
```typescript
const history = useHistory();
history.push('/your-path');
```

3. **Protected Routes**: Wrap authenticated routes with `PrivateRoute`:
```typescript
<PrivateRoute exact path="/protected">
  <YourComponent />
</PrivateRoute>
``` 