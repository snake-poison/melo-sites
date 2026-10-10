import { readFileSync } from 'node:fs'
import { webcrypto } from 'node:crypto'
import { runInNewContext } from 'node:vm'
import { DatabaseSync } from 'node:sqlite'
import { Window } from 'happy-dom'
import type { HTMLButtonElement, HTMLElement } from 'happy-dom'
import { handleSubmission, intakeAttribution, intakeOutbox, measurementPreference } from '../../layers/melo/public/_worker.js'

const code = readFileSync('layers/melo/public/melo-attribution.js', 'utf8')
const origin = 'https://publicadjusterscharlotte.com'
const leadId = '5b89f18a-bb7b-40ba-a993-25bbd9dd4736'
const cookieName = '__Host-melo_measurement'
const sessionKey = 'melo.attribution-session.v1'
interface CapturedTouch { source: string, medium: string, landing: string, gclid?: string, referrer?: string }
interface Captured { first: CapturedTouch, current: CapturedTouch, lastNonDirect: CapturedTouch, lastSeen: number }
interface Preference { choice: string, at: string, first?: CapturedTouch | null, lastNonDirect?: CapturedTouch | null }
function captured(value: string | undefined): Captured {
  return JSON.parse(value ?? 'null') as Captured
}
async function outboxJson(response: Response): Promise<{ intakes: unknown[], acknowledged?: boolean }> {
  return await response.json() as { intakes: unknown[], acknowledged?: boolean }
}
function preferenceCookie(response: Response): Preference {
  const header = response.headers.get('Set-Cookie') ?? ''
  return JSON.parse(decodeURIComponent(header.slice(cookieName.length + 1).split(';')[0]!)) as Preference
}
async function preference(body: unknown, headers: Record<string, string> = { Origin: origin }) {
  return measurementPreference(new Request(`${origin}/api/measurement`, { method: 'POST', headers, body: JSON.stringify(body) }))
}
function browser(path = '/', options: { referrer?: string, storage?: Record<string, string>, cookies?: string[], receipt?: boolean, ga4?: string, formKind?: string } = {}) {
  const window = new Window({ url: origin + path, settings: { disableJavaScriptFileLoading: true } })
  const document = window.document
  document.body.innerHTML = '<form action="/api/claim-review"><input name="Name" value="Private Name"><input name="Phone" value="7045550100"></form><button data-measurement-settings hidden>Settings</button><a href="tel:+17045550100">Call</a>'
  Object.defineProperty(document, 'referrer', { value: options.referrer ?? '' })
  const script = document.createElement('script')
  script.setAttribute('data-ga4', options.ga4 ?? '')
  script.setAttribute('data-form-kind', options.formKind ?? 'claim')
  Object.defineProperty(document, 'currentScript', { value: script })
  for (const [key, value] of Object.entries(options.storage ?? {}))
    window.localStorage.setItem(key, value)
  for (const cookie of options.cookies ?? [])
    document.cookie = `${cookie}; Path=/; Secure`
  if (options.receipt)
    document.cookie = `__Host-melo_receipt=${leadId}; Path=/; Secure`
  // The script's writes go to the real endpoint, whose Set-Cookie lands in this browser.
  const requests: Preference[] = []
  const pending: Promise<void>[] = []
  async function fetch(input: string, init: RequestInit) {
    requests.push(JSON.parse(String(init.body)) as Preference)
    const done = measurementPreference(new Request(origin + input, { method: init.method, body: init.body, headers: { ...init.headers as Record<string, string>, Origin: origin } })).then((response) => {
      const cookie = response.headers.get('Set-Cookie')
      if (cookie !== null)
        document.cookie = cookie
    })
    pending.push(done)
    return done
  }
  runInNewContext(code, { window, document, location: window.location, localStorage: window.localStorage, crypto: webcrypto, URL, Date, fetch })
  return {
    window,
    requests,
    async settle() { await Promise.all(pending) },
    async choose(choice: string) {
      document.querySelector<HTMLButtonElement>(`[data-choice="${choice}"]`)!.click()
      await Promise.all(pending)
    },
    panelHidden() { return document.querySelector<HTMLElement>('.measurement-consent')!.hidden },
    storage() { return Object.fromEntries(Array.from({ length: window.localStorage.length }, (_, i) => window.localStorage.key(i)!).map(key => [key, window.localStorage.getItem(key)!])) },
    cookies() { return document.cookie.split(';').map(cookie => cookie.trim()).filter(cookie => cookie.startsWith(`${cookieName}=`)) },
    preference() { return JSON.parse(decodeURIComponent(this.cookies()[0]?.slice(cookieName.length + 1) ?? 'null')) as Preference | null },
    submit() {
      const form = document.querySelector('form')!
      form.dispatchEvent(new window.Event('submit', { cancelable: true }))
      return Object.fromEntries([...form.querySelectorAll('input')].map(input => [input.name, input.value]))
    },
  }
}
function database() {
  const sqlite = new DatabaseSync(':memory:')
  sqlite.exec(readFileSync('migrations/0001_intake.sql', 'utf8'))
  return { sqlite, binding: { prepare(sql: string) {
    return { bind(...args: (number | string)[]) {
      return { async run() {
        return { meta: { changes: Number(sqlite.prepare(sql).run(...args).changes) } }
      }, async first() {
        return sqlite.prepare(sql).get(...args)
      }, async all() {
        return { results: sqlite.prepare(sql).all(...args) }
      } }
    } }
  } } }
}
function submission(extra: Record<string, string> = {}) {
  return new Request(`${origin}/api/claim-review`, { method: 'POST', headers: { 'Origin': origin, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ 'Name': 'Website Test', 'Phone': '7045550100', 'cf-turnstile-response': 'valid', 'Intake ID': leadId, ...extra }) })
}
function captcha() {
  vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: true, hostname: 'publicadjusterscharlotte.com', action: 'claim-review' })))
}

