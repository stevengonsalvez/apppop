# Cookie Consent System

The app includes a comprehensive cookie consent management system that complies with GDPR and similar privacy regulations. This system manages user consent for different types of cookies and integrates with various analytics services.

## Overview

The cookie consent system consists of two main components:
1. `CookieManager` - Core management class (`src/utils/cookieManager.ts`)
2. `CookieConsentBanner` - UI component (`src/components/CookieConsentBanner.tsx`)

## Cookie Categories

By default, the system includes three cookie categories:

```typescript
export const CONSENT_CATEGORIES = [
  {
    id: 'necessary',
    name: 'Necessary',
    description: 'Essential cookies for website functionality',
    detailedDescription: 'These cookies are required for the website to function properly. They cannot be disabled.',
    required: true,
    cookies: ['session', 'csrf']
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Cookies for website analytics and performance',
    detailedDescription: 'These cookies help us understand how visitors interact with our website, helping us improve our services.',
    required: false,
    cookies: ['_clarity']
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing and advertising cookies',
    detailedDescription: 'These cookies are used to track visitors across websites to display relevant advertisements.',
    required: false,
    cookies: []
  }
];
```

### Adding a New Cookie Category

To add a new cookie category, modify the `CONSENT_CATEGORIES` array in `cookieManager.ts`:

```typescript
export const CONSENT_CATEGORIES = [
  // ... existing categories ...
  {
    id: 'preferences',
    name: 'Preferences',
    description: 'Cookies that remember your settings',
    detailedDescription: 'These cookies remember your preferences to provide enhanced, more personal features.',
    required: false,
    cookies: ['user_theme', 'language_pref']
  }
];
```

## Customizing the Cookie Banner

### Modifying Text and Styling

The `CookieConsentBanner` component can be customized in several ways:

1. **Main Banner Text**:
```tsx
// In CookieConsentBanner.tsx
<Typography variant="body1" gutterBottom>
  This website uses cookies to enhance your experience.
</Typography>
```

2. **Button Labels**:
```tsx
<Button variant="outlined" onClick={handleDeclineAll}>
  Reject All  // Change this text
</Button>
<Button variant="contained" onClick={handleAcceptAll}>
  Accept All  // Change this text
</Button>
```

3. **Preferences Modal**:
```tsx
<DialogTitle>
  <Typography component="div" variant="h5" fontWeight="bold">
    Cookie Preferences  // Change this text
  </Typography>
</DialogTitle>
```

### Styling Examples

1. **Custom Banner Style**:
```tsx
<Paper
  elevation={6}
  sx={{
    p: 3,
    bgcolor: 'background.paper',
    borderTop: '4px solid',  // Add a top border
    borderColor: 'primary.main',  // Use theme primary color
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: 'center',
    gap: 2,
    width: '100%',
  }}
>
```

2. **Custom Button Style**:
```tsx
<Button
  variant="contained"
  onClick={handleAcceptAll}
  fullWidth
  size="large"
  sx={{
    background: (theme) => `linear-gradient(45deg, 
      ${theme.palette.primary.main}, 
      ${theme.palette.primary.light}
    )`,
    '&:hover': {
      background: (theme) => `linear-gradient(45deg, 
        ${theme.palette.primary.dark}, 
        ${theme.palette.primary.main}
      )`,
    }
  }}
>
  Accept All
</Button>
```

## Analytics Integration

The cookie consent system integrates with analytics through the consent verification system.

### How It Works

1. **Consent Verification**:
```typescript
// Check if analytics are allowed
const canUseAnalytics = cookieManager.hasConsent('analytics');
if (canUseAnalytics) {
  // Initialize analytics
  initializeAnalytics();
}
```

2. **Example Analytics Integration**:
```typescript
// analyticsManager.ts
import { cookieManager } from './cookieManager';

export const initializeAnalytics = () => {
  if (!cookieManager.hasConsent('analytics')) {
    return;
  }

  // Initialize Microsoft Clarity
  if (process.env.VITE_CLARITY_TRACKING_CODE) {
    clarity.init(process.env.VITE_CLARITY_TRACKING_CODE);
  }

  // Initialize Google Analytics
  if (process.env.VITE_GA4_MEASUREMENT_ID) {
    gtag('config', process.env.VITE_GA4_MEASUREMENT_ID);
  }
};
```

### Adding New Analytics Service

1. **Update Cookie Category**:
```typescript
{
  id: 'analytics',
  name: 'Analytics',
  description: 'Cookies for website analytics and performance',
  detailedDescription: 'These cookies help us understand how visitors interact with our website.',
  required: false,
  cookies: ['_clarity', '_ga', 'your_new_cookie'] // Add new cookie
}
```

2. **Implement Service Integration**:
```typescript
export const initializeNewAnalytics = () => {
  if (!cookieManager.hasConsent('analytics')) {
    return;
  }

  // Initialize your new analytics service
  if (process.env.VITE_NEW_ANALYTICS_KEY) {
    newAnalytics.initialize({
      key: process.env.VITE_NEW_ANALYTICS_KEY,
      options: {
        // Your configuration
      }
    });
  }
};
```

## Cookie Cleanup

The system automatically cleans up cookies when consent is withdrawn:

```typescript
private cleanupCookies(categoryId: string): void {
  const category = CONSENT_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return;

  category.cookies.forEach(cookieName => {
    const domains = [
      window.location.hostname,
      `.${window.location.hostname}`,
      window.location.hostname.split('.').slice(1).join('.'),
      `.${window.location.hostname.split('.').slice(1).join('.')}`
    ];
    
    domains.forEach(domain => {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    });
  });
}
```

## Best Practices

1. **Always Check Consent**:
```typescript
if (cookieManager.hasConsent('analytics')) {
  // Proceed with analytics
}
```

2. **Handle Consent Changes**:
```typescript
useEffect(() => {
  const consentStatus = cookieManager.hasConsent('analytics');
  if (!consentStatus) {
    // Cleanup analytics
    cleanupAnalytics();
  } else {
    // Initialize analytics
    initializeAnalytics();
  }
}, [/* dependencies */]);
```

3. **Clear Documentation**:
```typescript
// Add clear descriptions for each cookie category
const category = {
  id: 'analytics',
  name: 'Analytics',
  description: 'Short, clear description',
  detailedDescription: `
    Detailed explanation of:
    - What data is collected
    - How it's used
    - Why it's beneficial
    - Who has access to it
  `,
  required: false,
  cookies: ['_ga', '_gid']
};
```

## Testing

To test the cookie consent system:

1. **Clear Existing Consent**:
```typescript
cookieManager.clearAllConsents();
```

2. **Check Consent Status**:
```typescript
const consents = cookieManager.getConsents();
console.log('Current consents:', consents);
```

3. **Verify Cookie Cleanup**:
```typescript
// Before withdrawing consent
console.log('Before:', document.cookie);
cookieManager.setConsent('analytics', false);
console.log('After:', document.cookie);
``` 