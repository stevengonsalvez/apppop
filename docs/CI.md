# CI/CD Setup Guide

## Prerequisites
- Node.js and npm installed
- Git repository initialized
- Ionic CLI installed globally
```bash
npm install -g @ionic/cli
```

## Initial Setup

### 1. Ionic Account Setup
1. Visit [ionic.io/getting-started](https://ionic.io/getting-started)
2. Create an account
3. Generate Personal Access Token from Dashboard → Settings → API Tokens

### 2. Repository Setup
1. Link repository:
```bash
ionic link
```
2. Select "Create new app"
3. Choose Git hosting service

### 3. Environment Configuration

Required secrets for CI:
```env
IONIC_TOKEN=your-ionic-token
SENTRY_AUTH_TOKEN=your-sentry-token
VITE_SENTRY_DSN=your-sentry-dsn
VITE_APP_SUPABASE_URL=your-supabase-url
VITE_APP_SUPABASE_ANON_KEY=your-supabase-key
```

## Build Configuration

### Android Setup
1. Install Android Studio
2. Create keystore:
```bash
keytool -genkey -v -keystore apppop.keystore -alias apppop -keyalg RSA -keysize 2048 -validity 10000
```
3. Configure variables:
```env
ANDROID_KEYSTORE_FILE=path/to/apppop.keystore
ANDROID_KEYSTORE_ALIAS=apppop
ANDROID_KEYSTORE_PASSWORD=your-password
```

### iOS Setup
1. Install Xcode
2. Configure certificates in Apple Developer Portal
3. Set variables:
```env
APPLE_ID=your-apple-id
APPLE_APP_SPECIFIC_PASSWORD=app-specific-password
APPLE_TEAM_ID=your-team-id
```

## Build Commands

### Web Build
```bash
npm run build
```

### Android Build
```bash
ionic capacitor build android --prod
```

### iOS Build
```bash
ionic capacitor build ios --prod
```

## GitHub Actions Workflow

Create `.github/workflows/build.yml`:

```yaml
name: Build App

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Build Web
        run: npm run build
        env:
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
          VITE_APP_SUPABASE_URL: ${{ secrets.VITE_APP_SUPABASE_URL }}
          VITE_APP_SUPABASE_ANON_KEY: ${{ secrets.VITE_APP_SUPABASE_ANON_KEY }}
          
      - name: Upload Source Maps
        run: npm run sentry:upload
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          
      - name: Build Android
        run: |
          ionic capacitor build android --prod --no-open
        env:
          IONIC_TOKEN: ${{ secrets.IONIC_TOKEN }}
```

## Deployment

### Web Deployment
```bash
npm run build
npm run serve-prod
```

### Mobile Store Deployment

#### Android
1. Build signed APK:
```bash
ionic capacitor build android --prod --release
```
2. Upload to Play Store via Google Play Console

#### iOS
1. Build archive:
```bash
ionic capacitor build ios --prod
```
2. Use Xcode to upload to App Store Connect