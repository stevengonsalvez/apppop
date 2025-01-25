# Components

The app includes several pre-built components designed for a modern, responsive user interface.

## Navigation Components

### Left Drawer (`LeftDrawer.tsx`)

Desktop-focused navigation drawer that provides:
- Main navigation items
- Bottom actions (theme toggle, logout)
- Collapsible/expandable states

```typescript
import { LeftDrawer } from '../components/LeftDrawer';

// Usage
<LeftDrawer
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  variant="permanent" // or "temporary" for mobile
/>
```

### Bottom Navigation (`BottomNav.tsx`)

Mobile-focused navigation bar that provides:
- Quick access to key features
- Active state indicators
- Responsive layout

```typescript
import { BottomNav } from '../components/BottomNav';

// Usage
<BottomNav
  value={currentPath}
  onChange={(_, newPath) => navigate(newPath)}
/>
```

### App Bar

Main application header that includes:
- Burger menu for mobile
- App title
- Action icons (notifications, search)
- Responsive layout

```typescript
import { AppBar } from '../components/AppBar';

// Usage
<AppBar
  onMenuClick={() => setDrawerOpen(true)}
  title="Your App Name"
/>
```

## Cookie Consent Components

### Cookie Banner (`CookieConsentBanner.tsx`)

GDPR-compliant cookie consent banner that provides:
- Initial consent prompt
- Detailed preferences dialog
- Persistence of choices

```typescript
import { CookieConsentBanner } from '../components/CookieConsentBanner';

// Usage
<CookieConsentBanner
  onAcceptAll={() => handleAcceptAll()}
  onRejectAll={() => handleRejectAll()}
  onCustomize={() => setShowPreferences(true)}
/>
```

### Cookie Preferences Dialog

Detailed cookie preferences management that allows:
- Category-based consent
- Detailed descriptions
- Save preferences

```typescript
import { CookiePreferences } from '../components/CookiePreferences';

// Usage
<CookiePreferences
  open={showPreferences}
  onClose={() => setShowPreferences(false)}
  onSave={(preferences) => handleSavePreferences(preferences)}
/>
```

## Authentication Components

### Login Form

Material UI styled login form with:
- Email/password fields
- Social login options
- Error handling
- Loading states

```typescript
import { LoginForm } from '../components/LoginForm';

// Usage
<LoginForm
  onSubmit={handleLogin}
  onSocialLogin={handleSocialLogin}
  loading={isLoading}
/>
```

### Registration Form

User registration form with:
- Required fields validation
- Password strength indicator
- Terms acceptance
- Error handling

```typescript
import { RegistrationForm } from '../components/RegistrationForm';

// Usage
<RegistrationForm
  onSubmit={handleRegistration}
  loading={isRegistering}
/>
```

## Utility Components

### Loading Overlay

Fullscreen loading indicator with:
- Backdrop
- Centered spinner
- Optional message

```typescript
import { LoadingOverlay } from '../components/LoadingOverlay';

// Usage
<LoadingOverlay
  open={isLoading}
  message="Processing your request..."
/>
```

### Error Boundary

Component error boundary with:
- Fallback UI
- Error reporting
- Reset capability

```typescript
import { ErrorBoundary } from '../components/ErrorBoundary';

// Usage
<ErrorBoundary
  fallback={<ErrorMessage />}
  onError={reportError}
>
  <YourComponent />
</ErrorBoundary>
```

### Notification Toast

Toast notifications system with:
- Success/error/warning/info variants
- Auto-dismiss
- Action buttons

```typescript
import { useNotification } from '../hooks/useNotification';

// Usage
const { showNotification } = useNotification();

showNotification({
  message: 'Operation successful',
  type: 'success',
  action: {
    label: 'Undo',
    onClick: handleUndo,
  },
});
```

## Best Practices

1. **Component Composition**
```typescript
// Prefer composition over inheritance
const EnhancedButton = ({ children, ...props }) => (
  <Button
    variant="contained"
    color="primary"
    {...props}
  >
    {children}
  </Button>
);
```

2. **Error Handling**
```typescript
// Always handle loading and error states
const MyComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (loading) return <LoadingOverlay />;
  if (error) return <ErrorMessage error={error} />;

  return <YourContent />;
};
```

3. **Responsive Design**
```typescript
// Use MUI's responsive utilities
const ResponsiveComponent = () => (
  <Box
    sx={{
      display: { xs: 'none', md: 'block' },
      padding: { xs: 2, sm: 3, md: 4 },
    }}
  >
    Content
  </Box>
);
```

4. **Accessibility**
```typescript
// Always include proper ARIA attributes
const AccessibleButton = ({ label, onClick }) => (
  <Button
    aria-label={label}
    onClick={onClick}
    role="button"
  >
    {label}
  </Button>
);
``` 