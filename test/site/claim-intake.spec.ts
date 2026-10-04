import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pages, publicDir, readPage } from './site'

describe('Contract intake deployment', () => {
  it('ships the shared Pages worker and routes with every site build', () => {
    expect(readFileSync(join(publicDir, '_worker.js'), 'utf8')).toBe(readFileSync('layers/melo/public/_worker.js', 'utf8'))
    expect(JSON.parse(readFileSync(join(publicDir, '_routes.json'), 'utf8')).include).toContain('/*')
  })
  it('provides contract fields on every page containing the intake', () => {
    let count = 0
    for (const page of pages()) {
      const doc = readPage(page.file)
      for (const form of doc.querySelectorAll('form[action="/api/claim-review"]')) {
        count++
        expect(form.getAttribute('method')).toBe('post')
        for (const name of ['First name', 'Last name', 'Phone', 'Email', 'Street address', 'City', 'State', 'ZIP code', 'Insurance Company', 'Date of Loss', 'Policy Number', 'Claim Number', 'Cause of Loss'])
          expect(form.querySelector(`[name="${name}"]`)?.hasAttribute('required'), `${page.path}: ${name}`).toBe(true)
        expect(form.querySelector('[data-claim-captcha]')).not.toBeNull()
        expect(form.querySelector('[name="Commission Percent"]')).toBeNull()
      }
    }
    expect(count).toBeGreaterThan(1)
  })
})
