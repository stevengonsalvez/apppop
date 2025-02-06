# Development Guide

## Development Workflow

### Starting Development

```bash
# Start development server
npm run dev

# Start with specific port
npm run dev -- --port 3000

# Start with HTTPS
npm run dev -- --https
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## Code Style

### TypeScript Configuration

The project uses strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### ESLint Rules

Key ESLint configurations:

```json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### Code Formatting

The project uses Prettier for consistent code formatting:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## Git Workflow

### Branch Naming

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Releases: `release/version`
- Hotfixes: `hotfix/description`

Example:
```bash
git checkout -b feature/add-dark-mode
```

### Commit Messages

Follow conventional commits:

```bash
# Features
git commit -m "feat: add dark mode support"

# Bug fixes
git commit -m "fix: resolve theme persistence issue"

# Breaking changes
git commit -m "feat!: redesign theme system"

# Documentation
git commit -m "docs: update theme configuration guide"
```

## Adding New Features

### 1. Create New Component

```typescript
// src/components/NewFeature.tsx
import { FC } from 'react';

interface NewFeatureProps {
  title: string;
  onAction: () => void;
}

export const NewFeature: FC<NewFeatureProps> = ({ title, onAction }) => {
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
```

### 2. Add Tests

```typescript
// src/components/__tests__/NewFeature.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { NewFeature } from '../NewFeature';

describe('NewFeature', () => {
  it('should render title', () => {
    render(<NewFeature title="Test" onAction={() => {}} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should call onAction when clicked', () => {
    const onAction = jest.fn();
    render(<NewFeature title="Test" onAction={onAction} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onAction).toHaveBeenCalled();
  });
});
```

### 3. Add to Page

```typescript
// src/pages/SomePage.tsx
import { NewFeature } from '../components/NewFeature';

export const SomePage = () => {
  const handleAction = () => {
    // Handle action
  };

  return (
    <div>
      <NewFeature
        title="New Feature"
        onAction={handleAction}
      />
    </div>
  );
};
```

## Performance Optimization

### 1. Component Optimization

```typescript
// Use React.memo for expensive renders
const ExpensiveComponent = React.memo(({ data }) => {
  // Render
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return someExpensiveCalculation(deps);
}, [deps]);

// Use useCallback for function props
const handleClick = useCallback(() => {
  // Handle click
}, [deps]);
```

### 2. Code Splitting

```typescript
// Lazy load components
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Use in routes
<Route
  path="/lazy"
  element={
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  }
/>
```

### 3. Bundle Analysis

```bash
# Analyze bundle size
npm run build -- --analyze
```

## Error Handling

### 1. API Errors

```typescript
const fetchData = async () => {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new NotFoundError('Data not found');
    }
    throw new ApiError('Failed to fetch data');
  }
};
```

### 2. Component Errors

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to service
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Security Best Practices

### 1. Environment Variables

```typescript
// Use environment variables for sensitive data
const api = createApi({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY,
  },
});
```

### 2. XSS Prevention

```typescript
// Sanitize user input
import DOMPurify from 'dompurify';

const SafeHTML = ({ html }) => {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};
```

### 3. CSRF Protection

```typescript
// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  config.headers['X-CSRF-Token'] = token;
  return config;
});
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