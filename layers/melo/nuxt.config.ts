import process from 'node:process'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
import { themeScript } from './app/constants/themeScript'
import { readingMinutes } from './app/utils/readingTime'

/*
 * What every Melo site shares: the modules, the static build, the design and the components.
 * Each site (sites/<name>/nuxt.config.ts) extends this layer and adds who it is with meloSite()
 * (./site-config.ts): its URL, business, routes and its site.ts, which the layer's code imports
 * as #site.
 */
const baseURL = process.env.NUXT_APP_BASE_URL ?? '/'
/** A path inside this layer. `~` in a layer's config is the app's srcDir, not the layer's. */
function here(path: string): string {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineNuxtConfig({
  // Avow's design system: tokens, fonts and atoms. See layers/ui/README.md.
  extends: ['../ui'],

  // Nuxt names only the layers it finds in an app's own layers/ directory; the sites extend
  // this one by path, so the design system's name is given here.
  alias: { '#layers/ui': here('../ui') },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
    'nuxt-llms',
    '@nuxt/eslint',
    // Satori is slow to start and nothing in a test reads a share card.
    ...(process.env.VITEST == null ? ['nuxt-og-image'] : []),
  ],

  devtools: { enabled: true },

  site: {
    defaultLocale: 'en',
    // WordPress put a slash at the end of every URL, and the host serves /blog/x/index.html at
    // /blog/x/, so every URL keeps it: canonicals, the sitemap and (below) every NuxtLink.
    trailingSlash: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        { rel: 'icon', href: `${baseURL}favicon.ico`, sizes: 'any' },
        { rel: 'icon', type: 'image/png', href: `${baseURL}favicon-32x32.png`, sizes: '32x32' },
        { rel: 'apple-touch-icon', href: `${baseURL}apple-touch-icon.png` },
        // No font preloads: fonts.css says why.
      ],
      script: [
        // The theme: first frame and toggle (app/constants/themeScript.ts).
        { innerHTML: `(${themeScript.toString()})()`, tagPriority: 'critical' },
      ],
    },
  },

  // Every page is prerendered HTML and CSS with no Nuxt runtime: about 100 KB of compressed
  // JS (Vue, the router, the content client) that a page of text never needed. Links are
  // plain page loads, which for a 14 KB page cost less than the runtime did. Drop this rule
  // for a route that gains an interactive component.
  routeRules: {
    '/**': { noScripts: true },
    // WordPress's category archives, kept at their URLs for anyone who links to them, and out of
    // search results and the sitemap as Yoast had them.
    '/blog/category/**': { robots: 'noindex, follow' },
  },

  css: [here('./app/assets/css/main.css'), here('./app/assets/css/brand.css'), here('./app/assets/css/prose.css'), here('./app/assets/css/claim-intake.css')],

  // Components go by their file name (PostCard, not MoleculesPostCard), as in Avow.
  components: [
    // The components a page's Markdown can use (::page-section, ::post-steps): Nuxt Content
    // resolves them by name at render time, so they are registered globally.
    { path: here('./app/components/content'), pathPrefix: false, global: true },
    { path: here('./app/components'), pathPrefix: false },
  ],

  // Photos are resized and re-encoded at build time (ipx) into AVIF and WebP at the widths a
  // page asks for; the page ships a <picture> of static files.
  image: {
    quality: 70,
    format: ['avif', 'webp'],
    // Tailwind's breakpoints, which @nuxt/image 2 uses, plus `xs` for phones: without it a
    // component's `xs:100vw` was dropped and phones were sent the desktop width.
    screens: { 'xs': 400, 'sm': 640, 'md': 768, 'lg': 1024, 'xl': 1280, '2xl': 1536 },
  },

  content: {
    // Node 24's built-in node:sqlite for the build database, so there is no native module to compile.
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: {
          theme: { default: 'github-light', dark: 'github-dark' },
          langs: ['json', 'js', 'ts', 'bash', 'yaml', 'md'],
        },
        toc: { depth: 3 },
      },
    },
  },

  // Inline the page's CSS in its HTML: one request fewer before first paint.
  features: { inlineStyles: true },

  experimental: {
    typedPages: true,
    // 'client' keeps full-static output happy; pages have no runtime (routeRules), so
    // nothing reads the payload and the HTML is unchanged.
    payloadExtraction: 'client',
    defaults: {
      nuxtLink: { trailingSlash: 'append' },
    },
  },

  // layers/ui points TypeScript at its files from a root app's .nuxt/; the sites build from
  // sites/<name>/.nuxt/, two levels further down, so the same paths again from there.
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '~/constants/tones': ['../../../layers/ui/app/constants/tones'],
          '~/constants/icons': ['../../../layers/ui/app/constants/icons'],
          '@/constants/icons': ['../../../layers/ui/app/constants/icons'],
          '~/types/ui/uiTypes': ['../../../layers/ui/app/types/ui/uiTypes'],
        },
      },
    },
  },

  compatibilityDate: '2026-01-01',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
    },
    compressPublicAssets: false,
    rollupConfig: {
      onwarn(warning, defaultHandler) {
        // This replaces Nitro's own filter, so keep its two codes quiet as well.
        if (warning.code === 'CIRCULAR_DEPENDENCY' || warning.code === 'EVAL') {
          return
        }
        // @nuxt/nitro-server's h3.mjs imports cookie helpers it never uses; nothing here to fix.
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT' && warning.ids?.some(id => id.includes('@nuxt+nitro-server'))) {
          return
        }
        defaultHandler(warning)
      },
    },
  },

  vite: {
    plugins: [tailwindcss() as unknown as never],
    build: {
      target: 'esnext',
      cssMinify: 'esbuild',
    },
  },

  hooks: {
    'content:file:afterParse': function (ctx) {
      if (ctx.collection.name === 'blog' && typeof ctx.file.body === 'string') {
        ctx.content.readingTime = readingMinutes(ctx.file.body)
      }
    },
  },

  // Light unless the reader picks dark (app/constants/themeScript.ts does the picking).
  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
  },

  // The sitemap is written at prerender time and nothing serves it live.
  sitemap: {
    zeroRuntime: true,
  },

  ogImage: {
    zeroRuntime: true,
    // Satori cannot read woff2, hence the woff copies in each site's public/og-fonts. They live
    // in the site's public/ and not a layer's: while prerendering, nuxt-og-image reads fonts
    // from there only, and anything else 404s and quietly falls back to Inter.
    defaults: {
      // The size every platform's large card expects.
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Archivo Narrow', weight: 700, path: '/og-fonts/archivo-narrow-700.woff' },
        { name: 'IBM Plex Mono', weight: 500, path: '/og-fonts/ibm-plex-mono-500.woff' },
        { name: 'IBM Plex Mono', weight: 600, path: '/og-fonts/ibm-plex-mono-600.woff' },
      ],
    },
    // The cards render once, at build time, alongside the photo resizing; on a busy machine
    // one can take longer than the 15 s default, and a timeout fails the build.
    security: { renderTimeout: 120_000 },
    compatibility: {
      dev: { sharp: false },
      prerender: { sharp: false },
      runtime: { sharp: false },
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})
