import { readdirSync, readFileSync } from 'node:fs'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'
import { business, categoryIds, siteDescription, siteName } from './app/constants/site'
import { themeScript } from './app/constants/themeScript'
import { readingMinutes } from './app/utils/readingTime'
import { isScheduled, releaseDay } from './app/utils/schedule'

// The canonical origin, the one WordPress served (public/CNAME). NUXT_SITE_URL and
// NUXT_APP_BASE_URL are for building it to serve somewhere else, such as a preview under a path.
const siteUrl = process.env.NUXT_SITE_URL ?? 'https://publicadjusterscharlotte.com'
const baseURL = process.env.NUXT_APP_BASE_URL ?? '/'

/**
 * Every page and post in content/, by URL. The prerender crawler only finds what something links
 * to; these make sure each URL the WordPress site had is built whether linked or not (the
 * thank-you page, which only a form submission reaches, and the category archives). Drafts and
 * scheduled posts are left out:
 * they answer 404, which fails the build.
 */
function contentRoutes(): string[] {
  const pages = readdirSync('content/pages', { recursive: true, encoding: 'utf8' })
    .filter(file => file.endsWith('.md'))
    .map(file => `/${file.replace(/\.md$/, '').replace(/(?:^|\/)index$/, '')}/`.replace(/\/+/g, '/'))
  const posts = readdirSync('content/blog')
    .filter(file => file.endsWith('.md'))
    .filter((file) => {
      const frontmatter = /^---\n([\s\S]*?)\n---/.exec(readFileSync(`content/blog/${file}`, 'utf8'))?.[1] ?? ''
      const date = /^date:\s*(\d{4}-\d{2}-\d{2})\s*$/m.exec(frontmatter)?.[1]
      return !/^draft:\s*true\s*$/m.test(frontmatter) && (date == null || !isScheduled(date))
    })
    .map(file => `/blog/${file.replace(/\.md$/, '')}/`)
  const categories = categoryIds.map(id => `/blog/category/${id}/`)
  return [...pages, ...posts, ...categories]
}

export default defineNuxtConfig({
  // layers/ui, the design system (Avow's tokens, fonts and atoms), is extended automatically:
  // Nuxt registers every directory under layers/. See layers/ui/README.md.

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
    url: siteUrl,
    name: siteName,
    description: siteDescription,
    defaultLocale: 'en',
    // WordPress put a slash at the end of every URL, and GitHub Pages serves /blog/x/index.html
    // at /blog/x/, so every URL keeps it: canonicals, the sitemap and (below) every NuxtLink.
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

  css: ['~/assets/css/main.css', '~/assets/css/brand.css', '~/assets/css/prose.css'],

  // Components go by their file name (PostCard, not MoleculesPostCard), as in Avow.
  components: [
    // The components a post's Markdown can use (::post-photo, ::post-steps): Nuxt Content
    // resolves them by name at render time, so they are registered globally.
    { path: '~/components/content', pathPrefix: false, global: true },
    { path: '~/components', pathPrefix: false },
  ],

  // Photos are resized and re-encoded at build time (ipx) into AVIF and WebP at the widths a
  // page asks for; the page ships a <picture> of static files.
  image: {
    quality: 70,
    format: ['avif', 'webp'],
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

  // content.config.ts and vitest.config.ts run in Node like this file, so they type-check with it.
  typescript: {
    nodeTsConfig: {
      include: ['../content.config.ts', '../vitest.config.ts'],
    },
  },

  compatibilityDate: '2026-01-01',

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      // The crawler starts at these; the sitemap, robots and llms modules add their own files.
      routes: contentRoutes(),
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

  // The business behind every page, as the old site's LocalBusiness markup had it: local search
  // reads the name, address, phone and hours from here.
  schemaOrg: {
    identity: {
      type: 'LocalBusiness',
      name: business.name,
      alternateName: business.shortName,
      description: business.description,
      url: siteUrl,
      logo: business.logo,
      image: business.image,
      telephone: business.phone,
      email: business.email,
      priceRange: '$$',
      address: {
        streetAddress: business.address.street,
        addressLocality: business.address.city,
        addressRegion: business.address.region,
        postalCode: business.address.postalCode,
        addressCountry: business.address.country,
      },
      geo: business.geo,
      openingHoursSpecification: [{
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      }],
      areaServed: ['Charlotte', 'Huntersville', 'Concord', 'Gastonia', 'Monroe', 'Matthews'].map(name => ({ '@type': 'City', 'name': `${name}, NC` })),
      sameAs: [...business.sameAs],
    },
  },

  // The sitemap is written at prerender time and nothing serves it live.
  sitemap: {
    zeroRuntime: true,
  },

  ogImage: {
    zeroRuntime: true,
    // Satori cannot read woff2, hence the woff copies in public/og-fonts. They live in the
    // app's public/ and not the layer's: while prerendering, nuxt-og-image reads fonts from
    // there only, and anything else 404s and quietly falls back to Inter.
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
    compatibility: {
      dev: { sharp: false },
      prerender: { sharp: false },
      runtime: { sharp: false },
    },
  },

  llms: {
    // llms.txt links are the content paths, which do not carry the base.
    domain: `${siteUrl}${baseURL}`.replace(/\/$/, ''),
    title: siteName,
    description: siteDescription,
    full: {
      title: siteName,
      description: 'Every page and published post on publicadjusterscharlotte.com in full.',
    },
    sections: [
      {
        title: 'Pages',
        contentCollection: 'pages',
        contentFilters: [
          { field: 'noindex', operator: '=', value: false },
        ],
      },
      {
        title: 'Posts',
        contentCollection: 'blog',
        contentFilters: [
          { field: 'draft', operator: '=', value: false },
          { field: 'date', operator: '<=', value: releaseDay() },
        ],
      },
    ],
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
})
