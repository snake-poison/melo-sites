import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import type { NuxtConfig } from 'nuxt/schema'
import { isScheduled, releaseDay } from './app/utils/schedule'

/** What meloSite() reads from a site's site.ts. */
export interface SiteModule {
  siteUrl: string
  siteName: string
  siteDescription: string
  categoryIds: readonly string[]
  business: {
    name: string
    shortName: string
    description: string
    phone: string
    email: string
    logo: string
    image: string
    address: { street: string, city: string, region: string, postalCode: string, country: string }
    geo: { latitude: number, longitude: number }
    areaServed: ReadonlyArray<{ '@type': string, 'name': string }>
    sameAs: readonly string[]
  }
}

/**
 * The part of a site's Nuxt config that says which site it is, from its directory and its
 * site.ts. In sites/<name>/nuxt.config.ts:
 *
 *   import * as site from './site'
 *   export default defineNuxtConfig({ extends: ['../../layers/melo'], ...meloSite(import.meta.url, site) })
 *
 * NUXT_SITE_URL and NUXT_APP_BASE_URL build it to serve somewhere else, such as a preview.
 */
export function meloSite(configUrl: string, site: SiteModule): NuxtConfig {
  const dir = fileURLToPath(new URL('.', configUrl))
  const siteUrl = process.env.NUXT_SITE_URL ?? site.siteUrl
  const baseURL = process.env.NUXT_APP_BASE_URL ?? '/'
  const { business } = site

  return {
    // The layer's code imports the site's details from here.
    alias: { '#site': join(dir, 'site.ts') },

    site: {
      url: siteUrl,
      name: site.siteName,
      description: site.siteDescription,
    },

    nitro: {
      // The crawler starts at these; the sitemap, robots and llms modules add their own files.
      prerender: { routes: contentRoutes(dir, site.categoryIds) },
    },

    // These run in Node like nuxt.config.ts, so they type-check with it. Relative to .nuxt/.
    typescript: {
      nodeTsConfig: {
        include: ['../content.config.ts', '../../../layers/melo/*.ts', '../../../vitest.config.ts'],
      },
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
        areaServed: [...business.areaServed],
        sameAs: [...business.sameAs],
      },
    },

    llms: {
      // llms.txt links are the content paths, which do not carry the base.
      domain: `${siteUrl}${baseURL}`.replace(/\/$/, ''),
      title: site.siteName,
      description: site.siteDescription,
      full: {
        title: site.siteName,
        description: `Every page and published post on ${new URL(site.siteUrl).host} in full.`,
      },
      sections: [
        {
          title: 'Pages',
          contentCollection: 'pages',
          // Filter values are typed as strings; SQLite reads '0' in a boolean column as false.
          contentFilters: [
            { field: 'noindex', operator: '=', value: '0' },
          ],
        },
        {
          title: 'Posts',
          contentCollection: 'blog',
          contentFilters: [
            { field: 'draft', operator: '=', value: '0' },
            { field: 'date', operator: '<=', value: releaseDay() },
          ],
        },
      ],
    },
  }
}

/**
 * Every page and post in the site's content/, by URL. The prerender crawler only finds what
 * something links to; these make sure each URL the WordPress site had is built whether linked or
 * not (the thank-you page, which only a form submission reaches, and the category archives).
 * Drafts and scheduled posts are left out: they answer 404, which fails the build.
 *
 * With them, the Markdown copy of each page and post that llms.txt links to (/raw/<path>.md).
 * Nuxt Content queues those itself only when llms.txt happens to render before the home page.
 */
function contentRoutes(dir: string, categoryIds: readonly string[]): string[] {
  function frontmatter(file: string): string {
    return /^---\n([\s\S]*?)\n---/.exec(readFileSync(join(dir, 'content', file), 'utf8'))?.[1] ?? ''
  }
  const pages = readdirSync(join(dir, 'content/pages'), { recursive: true, encoding: 'utf8' })
    .filter(file => file.endsWith('.md'))
    .map(file => ({
      path: `/${file.replace(/\.md$/, '').replace(/(?:^|\/)index$/, '')}`.replace(/\/+$/, '') || '/',
      noindex: /^noindex:\s*true\s*$/m.test(frontmatter(`pages/${file}`)),
    }))
  const posts = readdirSync(join(dir, 'content/blog'))
    .filter(file => file.endsWith('.md'))
    .filter((file) => {
      const fields = frontmatter(`blog/${file}`)
      const date = /^date:\s*(\d{4}-\d{2}-\d{2})\s*$/m.exec(fields)?.[1]
      return !/^draft:\s*true\s*$/m.test(fields) && (date == null || !isScheduled(date))
    })
    .map(file => `/blog/${file.replace(/\.md$/, '')}`)
  const categories = categoryIds.map(id => `/blog/category/${id}/`)
  return [
    ...pages.map(page => page.path === '/' ? '/' : `${page.path}/`),
    ...posts.map(post => `${post}/`),
    ...categories,
    // As llms.txt lists them: pages search engines may index, and published posts.
    ...pages.filter(page => !page.noindex).map(page => `/raw${page.path === '/' ? '/index' : page.path}.md`),
    ...posts.map(post => `/raw${post}.md`),
  ]
}
