import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pages, publicDir, readPage } from './site'

describe('Contract intake deployment', () => {
  it('ships the shared Pages worker and routes with every site build', () => {
    expect(readFileSync(join(publicDir, '_worker.js'), 'utf8')).toBe(readFileSync('layers/melo/public/_worker.js', 'utf8'))
    expect(readFileSync(join(publicDir, 'melo-attribution.js'), 'utf8')).toBe(readFileSync('layers/melo/public/melo-attribution.js', 'utf8'))
    const routes = JSON.parse(readFileSync(join(publicDir, '_routes.json'), 'utf8')) as { include: string[] }
    expect(routes.include).toContain('/*')
  })
  it('requires only name and phone and collapses optional claim fields on every intake page', () => {
    let count = 0
    for (const page of pages()) {
      const doc = readPage(page.file)
      for (const form of doc.querySelectorAll('form[action="/api/claim-review"]')) {
        count++
        expect(form.getAttribute('method')).toBe('post')
        expect([...form.querySelectorAll('[required]')].map(field => field.getAttribute('name') ?? '').sort((a, b) => a.localeCompare(b))).toEqual(['Name', 'Phone'])
        const extra = form.querySelector('details')
        expect(extra).not.toBeNull()
        expect(extra?.hasAttribute('open')).toBe(false)
        for (const name of ['Email', 'Where they are with the loss'])
          expect(form.querySelector(`[name="${name}"]`)?.closest('details')).toBeNull()
        for (const name of ['Street address', 'City', 'State', 'ZIP code', 'Insurance Company', 'Date of Loss', 'Policy Number', 'Claim Number', 'Cause of Loss']) {
          const input = extra?.querySelector(`[name="${name}"]`)
          expect(input, `${page.path}: ${name}`).not.toBeNull()
          expect(input?.hasAttribute('required')).toBe(false)
          expect(input?.getAttribute('value') ?? '').toBe('')
        }
        expect(form.querySelector('[data-claim-captcha]')).not.toBeNull()
        expect(form.querySelector('[name="Commission Percent"]')).toBeNull()
      }
    }
    expect(count).toBeGreaterThan(1)
  })
})
