# Analytics Integration

The app includes Microsoft Clarity integration with comprehensive privacy controls and cookie-based consent management.

## Cookie Consent System

### Cookie Banner

The app uses a cookie consent banner (`src/components/CookieConsentBanner.tsx`) that provides:
- Initial consent prompt
- Accept/Reject all options
- Detailed preferences management

### Cookie Categories

1. **Necessary (Required)**
   - Essential for app functionality
   - Cannot be disabled
   - Examples: Authentication, session management

2. **Analytics (Optional)**
   - Used for understanding user behavior
   - Can be enabled/disabled
   - Examples: Microsoft Clarity tracking

3. **Marketing (Optional)**
   - Used for marketing purposes
   - Can be enabled/disabled
   - Examples: Ad tracking, retargeting

## Cookie Management

The cookie management system (`src/utils/cookieManager.ts`) provides:

1. **Category-based Consent**
```typescript
// Check consent for a category
if (cookieManager.hasConsent('analytics')) {
  // Initialize analytics
}

// Set consent for a category
cookieManager.setConsent('analytics', true);
```

2. **Automatic Cookie Cleanup**
```typescript
// Cookies are automatically removed when consent is withdrawn
cookieManager.setConsent('analytics', false);
// All analytics cookies are cleared
```

3. **Consent Persistence**
```typescript
// Consent preferences are saved to localStorage
cookieManager.persistConsent();
```

## Microsoft Clarity Integration

### Setup

1. Create a project at [https://clarity.microsoft.com](https://clarity.microsoft.com)
2. Get your Clarity project ID
3. Add it to your `.env` file:
```env
VITE_CLARITY_ID=your-clarity-project-id
```

### Privacy Controls

The Clarity manager (`src/utils/clarityManager.ts`) provides:

1. **Consent-based Initialization**
```typescript
// Clarity only loads if analytics consent is given
if (cookieManager.hasConsent('analytics')) {
  clarityManager.initialize();
}
```

2. **Clean Removal**
```typescript
// When consent is withdrawn
clarityManager.remove();
// Removes Clarity script and cleans up cookies
```

3. **Runtime Controls**
```typescript
// Pause tracking
clarityManager.pause();

// Resume tracking
clarityManager.resume();
```

### Custom Event Tracking

You can track custom events in Clarity:

```typescript
import { clarityManager } from '../utils/clarityManager';

// Track a simple event
clarityManager.trackEvent('button_click');

// Track an event with data
clarityManager.trackEvent('form_submit', {
  formType: 'registration',
  success: true,
});
```

## Best Practices

1. **Always Check Consent**
```typescript
// Before initializing any analytics
if (cookieManager.hasConsent('analytics')) {
  // Initialize analytics
}
```

2. **Clear Communication**
- Be transparent about what data is collected
- Explain how data is used
- Make it easy to change preferences

3. **Respect Privacy**
- Don't track before consent
- Remove tracking when consent is withdrawn
- Keep personal data collection minimal

4. **Testing**
```typescript
// Test consent management
it('should not initialize analytics without consent', () => {
  cookieManager.setConsent('analytics', false);
  expect(clarityManager.isInitialized()).toBe(false);
});
``` 