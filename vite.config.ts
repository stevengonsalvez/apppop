import { sentryVitePlugin } from "@sentry/vite-plugin";
/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Get plugins based on environment
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

export default defineConfig({
  plugins: getPlugins(),
  build: {
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})