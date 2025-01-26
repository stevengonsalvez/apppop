# Application Monitoring

## Sentry Integration

### Setup

1. Environment Variables:
```env
VITE_SENTRY_DSN=your-sentry-dsn
```

2. Configuration (`src/utils/sentry.ts`):
```typescript
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [],
      environment: import.meta.env.MODE,
      enabled: import.meta.env.PROD,
      tracesSampleRate: 1.0,
    });
  }
};
```

### Source Maps

#### Setup

1. Run Sentry wizard:
```bash
npx @sentry/wizard@latest -i sourcemaps --saas
```

2. The wizard creates:
   - Sentry configuration for source map uploads
   - `.env.sentry-build-plugin` with auth token

3. Required CI/CD Environment Variables:
```env
SENTRY_AUTH_TOKEN=your-auth-token
```

4. Source maps enabled in `vite.config.ts`:
```typescript
build: {
  sourcemap: true
}
```

#### Validation

1. Build in production mode:
```bash
npm run build
```
You should see source map upload logs in console.

2. Verify source maps:
- Throw a test error in your app
- Check error in Sentry dashboard: https://apppop.sentry.io/issues/?project=4508709805162576
- Stack trace should show original source code

#### Troubleshooting

If source maps aren't working:
1. Check Sentry's [Troubleshooting Guide](https://docs.sentry.io/platforms/javascript/sourcemaps/troubleshooting_js)
2. Report issues on [Sentry's GitHub](https://github.com/getsentry/sentry-javascript/issues)

### Error Tracking

Sentry automatically tracks:
- Unhandled exceptions
- React render errors
- Promise rejections

### Custom Error Tracking

```typescript
try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
}
```

### Environment Configuration

Use a single `.env` file for all environments. Environment variables load based on build configuration.

### Performance Monitoring

Transaction sampling rate is set to 1.0 (100%). Adjust `tracesSampleRate` in sentry config for production if needed.

### Disabling Sentry

Two ways to disable Sentry:

1. Clear DSN in environment:
```env
VITE_SENTRY_DSN=
```

2. Skip initialization in `src/utils/sentry.ts`:
```typescript
export const initSentry = () => {
  // Disabled
  return;
};
```

### Test Widget Example

To add a test button that triggers a Sentry error:

```typescript
import * as Sentry from "@sentry/react";

export const SentryTest: React.FC = () => {
  const handleTestError = () => {
    try {
      throw new Error('Test error from AppPoP');
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  return (
    <IconButton 
      onClick={handleTestError}
      aria-label="Test Sentry Error"
    >
      <BugReportIcon />
    </IconButton>
  );
};
```

Usage in your component:
```typescript
import { SentryTest } from '../components/SentryTest';

// Inside your component's JSX
<SentryTest />
```

After clicking the bug icon:
1. Check your Sentry dashboard
2. You should see the error "Test error from AppPoP"
3. The error should include source maps and stack trace