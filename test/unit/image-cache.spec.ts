import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { cacheSignature, imageSource, restoreImages, saveImages } from '../../layers/melo/image-cache'

let repo: string
let site: string
let output: string
const route = '/_ipx/f_avif&q_70&s_480x360/images/photo.jpg'

function put(path: string, contents: string): void {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, contents)
}

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'melo-image-test-'))
  site = join(repo, 'sites/charlotte')
  output = join(site, '.output/public')
  put(join(repo, 'pnpm-lock.yaml'), 'encoder version')
  put(join(repo, 'layers/melo/nuxt.config.ts'), 'defineNuxtConfig({ image: { quality: 70 }, modules: [] })')
  put(join(repo, 'layers/melo/site-config.ts'), 'site config')
  put(join(site, 'nuxt.config.ts'), 'extends shared layer')
  put(join(site, 'public/images/photo.jpg'), 'original photo')
  put(join(output, 'images/photo.jpg'), 'original photo')
  put(join(output, route.slice(1)), 'encoded photo')
})

afterEach(() => rmSync(repo, { recursive: true, force: true }))

it('reuses byte-identical encodes with matching source inputs', () => {
  expect(saveImages(site, output)).toBe(1)
  const cached = restoreImages(site)
  expect(cached.routes.has(route)).toBe(true)
  expect(readFileSync(join(cached.dir, route.slice(1)), 'utf8')).toBe('encoded photo')
})

it('regenerates an image when its source changes at the same URL', () => {
  saveImages(site, output)
  put(join(site, 'public/images/photo.jpg'), 'replacement photo')
  expect(restoreImages(site).routes.size).toBe(0)
})

it('does not publish corrupted cached bytes', () => {
  saveImages(site, output)
  put(join(site, '.image-cache/public', route.slice(1)), 'damaged bytes')
  expect(restoreImages(site).routes.size).toBe(0)
})

it('invalidates encoder changes and retains encodes through unrelated config changes', () => {
  saveImages(site, output)
  const signature = cacheSignature(site)
  put(join(repo, 'layers/melo/nuxt.config.ts'), 'defineNuxtConfig({ image: { quality: 70 }, modules: [newModule] })')
  expect(cacheSignature(site)).toBe(signature)
  expect(restoreImages(site).routes.size).toBe(1)
  put(join(repo, 'layers/melo/nuxt.config.ts'), 'defineNuxtConfig({ image: { quality: 60 }, modules: [newModule] })')
  expect(restoreImages(site).routes.size).toBe(0)
})

it('does not seed images from a baseline with different original bytes', () => {
  put(join(output, 'images/photo.jpg'), 'older photo')
  expect(saveImages(site, output)).toBe(0)
})

it('rejects remote sources and directory traversal', () => {
  expect(imageSource('/_ipx/f_avif/https://example.com/photo.jpg')).toBeUndefined()
  expect(imageSource('/_ipx/f_avif/%2e%2e/private.jpg')).toBeUndefined()
  expect(imageSource('/_ipx/f_avif/..%5cprivate.jpg')).toBeUndefined()
})
