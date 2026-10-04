import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'
import { isScheduled } from '../../layers/melo/app/utils/schedule'

/** The site under test: sites/<name>, set per project in vitest.config.ts. */
export const site = process.env.SITE ?? 'charlotte'
const siteUrls: Record<string, string> = {
  charlotte: 'https://publicadjusterscharlotte.com',
  national: 'https://melopropertyclaimsadjusting.com',
}

export const siteDir = `sites/${site}`
export const publicDir = `${siteDir}/.output/public`
export const siteUrl = siteUrls[site]!

/**
 * A draft post the test build adds to the site's content/blog (test/setup/buildSite.ts), so the
 * specs can check a draft never ships without the blog keeping one in its content.
 */
export const draftFixture = {
  slug: 'test-draft-fixture',
  path: '/blog/test-draft-fixture/',
}

/** A post dated in the future, added the same way, so the specs can check it waits for its day. */
export const scheduledFixture = {
  slug: 'test-scheduled-fixture',
  path: '/blog/test-scheduled-fixture/',
}

/** Every page a reader can land on, by URL path (`/blog/x/`), with its built file. */
export function pages(): Array<{ path: string, file: string }> {
  const found: Array<{ path: string, file: string }> = []
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('_'))
          walk(full)
      }
      else if (entry.name === 'index.html') {
        found.push({ path: `/${relative(publicDir, dir)}/`.replace('//', '/'), file: full })
      }
    }
  }
  walk(publicDir)
  return found.sort((a, b) => a.path.localeCompare(b.path))
}

export function readPage(file: string): Document {
  return new DOMParser().parseFromString(readFileSync(file, 'utf8'), 'text/html') as unknown as Document
}

/**
 * The file the host answers a path with, without a redirect, or undefined. A page path without
 * its trailing slash counts as missing: Cloudflare Pages answers it with a 308.
 */
export function fileFor(path: string): string | undefined {
  const clean = path.replace(/[?#].*$/, '')
  const file = clean.endsWith('/') ? join(publicDir, clean, 'index.html') : join(publicDir, clean)
  return existsSync(file) && statSync(file).isFile() ? file : undefined
}

export interface SourcePost {
  slug: string
  path: string
  draft: boolean
  /** Dated after today, so left out of the build until its day. */
  scheduled: boolean
  /** Neither a draft nor scheduled: what the built site should carry. */
  published: boolean
  hasFaq: boolean
}

/** The posts under the site's content/blog, from their frontmatter, independent of the build. */
export function sourcePosts(): SourcePost[] {
  const blog = `${siteDir}/content/blog`
  return readdirSync(blog)
    .filter(name => name.endsWith('.md'))
    .map((name) => {
      const frontmatter = /^---\n([\s\S]*?)\n---/.exec(readFileSync(join(blog, name), 'utf8'))?.[1] ?? ''
      const slug = name.replace(/\.md$/, '')
      const draft = /^draft:\s*true\s*$/m.test(frontmatter)
      const date = /^date:\s*(\d{4}-\d{2}-\d{2})\s*$/m.exec(frontmatter)?.[1]
      const scheduled = date != null && isScheduled(date)
      return {
        slug,
        path: `/blog/${slug}/`,
        draft,
        scheduled,
        published: !draft && !scheduled,
        hasFaq: /^faq:\s*$/m.test(frontmatter),
      }
    })
}

/**
 * Every URL the WordPress site's sitemap listed, and its category archives, with the title Yoast
 * gave it: what search engines have indexed, so the URLs the new site must answer, under the
 * same title. The three "test project" placeholders WordPress listed are left out on purpose.
 */
export const wordpressPages = JSON.parse(readFileSync(`test/fixtures/${site}/wordpress-pages.json`, 'utf8')) as Array<{ path: string, title: string }>

/** Kept out of search results: a robots meta of noindex. */
export function isNoindex(doc: Document): boolean {
  return /noindex/.test(doc.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '')
}

/** The schema.org nodes in a page's JSON-LD graph. */
export function schemaNodes(doc: Document): Array<Record<string, unknown>> {
  return [...doc.querySelectorAll('script[type="application/ld+json"]')]
    .flatMap((script) => {
      const json = JSON.parse(script.textContent ?? '{}') as { '@graph'?: Array<Record<string, unknown>> }
      return json['@graph'] ?? [json]
    })
}

export function hasType(node: Record<string, unknown>, type: string): boolean {
  const types = node['@type']
  return Array.isArray(types) ? types.includes(type) : types === type
}
