import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { publicDir } from './site'

// GitHub Pages answers /blog/x/ with blog/x/index.html. A blog/x.html beside a blog/x/
// directory is ambiguous there, so every page is an index.html in its own directory.
describe('the output', () => {
  it('has no page outside an index.html but the 404 and SPA fallbacks', () => {
    const strays = readdirSync(publicDir, { recursive: true, encoding: 'utf8' })
      .filter(path => path.endsWith('.html') && !path.endsWith('index.html'))
      .map(path => join(publicDir, path))
    expect(strays.sort()).toEqual([join(publicDir, '200.html'), join(publicDir, '404.html')])
  })
})

// IndexNow fetches https://<host>/<key>.txt and expects the key back (scripts/indexnow.mjs).
describe('the IndexNow key', () => {
  it('is served at the root, holding its own name', () => {
    const keys = readdirSync(publicDir).filter(name => /^[\da-f]{32}\.txt$/.test(name))
    expect(keys).toHaveLength(1)
    expect(readFileSync(join(publicDir, keys[0]!), 'utf8')).toBe(keys[0]!.replace(/\.txt$/, ''))
  })
})
