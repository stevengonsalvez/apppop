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

Source maps are enabled in `vite.config.ts`:
```typescript
build: {
  sourcemap: true
}
```

This allows Sentry to show readable stack traces with original source code references in error reports.

### Environment Configuration

Use a single `.env` file for all environments. The environment variables will be loaded based on your build configuration.

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

### Performance Monitoring

Transaction sampling rate is set to 1.0 (100%). Adjust `tracesSampleRate` in sentry config for production if needed.
