import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~': `${rootDir}app`,
      '@': `${rootDir}app`,
      '~~': rootDir,
    },
  },
  test: {
    globals: true,
    restoreMocks: true,
    unstubGlobals: true,
    projects: [
      // Pure functions, no Nuxt and no DOM.
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['test/unit/**/*.spec.ts'],
          environment: 'node',
        },
      },
      // The built site, read as a crawler reads it: .output/public after `nuxi generate`. The
      // global setup builds it first unless SITE_BUILD=skip (CI builds once and tests that).
      {
        extends: true,
        test: {
          name: 'site',
          include: ['test/site/**/*.spec.ts'],
          environment: 'happy-dom',
          globalSetup: ['test/setup/buildSite.ts'],
          testTimeout: 20_000,
        },
      },
    ],
  },
})
