import { sentryVitePlugin } from "@sentry/vite-plugin";
/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), legacy(), sentryVitePlugin({
    org: "apppop",
    project: "javascript-react"
  })],
  build: {
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})