describe('Website attribution and consent', () => {
  it('uses assignment wording and lets consulting visitors reopen and change a saved choice', async () => {
    const b = browser('/', { formKind: 'assignment', ga4: 'G-TEST123' })
    expect(b.window.document.querySelector('.measurement-consent')?.textContent).toContain('Your assignment inquiry works either way.')
    await b.choose('denied')
    const returning = browser('/', { formKind: 'assignment', cookies: b.cookies(), ga4: 'G-TEST123' })
    expect(returning.panelHidden()).toBe(true)
    expect(returning.window.document.querySelector('script[src*="googletagmanager"]')).toBeNull()
    returning.window.document.querySelector<HTMLButtonElement>('[data-measurement-settings]')!.click()
    expect(returning.panelHidden()).toBe(false)
    await returning.choose('granted')
    expect(returning.preference()?.choice).toBe('granted')
    expect(returning.window.document.querySelector('script[src*="googletagmanager"]')).not.toBeNull()
  })

  it('does not save marketing data or load Google before consent; declining keeps the form usable', async () => {
    const b = browser('/?gclid=ad-click&utm_source=google', { ga4: 'G-TEST123' })
    expect(b.window.localStorage.length).toBe(0)
    expect(b.requests).toHaveLength(0)
    expect(b.window.document.querySelector('script[src*="googletagmanager"]')).toBeNull()
    await b.choose('denied')
    const values = b.submit()
    const captured = intakeAttribution(new URLSearchParams(values), new URL(origin), null, 'charlotte')
    expect(captured.consent).toBe('denied')
    expect(captured.first).toBeNull()
    expect(captured.current).not.toHaveProperty('gclid')
    expect(b.window.localStorage.length).toBe(0)
    expect(b.preference()).toMatchObject({ choice: 'denied' })
    expect(b.preference()).not.toHaveProperty('first')
    expect(values['Intake ID']).toMatch(/^[a-f0-9-]{36}$/)
    expect(browser('/', { cookies: b.cookies() }).panelHidden()).toBe(true)
  })
  it('preserves the ad session through internal browsing and first/last source through a later direct return', async () => {
    const ad = browser('/?gclid=click-123&utm_campaign=storm')
    await ad.choose('granted')
    const browse = browser('/contact/', { storage: ad.storage(), cookies: ad.cookies(), referrer: `${origin}/` })
    const sameSession = captured(browse.submit().Attribution)
    expect(sameSession.current.source).toBe('google')
    expect(sameSession.current.landing).toBe(`${origin}/contact/`)
    expect(sameSession.lastNonDirect.landing).toBe(`${origin}/`)
    expect(browse.requests).toHaveLength(0)
    const storage = browse.storage()
    const session = JSON.parse(storage[sessionKey]!) as { lastSeen: number }
    session.lastSeen = Date.now() - 2 * 86400000
    storage[sessionKey] = JSON.stringify(session)
    const returned = browser('/contact/', { storage, cookies: browse.cookies() })
    const a = captured(returned.submit().Attribution)
    expect(a.first.source).toBe('google')
    expect(a.lastNonDirect.gclid).toBe('click-123')
    expect(a.current.source).toBe('direct')
    await browse.choose('denied')
    expect(captured(browse.submit().Attribution).current.source).toBe('direct')
    expect(captured(browse.submit().Attribution).current).not.toHaveProperty('gclid')
  })
  it('keeps the choice and first/last touches when Safari has erased script-written storage', async () => {
    const ad = browser('/?gclid=click-123')
    await ad.choose('granted')
    const later = browser('/contact/', { cookies: ad.cookies(), referrer: 'https://www.google.com/' })
    expect(later.panelHidden()).toBe(true)
    await later.settle()
    const a = captured(later.submit().Attribution)
    expect(a.first.gclid).toBe('click-123')
    expect(a.lastNonDirect.medium).toBe('organic')
    expect(later.preference()?.lastNonDirect?.medium).toBe('organic')
  })
  it.each([['https://www.google.com/search?q=private', 'organic'], ['https://partner.example/private?email=private', 'referral']])('classifies %s without retaining private referrer URLs', async (referrer, medium) => {
    const b = browser('/', { referrer })
    await b.choose('granted')
    const a = captured(b.submit().Attribution)
    expect(a.current.medium).toBe(medium)
    expect(a.current.referrer).toBe(new URL(referrer).origin)
    expect(JSON.stringify(a)).not.toContain('private')
    expect(b.cookies().join()).not.toContain('private')
  })
  it('does not call an untagged Facebook click paid traffic', async () => {
    const b = browser('/?fbclid=organic-click', { referrer: 'https://www.facebook.com/' })
    await b.choose('granted')
    expect(captured(b.submit().Attribution).current.medium).toBe('referral')
  })
  it('withdraws consent, clears attribution and leaves a way to change preferences', async () => {
    const b = browser('/?utm_source=partner')
    await b.choose('granted')
    b.window.document.querySelector<HTMLButtonElement>('[data-measurement-settings]')!.click()
    await b.choose('denied')
    expect(b.window.localStorage.getItem(sessionKey)).toBeNull()
    expect(b.preference()).toMatchObject({ choice: 'denied' })
    expect(b.cookies().join()).not.toContain('partner')
    expect(captured(b.submit().Attribution)).not.toHaveProperty('first')
  })
  it('expires remembered choices after 90 days', () => {
    const stale = encodeURIComponent(JSON.stringify({ choice: 'granted', at: new Date(Date.now() - 91 * 86400000).toISOString(), first: { source: 'old' } }))
    const b = browser('/', { cookies: [`${cookieName}=${stale}`] })
    expect(b.submit()['Measurement consent']).toBe('unset')
    expect(b.panelHidden()).toBe(false)
  })
  it('moves a choice saved by the previous version into the cookie without extending it', async () => {
    const at = new Date(Date.now() - 10 * 86400000).toISOString()
    const first = { landing: `${origin}/`, at, source: 'google', medium: 'cpc', gclid: 'old-click' }
    const b = browser('/about/', { storage: {
      'melo.measurement-consent.v1': JSON.stringify({ choice: 'granted', at, expiresAt: Date.now() + 80 * 86400000 }),
      'melo.attribution.v1': JSON.stringify({ first, lastNonDirect: first, expiresAt: Date.now() + 80 * 86400000 }),
    } })
    await b.settle()
    expect(b.preference()).toMatchObject({ choice: 'granted', at, first: { gclid: 'old-click' } })
    expect(b.window.localStorage.getItem('melo.measurement-consent.v1')).toBeNull()
    expect(b.window.localStorage.getItem('melo.attribution.v1')).toBeNull()
    const expired = browser('/', { storage: { 'melo.measurement-consent.v1': JSON.stringify({ choice: 'granted', at, expiresAt: Date.now() - 1 }) } })
    expect(expired.submit()['Measurement consent']).toBe('unset')
    expect(expired.requests).toHaveLength(0)
  })
  it('counts a successful receipt once and never counts an ordinary thank-you visit', async () => {
    const accepted = browser('/')
    await accepted.choose('granted')
    const thanks = browser('/thank-you-page/', { cookies: accepted.cookies(), receipt: true, ga4: 'G-TEST123' })
    const layer = (thanks.window as unknown as { dataLayer: unknown[][] }).dataLayer
    expect(layer.filter(row => row[0] === 'event' && row[1] === 'generate_lead')).toHaveLength(1)
    expect(thanks.window.document.cookie).not.toContain(leadId)
    expect(JSON.stringify(layer)).not.toContain('Private Name')
    const ordinary = browser('/thank-you-page/', { cookies: accepted.cookies(), ga4: 'G-TEST123' })
    expect(((ordinary.window as unknown as { dataLayer: unknown[][] }).dataLayer).some(row => row[1] === 'generate_lead')).toBe(false)
  })
  it('rejects cross-site, expired and private URL material from supplied attribution', () => {
    const at = new Date().toISOString()
    const a = intakeAttribution(new URLSearchParams({ 'Measurement consent': 'granted', 'Attribution': JSON.stringify({ first: { landing: 'https://evil.example/', at }, lastNonDirect: { landing: `${origin}/`, at: '2000-01-01' }, current: { landing: `${origin}/contact/?email=secret#secret`, at, source: 'google', medium: 'organic', referrer: 'https://google.com/search?q=secret' } }) }), new URL(origin), null, 'charlotte')
    expect(a.first).toEqual(a.current)
    expect(a.lastNonDirect).toBeNull()
    expect(JSON.stringify(a)).not.toContain('secret')
  })
})

