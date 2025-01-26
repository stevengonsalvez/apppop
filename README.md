# AppPop

A modern React template with Material UI components, Supabase authentication, and TypeScript.

## Features

### 🔐 Authentication & Authorization
- Supabase authentication
- Protected routes
- User profile management

### 🎨 UI Components
- Material UI v5 components
- Responsive layout with:
  - Left drawer navigation (desktop)
  - Bottom navigation bar (mobile)
  - App bar with notifications
- Dark mode support
- Cookie consent management
- Loading states and error handling

### 📊 Analytics
- Microsoft Clarity integration with privacy controls
- Cookie-based consent management
- Analytics opt-in/opt-out functionality

## Documentation

Detailed documentation is available in the `docs` folder:

- [Setup Guide](docs/setup.md) - Initial setup and configuration
- [Theme System](docs/theme-system.md) - Color schemes and font configuration
- [Analytics](docs/analytics.md) - Analytics integration and privacy controls
- [Components](docs/components.md) - Available components and usage
- [Project Structure](docs/project-structure.md) - Codebase organization
- [Development Guide](docs/development.md) - Development workflow and best practices

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd apppop

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

See the [Setup Guide](docs/setup.md) for complete installation instructions.

## Theme System

### Color System

Each color scheme includes:

1. **Primary Colors**
   - `main` - Primary brand color
   - `light` - Lighter variant
   - `dark` - Darker variant
   - `contrastText` - Text color for primary backgrounds

2. **Secondary Colors**
   - Similar structure to primary colors
   - Used for accents and secondary actions

3. **Tertiary Colors**
   - Additional brand color for special elements
   - Available through CSS variables or theme variants
   - Use for unique UI elements or emphasis

4. **Background Colors**
   - `default` - Main background
   - `paper` - Card and surface backgrounds
   - `surface` - Alternative surface color
   - `surfaceVariant` - Additional surface variant

5. **Text Colors**
   - `primary` - Main text color
   - `secondary` - Less prominent text
   - `disabled` - Disabled state text

6. **State Colors**
   - `error` - Error states
   - `warning` - Warning states
   - `info` - Information states
   - `success` - Success states

### Using Colors in Components

1. **Standard MUI Colors**
```tsx
<Button color="primary">Primary Button</Button>
<Button color="secondary">Secondary Button</Button>
```

2. **Tertiary Colors**
```tsx
<Button color="tertiary">Tertiary Button</Button>
```

3. **CSS Variables**
```tsx
const StyledComponent = styled('div')({
  backgroundColor: 'var(--tertiary-main)',
  color: 'var(--tertiary-contrast-text)',
});
```

4. **Theme Access**
```tsx
const theme = useTheme();
const style = {
  color: theme.palette.primary.main,
  background: theme.palette.background.surface,
};
```

### Available Color Schemes

The app comes with several pre-configured color schemes:

- `default` - Classic blue Material Design theme
- `indigo` - Deep purple and pink accents
- `emerald` - Nature-inspired green theme
- `sunset` - Warm orange and yellow tones
- `ocean` - Calming blue tones
- `purpleRain` - Rich purple gradients
- `mint` - Fresh mint green theme

Each color scheme includes both light and dark mode variants.

### Configuring the Theme

1. **Default Theme**

   Set your preferred default theme in `src/config/theme.config.ts`:

   ```typescript
   export const themeConfig = {
     defaultColorScheme: 'ocean', // Choose from available schemes
     defaultDarkMode: false,      // Set dark mode as default
     persistTheme: true,          // Save preferences to localStorage
   };
   ```

2. **Runtime Theme Changes**

   Use the theme hooks in your components:

   ```typescript
   import { useTheme } from '../contexts/ThemeContext';

   const MyComponent = () => {
     const { setColorScheme, toggleDarkMode } = useTheme();

     // Change color scheme
     const handleSchemeChange = () => {
       setColorScheme('sunset');
     };

     // Toggle dark mode
     const handleDarkMode = () => {
       toggleDarkMode();
     };
   };
   ```

3. **Theme Persistence**

   Theme preferences are automatically saved to localStorage when `persistTheme` is enabled in the config.

### Creating Custom Color Schemes

Add your own color scheme in `src/theme/colorScheme.ts`:

```typescript
export const myCustomScheme: ColorScheme = {
  name: 'custom',
  light: {
    primary: {
      main: '#your-color',
      light: '#lighter-variant',
      dark: '#darker-variant',
      contrastText: '#text-color',
    },
    secondary: {
      // Similar structure to primary
    },
    tertiary: {
      // Similar structure to primary
    },
    background: {
      default: '#background-color',
      paper: '#surface-color',
      surface: '#alternative-surface',
      surfaceVariant: '#variant-surface',
    },
    text: {
      primary: '#main-text',
      secondary: '#secondary-text',
      disabled: '#disabled-text',
    },
    error: {
      // Error colors
    },
    // Optional: success, warning, info colors
  },
  dark: {
    // Dark mode variants with same structure
  },
};

// Add to colorSchemes object
export const colorSchemes = {
  // ... existing schemes
  custom: myCustomScheme,
} as const;
```

### Font System

Each font scheme includes:

1. **Font Families**
   - `primary` - Main font family for the application
   - `secondary` - Optional secondary font for specific elements

2. **Font Weights**
   - `light` (300) - Lightest weight
   - `regular` (400) - Regular text
   - `medium` (500) - Medium emphasis
   - `semibold` (600) - High emphasis
   - `bold` (700) - Strongest emphasis

3. **Letter Spacing**
   - `tight` - Compact spacing for headings
   - `normal` - Standard spacing for body text
   - `wide` - Expanded spacing for buttons/emphasis

### Available Font Schemes

The app comes with several pre-configured font schemes:

- `modern` - Uses Inter for a contemporary look
- `classic` - Roboto with Roboto Slab as secondary
- `minimal` - System fonts for a native feel

### Configuring Fonts

1. **Default Font Scheme**

   Set your preferred default font scheme in `src/config/theme.config.ts`:

   ```typescript
   export const themeConfig = {
     defaultColorScheme: 'sunset',
     defaultFontScheme: 'modern',    // Choose from available schemes
     defaultDarkMode: false,
     persistTheme: true,
   };
   ```

2. **Creating Custom Font Schemes**

   Add your own font scheme in `src/theme/fontScheme.ts`:

   ```typescript
   export const myCustomScheme: FontScheme = {
     fontFamily: {
       primary: '"Your-Font", "Fallback-Font", sans-serif',
       secondary: '"Optional-Secondary-Font", serif',
     },
     fontWeights: {
       light: 300,
       regular: 400,
       medium: 500,
       semibold: 600,
       bold: 700,
     },
     letterSpacing: {
       tight: '-0.02em',
       normal: '0em',
       wide: '0.02em',
     },
   };

   // Add to fontSchemes object
   export const fontSchemes = {
     // ... existing schemes
     custom: myCustomScheme,
   } as const;
   ```