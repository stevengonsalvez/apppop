# 🚀 AppPop

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![NPM Version](https://img.shields.io/npm/v/create-apppop-app.svg)](https://www.npmjs.com/package/create-apppop-app)
[![DeepSource](https://app.deepsource.com/gh/stevengonsalvez/apppop.svg/?label=code+coverage&show_trend=true&token=SA1e3xQfwYIRm8uI4Wuw32hM)](https://app.deepsource.com/gh/stevengonsalvez/apppop/)
[![DeepSource](https://app.deepsource.com/gh/stevengonsalvez/apppop.svg/?label=resolved+issues&show_trend=true&token=SA1e3xQfwYIRm8uI4Wuw32hM)](https://app.deepsource.com/gh/stevengonsalvez/apppop/)

</br>

[![Supabase](https://img.shields.io/badge/Supabase-2.x-green.svg)](https://supabase.io/)
[![Material-UI](https://img.shields.io/badge/MUI-5.x-purple.svg)](https://mui.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-5.x-blue.svg)](https://capacitorjs.com/)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Known Vulnerabilities](https://snyk.io/test/github/dwyl/hapi-auth-jwt2/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dwyl/hapi-auth-jwt2?targetFile=package.json)


A modern, feature-rich React template powered by Material UI and Supabase for building production-ready web and native mobile applications with blazing-fast development speed.

## ✨ Features

### 📱 Cross-Platform
- Build for Web, iOS, and Android from single codebase
- Native device features with Capacitor
- Progressive Web App (PWA) support
- Automated builds with Ionic Cloud

### 🎨 Rich UI Components
- Stories interface (Instagram-style)
- Interactive Timeline view
- Dark mode support
- Responsive navigation (desktop/mobile)
- Profile management
- Custom theme builder

### 🔐 Authentication & Authorization
- Secure Supabase authentication with multiple providers 
- Row Level Security (RLS) policies
- Protected routes and middleware
- Email verification flow
- Profile management

### 🎨 Theme System
- [Customizable themes](docs/theme-system.md) with light/dark mode
- 8+ pre-built color schemes
- CSS-in-JS styling with Emotion
- Responsive layout system
- Custom font schemes

### 📊 Analytics & Monitoring
- [Google Analytics 4 integration](docs/GoogleAnalytics.md)
- [Google Tag Manager setup](docs/gtm-setup.md)
- [Sentry error tracking](docs/monitoring.md)
- [Microsoft Clarity heatmaps](docs/heatmap.md)
- [Cookie consent management](docs/cookieconsent.md)

### 🛠️ Development Tools
- TypeScript for type safety
- Vite for blazing fast builds
- ESLint & Prettier configuration
- Testing setup with Playwright
- CI/CD with Ionic Cloud


## 🚦 Quick Start

The fastest way to get started is using the bootstrapCLI:

```bash
npm install -g @apppop/bootstrap
cd my-app
create-apppop-app
```

## 📱 Native App Development

Build and run native apps:

```bash
cd my-app
# iOS Setup
npm run cap add ios
npm run cap open ios

# Android Setup
npm run cap add android
npm run cap open android

# Build and sync
npm run build
npm run cap sync
```



For detailed setup instructions, check out our [Setup Guide](docs/setup.md).

## 📚 Documentation

- [🔧 Setup Guide](docs/setup.md) - Complete setup instructions
- [🎯 Development Guide](docs/development.md) - Development workflow
- [🎨 Theme System](docs/theme-system.md) - Theme customization
- [📦 Components](docs/components.md) - Available components
- [📊 Analytics Setup](docs/GoogleAnalytics.md) - Analytics integration
- [🔒 Authentication Guide](docs/auth.md) - Auth configuration

## 🏗️ Project Structure

```
├── src/
│   ├── components/     # Reusable components
│   ├── contexts/      # React contexts
│   ├── hooks/        # Custom hooks
│   ├── pages/        # Page components
│   ├── theme/        # Theme configuration
│   ├── types/        # TypeScript types
│   ├── utils/        # Utility functions
│   ├── App.tsx       # Main app component
│   └── index.tsx     # Entry point
├── docs/            # Documentation
├── playwright/      # E2E tests
├── ios/            # iOS native project
├── android/        # Android native project
└── public/         # Static assets
```

## 🧪 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Mobile
npm run cap sync     # Sync native projects
npm run cap open ios # Open iOS project
npm run cap run android # Run on Android

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests
npm run lint         # Run linter
```

## 🔮 Upcoming Features

- 📱 Full native app build and release guide
- 💳 Payment integrations
  - Stripe
  - Atoa
- 📊 Crashlytics integration
- 🗄️ Backend integrations
  - Airtable
  - NocoDB
- 📦 More pre-built components
- 📱 Enhanced native features

## 🤝 Contributing

Contributions are welcome! 

## 📝 License

This project is licensed under the MIT License

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Supabase](https://supabase.io/)
- [Capacitor](https://capacitorjs.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

## 🔗 Links

- [Website](https://apppop.dev)
- [Documentation](https://docs.apppop.dev)
- [GitHub](https://github.com/stevengonsalvez/apppop)
- [npm package](https://www.npmjs.com/package/create-apppop-app)

---