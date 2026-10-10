import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import process from 'node:process'

export default function setup(): void {
  if (process.env.SITE_BUILD === 'skip') {
    if (!existsSync('sites/consulting/.output/public/index.html'))
      throw new Error('Build consulting before using SITE_BUILD=skip.')
    return
  }
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('VITEST') && key !== 'NODE_ENV'))
  execFileSync('pnpm', ['generate:consulting'], { stdio: 'inherit', env })
}
