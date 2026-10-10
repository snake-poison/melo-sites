import type { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import ts from 'typescript'
import { z } from 'zod'

const manifestSchema = z.object({
  signature: z.string(),
  images: z.record(z.string(), z.object({ source: z.string(), sourceHash: z.string(), outputHash: z.string() })),
})
type ImageManifest = z.infer<typeof manifestSchema>

export function digest(data: Buffer | string): string {
  return createHash('sha256').update(data).digest('hex')
}

// Only the image settings matter here; adding another module or changing HTML must not
// discard thousands of otherwise identical image encodes.
function imageSettings(source: string): string {
  const file = ts.createSourceFile('nuxt.config.ts', source, ts.ScriptTarget.Latest, true)
  let settings: string | undefined
  function visit(node: ts.Node): void {
    if (ts.isPropertyAssignment(node) && node.name.getText(file) === 'image')
      settings = node.initializer.getText(file)
    ts.forEachChild(node, visit)
  }
  visit(file)
  return settings ?? source
}

export const signatureFiles = ['pnpm-lock.yaml', 'layers/melo/nuxt.config.ts', 'layers/melo/site-config.ts'] as const

export function imageSignature(inputs: Record<string, string>): string {
  return digest(`melo-images-v1:${JSON.stringify(Object.entries(inputs).sort(([a], [b]) => a.localeCompare(b)).map(([path, source]) => [path, path === 'layers/melo/nuxt.config.ts' ? imageSettings(source) : source]))}`)
}

export function cacheSignature(siteDir: string): string {
  const repo = resolve(siteDir, '../..')
  const files = [...signatureFiles, `${relative(repo, siteDir)}/nuxt.config.ts`]
  return imageSignature(Object.fromEntries(files.map(path => [path, readFileSync(join(repo, path), 'utf8')])))
}

function files(dir: string): string[] {
  if (!existsSync(dir))
    return []
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(dir, entry.name)) : entry.isFile() ? [join(dir, entry.name)] : [])
}

/** Local IPX sources only. Remote URLs and paths outside public/ are rebuilt normally. */
export function imageSource(route: string): string | undefined {
  if (!route.startsWith('/_ipx/') || route.split('/').includes('..'))
    return
  try {
    const source = decodeURIComponent(route.slice('/_ipx/'.length).split('/').slice(1).join('/')).replace(/^\/+/, '')
    if (!source || source.includes('\\') || source.split('/').includes('..') || /^https?:/i.test(source))
      return
    return source
  }
  catch {

  }
}

function readManifest(siteDir: string): ImageManifest | undefined {
  try {
    return manifestSchema.parse(JSON.parse(readFileSync(join(siteDir, '.image-cache/manifest.json'), 'utf8')))
  }
  catch {

  }
}

export function hasImageCache(siteDir: string): boolean {
  const manifest = readManifest(siteDir)
  return manifest?.signature === cacheSignature(siteDir) && Object.keys(manifest.images).length > 0
}

/** Stage only entries whose source and encoded bytes still match the saved fingerprints. */
export function restoreImages(siteDir: string): { dir: string, routes: Set<string> } {
  const dir = join(siteDir, 'node_modules/.cache/melo-image-public')
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  const routes = new Set<string>()
  const manifest = readManifest(siteDir)
  if (!manifest || manifest.signature !== cacheSignature(siteDir))
    return { dir, routes }
  const sourceHashes = new Map<string, string>()
  for (const [route, entry] of Object.entries(manifest.images)) {
    const source = imageSource(route)
    if (source === undefined || source !== entry.source)
      continue
    const cached = join(siteDir, '.image-cache/public', route.slice(1))
    try {
      const sourceHash = sourceHashes.get(source) ?? digest(readFileSync(join(siteDir, 'public', source)))
      sourceHashes.set(source, sourceHash)
      if (sourceHash !== entry.sourceHash || digest(readFileSync(cached)) !== entry.outputHash)
        continue
      const target = join(dir, route.slice(1))
      mkdirSync(dirname(target), { recursive: true })
      copyFileSync(cached, target)
      routes.add(route)
    }
    catch {
      // A missing or corrupt cache entry is a cache miss, never a broken published asset.
    }
  }
  return { dir, routes }
}

/** Also seeds legacy tested builds: copied original files prove each encoder's input. */
export function saveImages(siteDir: string, outputDir: string): number {
  const signature = cacheSignature(siteDir)
  const manifest: ImageManifest = { signature, images: {} }
  const cacheDir = join(siteDir, '.image-cache/public')
  rmSync(cacheDir, { recursive: true, force: true })
  const sourceHashes = new Map<string, string>()
  for (const file of files(join(outputDir, '_ipx'))) {
    const route = `/${relative(outputDir, file).split('\\').join('/')}`
    const source = imageSource(route)
    if (source === undefined)
      continue
    try {
      const sourceHash = sourceHashes.get(source) ?? digest(readFileSync(join(siteDir, 'public', source)))
      sourceHashes.set(source, sourceHash)
      if (digest(readFileSync(join(outputDir, source))) !== sourceHash)
        continue
      const target = join(cacheDir, route.slice(1))
      mkdirSync(dirname(target), { recursive: true })
      copyFileSync(file, target)
      manifest.images[route] = { source, sourceHash, outputHash: digest(readFileSync(file)) }
    }
    catch {
      // Sources missing from the tested artifact cannot establish a valid cache entry.
    }
  }
  mkdirSync(join(siteDir, '.image-cache'), { recursive: true })
  writeFileSync(join(siteDir, '.image-cache/manifest.json'), JSON.stringify(manifest))
  return Object.keys(manifest.images).length
}
