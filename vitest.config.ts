import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

/*
 * The built site, read as a crawler reads it: sites/<name>/.output/public after `nuxi generate`.
 * The global setup builds it first unless SITE_BUILD=skip (CI builds once and tests that).
 */
function siteProject(site: string) {
  return {
    extends: true,
    test: {
      name: `site-${site}`,
      include: ['test/site/**/*.spec.ts'],
      environment: 'happy-dom',
      env: { SITE: site },
      globalSetup: ['test/setup/buildSite.ts'],
      testTimeout: 20_000,
    },
  } as const
}

export default defineConfig({
  resolve: {
    alias: {
      '~': `${rootDir}layers/melo/app`,
      '@': `${rootDir}layers/melo/app`,
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
      siteProject('charlotte'),
      siteProject('national'),
    ],
  },
})