describe('Measurement preference cookie', () => {
  it('is set by the server for 90 days from the choice, readable by the page script', async () => {
    const at = new Date(Date.now() - 30 * 86400000).toISOString()
    const response = await preference({ choice: 'granted', at })
    expect(response.status).toBe(204)
    const header = response.headers.get('Set-Cookie')!
    expect(header).toMatch(/^__Host-melo_measurement=[^;]+; Max-Age=\d+; Path=\/; Secure; SameSite=Lax$/)
    expect(Number(/Max-Age=(\d+)/.exec(header)![1])).toBeCloseTo(60 * 86400, -2)
    expect(header).not.toContain('HttpOnly')
    expect(preferenceCookie(await preference({ choice: 'granted', at: '2000-01-01' })).at).not.toBe('2000-01-01T00:00:00.000Z')
  })
  it('refuses other origins, unknown sites and invalid choices', async () => {
    expect((await preference({ choice: 'granted' }, { Origin: 'https://evil.example' })).status).toBe(403)
    expect((await measurementPreference(new Request('https://evil.example/api/measurement', { method: 'POST', headers: { Origin: 'https://evil.example' }, body: '{"choice":"granted"}' }))).status).toBe(403)
    expect((await preference({ choice: 'maybe' })).status).toBe(400)
    expect((await measurementPreference(new Request(`${origin}/api/measurement`))).status).toBe(405)
  })
  it('keeps only this site\'s bounded touches, none after a decline, and fits a cookie', async () => {
    const at = new Date().toISOString()
    const touch = { landing: `${origin}/contact/?email=secret`, at, source: 'google', medium: 'cpc', gclid: 'click', referrer: 'https://google.com/search?q=secret' }
    const granted = preferenceCookie(await preference({ choice: 'granted', first: touch, lastNonDirect: { ...touch, landing: 'https://evil.example/' } }))
    expect(granted.first).toMatchObject({ landing: `${origin}/contact/`, gclid: 'click', referrer: 'https://google.com' })
    expect(granted.lastNonDirect).toBeNull()
    expect(preferenceCookie(await preference({ choice: 'denied', first: touch }))).not.toHaveProperty('first')
    const long = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'].map(key => [key, '%'.repeat(200)]))
    const big = await preference({ choice: 'granted', first: { ...touch, ...long }, lastNonDirect: { ...touch, ...long } })
    expect(big.headers.get('Set-Cookie')!.length).toBeLessThan(4000)
    expect(preferenceCookie(big).choice).toBe('granted')
  })
})

