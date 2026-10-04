import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, rmSync } from 'node:fs'
import process from 'node:process'
import { draftFixture, scheduledFixture } from '../site/site'

/**
 * Builds the static site the `site` specs read, with a draft and a scheduled post added for the
 * specs that check neither ships,
 * unless SITE_BUILD=skip and a build is there.
 */
export default function setup(): void {
  if (process.env.SITE_BUILD === 'skip') {
    if (!existsSync('.output/public/index.html'))
      throw new Error('SITE_BUILD=skip but there is no .output/public. Run `pnpm generate` first.')
    return
  }
  // The build the site ships, not a test build: nuxt.config.ts leaves modules out under VITEST.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('VITEST') && key !== 'NODE_ENV'))
  const fixtures = [draftFixture, scheduledFixture]
  for (const fixture of fixtures)
    copyFileSync(fixture.source, fixture.target)
  try {
    execFileSync('pnpm', ['exec', 'nuxi', 'generate'], { stdio: 'inherit', env })
  }
  finally {
    for (const fixture of fixtures)
      rmSync(fixture.target, { force: true })
  }
}
