import { existsSync, readFileSync } from 'node:fs'
import { draftFixture, fileFor, hasType, publicDir, readPage, scheduledFixture, schemaNodes, siteUrl, sourcePosts } from './site'

const posts = sourcePosts()
const published = posts.filter(post => post.published)
const sitemap = readFileSync(`${publicDir}/sitemap.xml`, 'utf8')
const llms = readFileSync(`${publicDir}/llms.txt`, 'utf8')
const llmsFull = readFileSync(`${publicDir}/llms-full.txt`, 'utf8')

describe('a published post', () => {
  it.each(published)('$path is built, listed in the sitemap and in llms.txt', ({ path, slug }) => {
    expect(fileFor(path)).toBeDefined()
    expect(sitemap).toContain(`<loc>${siteUrl}${path}</loc>`)
    expect(llms).toContain(`${siteUrl}/raw/blog/${slug}.md`)
    expect(existsSync(`${publicDir}/raw/blog/${slug}.md`)).toBe(true)
  })

  it.each(published)('$path describes itself to search and answer engines', ({ path, hasFaq }) => {
    const doc = readPage(fileFor(path)!)
    const nodes = schemaNodes(doc)

    const article = nodes.find(node => hasType(node, 'BlogPosting'))
    expect(article).toMatchObject({
      headline: doc.querySelector('h1')?.textContent?.trim(),
      datePublished: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      dateModified: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      author: expect.anything(),
      publisher: expect.anything(),
    })
    expect(nodes.some(node => hasType(node, 'BreadcrumbList'))).toBe(true)
    expect(nodes.some(node => hasType(node, 'FAQPage'))).toBe(hasFaq)
    expect(doc.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('article')
    expect(doc.querySelector('meta[property="article:published_time"]')).not.toBeNull()
  })
})

describe('a draft or a post scheduled for a later day', () => {
  it.each([...posts.filter(post => !post.published), draftFixture, scheduledFixture])('$slug is not built, listed or quoted anywhere', ({ path, slug }) => {
    expect(fileFor(path)).toBeUndefined()
    expect(sitemap).not.toContain(path)
    expect(llms).not.toContain(slug)
    expect(llmsFull).not.toContain(slug)
    expect(existsSync(`${publicDir}/raw/blog/${slug}.md`)).toBe(false)
  })
})
