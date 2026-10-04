import type { TestProject } from 'vitest/node'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

/**
 * Builds the site a `site-<name>` project's specs read, with a draft and a scheduled post added
 * for the specs that check neither ships, unless SITE_BUILD=skip and a build is there.
 */
export default async function setup(project: TestProject): Promise<void> {
  const site = project.name.replace(/^site-/, '')
  const siteDir = `sites/${site}`
  if (process.env.SITE_BUILD === 'skip') {
    if (!existsSync(`${siteDir}/.output/public/index.html`))
      throw new Error(`SITE_BUILD=skip but there is no ${siteDir}/.output/public. Run \`pnpm generate:${site}\` first.`)
    return
  }
  // The fixtures are filed under the site's first blog category, which each site names its own.
  const { categoryIds } = await import(/* @vite-ignore */ resolve(siteDir, 'site.ts')) as { categoryIds: readonly string[] }
  const fixtures = ['draft', 'scheduled'].map(name => ({
    source: `test/fixtures/${name}-post.md`,
    target: `${siteDir}/content/blog/test-${name}-fixture.md`,
  }))
  for (const fixture of fixtures)
    writeFileSync(fixture.target, readFileSync(fixture.source, 'utf8').replace(/^category: .*$/m, `category: ${categoryIds[0]}`))
  // The build the site ships, not a test build: the layer leaves modules out under VITEST.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('VITEST') && key !== 'NODE_ENV'))
  try {
    execFileSync('pnpm', ['exec', 'nuxi', 'generate', siteDir], { stdio: 'inherit', env })
  }
  finally {
    for (const fixture of fixtures)
      rmSync(fixture.target, { force: true })
  }
}
