import { existsSync, readFileSync } from 'node:fs'
import { fileFor, isNoindex, pages, publicDir, readPage, siteUrl, wordpressPages } from './site'

const all = pages()

describe('every page WordPress had', () => {
  it.each(wordpressPages)('$path is built, at the same URL, under the same title', ({ path, title }) => {
    const file = fileFor(path)
    expect(file).toBeDefined()
    expect(readPage(file!).title).toBe(title)
  })
})

describe('every page', () => {
  describe.each(all)('$path', ({ path, file }) => {
    const doc = readPage(file)
    function meta(selector: string) {
      return doc.querySelector(selector)?.getAttribute('content') ?? ''
    }

    it('has a title, and a description search results can show whole', () => {
      expect(doc.title.length).toBeGreaterThan(0)
      expect(meta('meta[name="description"]').length).toBeGreaterThanOrEqual(50)
      expect(meta('meta[name="description"]').length).toBeLessThanOrEqual(160)
      expect(doc.documentElement.getAttribute('lang')).toBe('en')
    })

    it('names its own URL as canonical, and og:url agrees', () => {
      const expected = `${siteUrl}${path}`
      expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(expected)
      expect(meta('meta[property="og:url"]')).toBe(expected)
    })

    it('has exactly one h1', () => {
      expect(doc.querySelectorAll('h1')).toHaveLength(1)
    })

    it('has a share image that was built', () => {
      const image = meta('meta[property="og:image"]')
      expect(image.startsWith(`${siteUrl}/`)).toBe(true)
      expect(fileFor(image.slice(siteUrl.length))).toBeDefined()
      expect(meta('meta[property="og:image:width"]')).toBe('1200')
      expect(meta('meta[property="og:image:height"]')).toBe('630')
    })

    it('links only to pages and files that exist, by the URL they are served at', () => {
      const hrefs = [...doc.querySelectorAll('a[href]')]
        .map(a => a.getAttribute('href') ?? '')
        .filter(href => href.startsWith('/'))
      for (const href of hrefs)
        expect(fileFor(href), `${path} links to ${href}`).toBeDefined()
    })
  })
})

describe('robots.txt', () => {
  it('lets every crawler in, AI crawlers included, and points at the sitemap', () => {
    const robots = readFileSync(`${publicDir}/robots.txt`, 'utf8')
    expect(robots).toMatch(/User-agent: \*\nDisallow:\s*\n/)
    expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`)
  })
})

describe('sitemap.xml', () => {
  it('lists every built page search engines may index, and only those', () => {
    const sitemap = readFileSync(`${publicDir}/sitemap.xml`, 'utf8')
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]!.slice(siteUrl.length) || '/')
    const indexable = all.filter(page => !isNoindex(readPage(page.file))).map(page => page.path)
    expect(locs.sort()).toEqual(indexable.sort())
  })

  // Search Console has WordPress's sitemap_index.xml on file; it now points at the one sitemap.
  it('is what the old sitemap index points at', () => {
    const index = readFileSync(`${publicDir}/sitemap_index.xml`, 'utf8')
    expect(index).toContain(`<loc>${siteUrl}/sitemap.xml</loc>`)
  })
})

// Cloudflare Pages answers the old URLs a site lists in public/_redirects with a 301 to new ones.
const redirectsFile = `${publicDir}/_redirects`
const redirects = existsSync(redirectsFile)
  ? readFileSync(redirectsFile, 'utf8').split('\n').filter(line => line.trim() !== '' && !line.startsWith('#')).map(line => line.split(/\s+/))
  : []

describe.skipIf(redirects.length === 0)('_redirects', () => {
  it.each(redirects)('%s goes to a built page', (from, to, status) => {
    expect(status).toBe('301')
    expect(fileFor(from!), `${from} is a page of its own`).toBeUndefined()
    expect(fileFor(to!), `${from} goes to ${to}`).toBeDefined()
  })
})
