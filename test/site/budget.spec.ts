import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { pages, readPage } from './site'

/*
 * What a page may cost, in round trips: on a slow connection a page's load time is mostly the
 * trips to the server, not its bytes. Pages are text, so the whole page is its HTML: styles
 * inlined, no script but the theme's, nothing preloaded. A change that breaks a budget should
 * say why it is worth it, here, by raising the number.
 */

// A new connection sends 10 packets of about 1,448 bytes in its first round trip and doubles
// that each trip after (TCP slow start, RFC 6928), so a response that fits in 14,480 bytes
// takes one trip, 43,440 two, 101,360 three.
const FIRST_WINDOW = 10 * 1448
// The host's response headers, under a kilobyte, travel in the same trips. Rounded up.
const HEADERS = 1024

/** The round trips a response of `bytes` takes on a fresh connection, after the handshakes. */
function roundTrips(bytes: number): number {
  let trips = 0
  for (let sent = 0, window = FIRST_WINDOW; sent < bytes + HEADERS; window *= 2, trips++)
    sent += window
  return trips
}

// Every page arrives within two: posts (about 20 KB now) and everything else (about 14).
const ROUND_TRIPS = { post: 2, page: 2 }

const INLINE_SCRIPT_BUDGET = 4 * 1024

describe('roundTrips', () => {
  it('counts the trips slow start needs', () => {
    expect(roundTrips(FIRST_WINDOW - HEADERS)).toBe(1)
    expect(roundTrips(FIRST_WINDOW - HEADERS + 1)).toBe(2)
    expect(roundTrips(3 * FIRST_WINDOW - HEADERS)).toBe(2)
    expect(roundTrips(3 * FIRST_WINDOW - HEADERS + 1)).toBe(3)
  })
})

describe.each(pages())('$path', ({ path, file }) => {
  const html = readFileSync(file)
  const doc = readPage(file)
  const kind = path.startsWith('/blog/') && path !== '/blog/' ? 'post' : 'page'

  it(`arrives within ${ROUND_TRIPS[kind]} round trips, compressed`, () => {
    expect(roundTrips(gzipSync(html).length)).toBeLessThanOrEqual(ROUND_TRIPS[kind])
  })

  it('loads no script file and no stylesheet', () => {
    expect(doc.querySelectorAll('script[src]')).toHaveLength(0)
    expect(doc.querySelectorAll('link[rel="stylesheet"]')).toHaveLength(0)
    expect(doc.querySelectorAll('link[rel="modulepreload"], link[rel="preload"], link[rel="prefetch"]')).toHaveLength(0)
  })

  it(`runs under ${INLINE_SCRIPT_BUDGET / 1024} KB of inline script`, () => {
    const inline = [...doc.querySelectorAll('script:not([type="application/ld+json"])')]
      .reduce((sum, script) => sum + (script.textContent?.length ?? 0), 0)
    expect(inline).toBeLessThanOrEqual(INLINE_SCRIPT_BUDGET)
  })
})
