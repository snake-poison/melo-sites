import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const output = 'sites/consulting/.output/public'
const routes = ['/', '/insurance-appraisal/', '/umpire-services/', '/claims-consulting/', '/expert-witness/', '/contact/', '/privacy-policy/', '/thank-you-page/']
function page(path: string) {
  const html = readFileSync(join(output, path, 'index.html'), 'utf8')
  return { html, doc: new DOMParser().parseFromString(html, 'text/html') }
}

describe.each(routes)('Consulting $0', (path) => {
  it('ships a complete, light static page with working internal destinations', () => {
    const { html, doc } = page(path)
    expect(doc.querySelectorAll('h1')).toHaveLength(1)
    expect(doc.title).toContain('Property Claims Consulting')
    expect(doc.querySelectorAll('script[src], link[rel="modulepreload"], link[rel="stylesheet"]')).toHaveLength(0)
    expect(gzipSync(html).length).toBeLessThan(43_440 - 1024)
    for (const link of doc.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')) {
      const url = new URL(link.getAttribute('href')!, 'https://propertyclaimsconsulting.net')
      if (!url.pathname.endsWith('/')) {
        expect(existsSync(join(output, decodeURIComponent(url.pathname))), url.href).toBe(true)
        continue
      }
      expect(routes, url.href).toContain(url.pathname)
      if (url.hash)
        expect(page(url.pathname).doc.getElementById(url.hash.slice(1)), url.href).not.toBeNull()
    }
    const imageUrls = [...doc.querySelectorAll('[src], [srcset]')].flatMap(element => [element.getAttribute('src') ?? '', element.getAttribute('srcset') ?? '']).flatMap(value => value.split(',').map(source => source.trim().split(' ')[0]!)).filter(url => url.startsWith('/_ipx/'))
    for (const url of imageUrls)
      expect(existsSync(join(output, decodeURIComponent(url))), url).toBe(true)
    expect([...doc.querySelectorAll('style')].map(style => style.textContent).join('')).toContain('.measurement-consent')
    expect(doc.querySelector('[data-measurement-settings]')).not.toBeNull()
    expect(doc.querySelector('a[href="tel:+17043052338"]')).not.toBeNull()
  })
})

it('confirms once and removes duplicate marketing and submission calls to action', () => {
  const { doc } = page('/thank-you-page/')
  expect(doc.querySelector('h1')?.textContent).toContain('Inquiry received.')
  expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex')
  expect(doc.querySelector('.response-copy')?.textContent).toContain('We’ll contact you about your assignment.')
  expect(doc.querySelector('form, .header-cta, .mobile-cta, .footer-grid')).toBeNull()
  expect(doc.querySelector('.response-copy a')?.getAttribute('href')).toBe('/')
})

it('preserves the requested service and only requires service, name, and phone', () => {
  for (const path of routes.filter(path => !['/privacy-policy/', '/thank-you-page/'].includes(path))) {
    const { doc } = page(path)
    const form = doc.querySelector('form')!
    expect(form.getAttribute('method')).toBe('post')
    expect(form.getAttribute('action')).toBe('/api/claim-review')
    expect([...form.querySelectorAll('[required]')].map(field => field.getAttribute('name'))).toEqual(['Requested service', 'Name', 'Phone'])
    expect(form.querySelector('[data-claim-captcha]')).not.toBeNull()
    if (path !== '/' && path !== '/contact/') {
      const heading = doc.querySelector('h1')!.textContent!
      const selected = form.querySelector('option[selected]')?.textContent
      expect(heading.toLowerCase()).toContain(selected!.toLowerCase())
    }
  }
})

it('deploys the same consent script and intake worker that the unit suite verifies', () => {
  for (const asset of ['_worker.js', 'melo-attribution.js'])
    expect(readFileSync(join(output, asset), 'utf8')).toBe(readFileSync(`layers/melo/public/${asset}`, 'utf8'))
})
