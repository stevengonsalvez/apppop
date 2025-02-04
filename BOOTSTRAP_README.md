# AppPop Template Bootstrap

This bootstrap script helps you quickly set up a new project based on the AppPop template. It automates the setup process and guides you through the necessary configurations.

## Prerequisites

Before running the bootstrap script, ensure you have the following installed:
- Node.js (version >= 18.0.0)
- npm (comes with Node.js)
- Git

## Installation & Usage

You can use this bootstrap script in two ways:

### 1. Using npx (recommended)

```bash
npx create-apppop
```

### 2. Local Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

3. Run the script:
```bash
npm start
```

## What the Script Does

The bootstrap script will:

1. **Project Setup**
   - Create a new directory for your project
   - Initialize a Git repository

2. **Supabase Configuration**
   - Guide you through setting up a Supabase project
   - Configure environment variables for Supabase

3. **Dependencies**
   - Install all required npm packages
   - Set up development tools and configurations

4. **Development Environment**
   - Configure Supabase CLI for local development
   - Set up initial environment variables

## Post-Setup Configuration

After setup, you'll need to:

1. Configure additional services (optional):
   - Stripe for payments
   - Microsoft Clarity for analytics
   - Sentry for error monitoring
   - Google Tag Manager
   - Google Analytics 4

2. Update your project's package.json with specific details

3. Review and customize the template code

## Available Scripts in Generated Project

After setup, you can use these npm scripts in your new project:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run supabase:start` - Start Supabase local development
- `npm run lint` - Run linter
- `npm run lint:fix` - Fix linting issues

## Support

If you encounter any issues during setup, please:
1. Check that all prerequisites are installed
2. Ensure you have the necessary permissions
3. Review the error messages in the console
4. Make sure you're using Node.js version 18 or higher

## License

This template is licensed under the MIT License. See the LICENSE file for details. 
