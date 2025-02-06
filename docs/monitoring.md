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
SENTRY_ORG=your-org-name
SENTRY_PROJECT=your-project-name
```

4. Source maps configuration in `vite.config.ts`:
```typescript
sentryVitePlugin({
  org: process.env.SENTRY_ORG || "default-org",
  project: process.env.SENTRY_PROJECT || "default-project",
  telemetry: false  // Disable sending telemetry data to Sentry
}),

build: {
  sourcemap: true
}
```

The configuration supports:
- Loading organization and project names from environment variables
- Disabling telemetry data collection
- Fallback values if environment variables are not set

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

There are several ways to disable Sentry:

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

3. Disable Sentry during build time:
   - Use the environment variable:
     ```bash
     DISABLE_SENTRY=true npm run build
     ```
   - Or use the provided npm script:
     ```bash
     npm run build:no-sentry
     ```
   This will:
   - Skip the Sentry plugin during build
   - Prevent source map uploads
   - Avoid Sentry organization/project configuration issues

The build-time disabling is configured in `vite.config.ts`:
```typescript
const getPlugins = () => {
  const plugins = [react(), legacy()];
  
  // Only include Sentry plugin if DISABLE_SENTRY is not set
  if (process.env.DISABLE_SENTRY !== 'true') {
    plugins.push(
      sentryVitePlugin({
        org: process.env.SENTRY_ORG || "self-axx",
        project: process.env.SENTRY_PROJECT || "self",
        telemetry: false
      })
    );
  }
  
  return plugins;
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