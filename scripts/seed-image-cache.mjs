import { Buffer } from 'node:buffer'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { cacheSignature, hasImageCache, imageSignature, saveImages, signatureFiles } from '../layers/melo/image-cache.ts'

const site = process.argv[2]
if (!['charlotte', 'national', 'atlanta'].includes(site))
  throw new Error('Pass charlotte, national or atlanta.')
const siteDir = resolve(`sites/${site}`)
const repo = process.env.GH_REPO
if (!repo)
  throw new Error('Set GH_REPO to the repository containing the tested build artifacts.')

function gh(...args) {
  return execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })
}

if (hasImageCache(siteDir)) {
  console.info('[image-cache] A compatible cache was restored by Actions.')
}
else {
  let temp
  try {
    const [run] = JSON.parse(gh('run', 'list', '--repo', repo, '--workflow', 'ci.yml', '--branch', 'main', '--status', 'success', '--limit', '1', '--json', 'databaseId,headSha'))
    if (!run)
      throw new Error('No successful main build is available.')
    const { artifacts } = JSON.parse(gh('api', `repos/${repo}/actions/runs/${run.databaseId}/artifacts`))
    const cached = artifacts.find(a => a.name === `image-cache-${site}` && !a.expired)
    if (cached) {
      gh('run', 'download', `${run.databaseId}`, '--repo', repo, '--name', cached.name, '--dir', join(siteDir, '.image-cache'))
      if (!hasImageCache(siteDir))
        throw new Error('The previous cache uses different encoder settings.')
      console.info('[image-cache] Restored images from the last successful main build.')
    }
    else {
      // One-time bootstrap for builds made before this cache existed. Both encoder
      // settings and each copied original must match; never trust filenames alone.
      const files = [...signatureFiles, `sites/${site}/nuxt.config.ts`]
      const inputs = Object.fromEntries(files.map((path) => {
        const blob = JSON.parse(gh('api', '--method', 'GET', `repos/${repo}/contents/${path}`, '-f', `ref=${run.headSha}`))
        return [path, Buffer.from(blob.content, 'base64').toString('utf8')]
      }))
      if (imageSignature(inputs) !== cacheSignature(siteDir))
        throw new Error('The tested baseline uses different encoder settings.')
      temp = mkdtempSync(join(tmpdir(), 'melo-tested-images-'))
      console.info(`[image-cache] Downloading the tested ${site} artifact for the initial cache seed.`)
      gh('run', 'download', `${run.databaseId}`, '--repo', repo, '--name', `site-${site}`, '--dir', temp)
      const count = saveImages(siteDir, temp)
      console.info(`[image-cache] Seeded ${count} matching variants from tested main commit ${run.headSha}.`)
    }
  }
  catch (error) {
    console.info(`[image-cache] No compatible tested baseline: ${error.message}. Generating images normally.`)
  }
  finally {
    if (temp)
      rmSync(temp, { recursive: true, force: true })
  }
}