describe('Durable website intake outbox', () => {
  it('saves before redirect, deduplicates retries, refuses changed payloads and never contacts Pipedrive', async () => {
    captcha()
    const db = database()
    const env = { INTAKE_DB: db.binding, INTAKE_OUTBOX_TOKEN: 'test-outbox-token', TURNSTILE_SECRET_KEY: 'captcha-secret' }
    const first = await handleSubmission(submission(), env)
    expect(first.status).toBe(303)
    expect(first.headers.get('Set-Cookie')).toContain(leadId)
    expect((await handleSubmission(submission(), env)).status).toBe(303)
    expect((await handleSubmission(submission({ Name: 'Changed' }), env)).status).toBe(409)
    expect(db.sqlite.prepare('SELECT COUNT(*) AS n FROM website_intakes').get()?.n).toBe(1)
    expect(vi.mocked(fetch).mock.calls.every(([url]) => String(url).includes('siteverify'))).toBe(true)
  })
  it('keeps pending records behind authentication, scopes reads/acks by site, and acknowledges idempotently', async () => {
    captcha()
    const db = database()
    const env = { INTAKE_DB: db.binding, INTAKE_OUTBOX_TOKEN: 'test-outbox-token', TURNSTILE_SECRET_KEY: 'captcha-secret' }
    await handleSubmission(submission(), env)
    const url = `${origin}/api/intake-outbox`
    expect((await intakeOutbox(new Request(url), env)).status).toBe(401)
    const headers = { Authorization: 'Bearer test-outbox-token' }
    expect((await intakeOutbox(new Request(url, { method: 'POST', headers, body: 'null' }), env)).status).toBe(400)
    const pending = await intakeOutbox(new Request(url, { headers }), env)
    expect((await outboxJson(pending)).intakes).toHaveLength(1)
    const other = await intakeOutbox(new Request('https://publicadjustersofatlanta.com/api/intake-outbox', { headers }), env)
    expect((await outboxJson(other)).intakes).toHaveLength(0)
    for (let i = 0; i < 2; i++) {
      const ack = await intakeOutbox(new Request(url, { method: 'POST', headers, body: JSON.stringify({ id: leadId, twentyId: leadId }) }), env)
      expect((await outboxJson(ack)).acknowledged).toBe(true)
    }
    expect((await outboxJson(await intakeOutbox(new Request(url, { headers }), env))).intakes).toHaveLength(0)
  })
  it('does not issue a receipt when durable storage fails', async () => {
    captcha()
    const env = { INTAKE_DB: { prepare() {
      throw new Error('outage')
    } }, INTAKE_OUTBOX_TOKEN: 'token', TURNSTILE_SECRET_KEY: 'secret' }
    const response = await handleSubmission(submission(), env)
    expect(response.status).toBe(502)
    expect(response.headers.get('Set-Cookie')).toBeNull()
  })
})
