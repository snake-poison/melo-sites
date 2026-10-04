import { defineCollection, defineContentConfig } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
import { z } from 'zod'

/*
 * The site moved from WordPress, and every page and post keeps the URL it had there. The schema
 * is the SEO contract: a page without its title tag, a description or a date fails the build,
 * not the search result.
 */

/** A photo: a path under public/. WordPress uploads keep their /wp-content/uploads/ paths. */
const image = z.object({
  src: z.string().startsWith('/'),
  alt: z.string().default(''),
  caption: z.string().optional(),
  credit: z.string().optional(),
  creditUrl: z.url().optional(),
})

/** What every page and post carries for search results. */
const seo = {
  // The <title>, word for word. WordPress (Yoast) set one per page and rankings were earned
  // with it, so it is kept apart from the on-page heading (`title`). Some of the national
  // site's run to 94 characters; they are kept as they ranked.
  metaTitle: z.string().min(10).max(100),
  // Search results cut a description at about 155 characters.
  description: z.string().min(50).max(160),
  date: z.date(),
  updated: z.date().optional(),
}

/**
 * A Melo site's collections. Each site's content.config.ts is
 *
 *   export default meloContent(categoryIds)
 *
 * with the blog categories from its site.ts.
 */
export function meloContent(categoryIds: readonly [string, ...string[]]) {
  /*
   * Posts live in content/blog/<slug>.md and render at /blog/<slug>/, the permalink WordPress used.
   */
  const blog = defineCollection({
    type: 'page',
    source: 'blog/**/*.md',
    schema: z.object({
      ...seo,
      // The WordPress category, which has an archive at /blog/category/<id>/.
      category: z.enum(categoryIds),
      draft: z.boolean().default(false),
      // The lead photo, shown under the title, on the post's card and as its share image.
      image: image.optional(),
      // The answer in two or three sentences, shown above the body.
      summary: z.string().optional(),
      // Rendered as a FAQ section and as schema.org FAQPage.
      faq: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })).default([]),
      // Set at build time from the body (nuxt.config.ts, content:file:afterParse).
      readingTime: z.number().default(1),
      // Drafts and scheduled posts never reach the sitemap. The sitemap module copies this
      // callback into the server bundle as source, so it cannot import isScheduled() from
      // app/utils/schedule.ts: it repeats it, and the site tests check the two agree.
      sitemap: defineSitemapSchema({
        z,
        name: 'blog',
        filter: (entry) => {
          const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
          return entry.draft !== true && new Date(String(entry.date)).toISOString().slice(0, 10) <= today
        },
      }),
    }),
  })

  /*
   * The site's pages: content/pages/<path>.md renders at /<path>/, and content/pages/<path>/index.md
   * at /<path>/ when other pages sit under it. The home page is content/pages/index.md.
   */
  const pages = defineCollection({
    type: 'page',
    source: { include: 'pages/**/*.md', prefix: '/' },
    schema: z.object({
      ...seo,
      // Over the h1 in the hero, small and spaced.
      kicker: z.string().optional(),
      // Under the h1 in the hero.
      lead: z.string().optional(),
      // The hero's background photo.
      image: image.optional(),
      // Kept out of search results and the sitemap, as WordPress had them (the thank-you page).
      noindex: z.boolean().default(false),
      // The blocks every service page shares, after its own body (app/components/organisms).
      testimonial: z.boolean().default(false),
      claimForm: z.boolean().default(false),
      claimTypes: z.boolean().default(false),
      // The claim-types block's own heading and intro on this page, where the old page had them.
      // The intro's one Markdown link, [text](/path/), is kept as a link.
      claimTypesIntro: z.object({ title: z.string(), text: z.string() }).optional(),
      // The adjuster services (site.ts) in the claim types' place, as the adjuster pages had them.
      services: z.boolean().default(false),
      secondOpinion: z.boolean().default(false),
      sitemap: defineSitemapSchema({
        z,
        name: 'pages',
        filter: entry => entry.noindex !== true,
      }),
    }),
  })

  return defineContentConfig({
    collections: { blog, pages },
  })
}
