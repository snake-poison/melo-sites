import { readFileSync } from 'node:fs'
import { webcrypto } from 'node:crypto'
import { runInNewContext } from 'node:vm'
import { DatabaseSync } from 'node:sqlite'
import { Window } from 'happy-dom'
import type { HTMLButtonElement } from 'happy-dom'
import { handleSubmission, intakeAttribution, intakeOutbox } from '../../layers/melo/public/_worker.js'

const code = readFileSync('layers/melo/public/melo-attribution.js', 'utf8')
const origin = 'https://publicadjusterscharlotte.com'
const leadId = '5b89f18a-bb7b-40ba-a993-25bbd9dd4736'
interface CapturedTouch { source: string, medium: string, landing: string, gclid?: string, referrer?: string }
interface Captured { first: CapturedTouch, current: CapturedTouch, lastNonDirect: CapturedTouch, lastSeen: number }
function captured(value: string | undefined): Captured {
  return JSON.parse(value ?? 'null') as Captured
}
async function outboxJson(response: Response): Promise<{ intakes: unknown[], acknowledged?: boolean }> {
  return await response.json() as { intakes: unknown[], acknowledged?: boolean }
}
function browser(path = '/', options: { referrer?: string, storage?: Record<string, string>, receipt?: boolean, ga4?: string } = {}) {
  const window = new Window({ url: origin + path, settings: { disableJavaScriptFileLoading: true } })
  const document = window.document
  document.body.innerHTML = '<form action="/api/claim-review"><input name="Name" value="Private Name"><input name="Phone" value="7045550100"></form><button data-measurement-settings hidden>Settings</button><a href="tel:+17045550100">Call</a>'
  Object.defineProperty(document, 'referrer', { value: options.referrer ?? '' })
  const script = document.createElement('script')
  script.setAttribute('data-ga4', options.ga4 ?? '')
  Object.defineProperty(document, 'currentScript', { value: script })
  for (const [key, value] of Object.entries(options.storage ?? {}))
    window.localStorage.setItem(key, value)
  if (options.receipt)
    document.cookie = `__Host-melo_receipt=${leadId}; Path=/; Secure`
  runInNewContext(code, { window, document, location: window.location, localStorage: window.localStorage, crypto: webcrypto, URL, Date })
  return {
    window,
    choose(choice: string) { document.querySelector<HTMLButtonElement>(`[data-choice="${choice}"]`)!.click() },
    storage() { return Object.fromEntries(Array.from({ length: window.localStorage.length }, (_, i) => window.localStorage.key(i)!).map(key => [key, window.localStorage.getItem(key)!])) },
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
  it('does not save marketing data or load Google before consent; declining keeps the form usable', () => {
    const b = browser('/?gclid=ad-click&utm_source=google', { ga4: 'G-TEST123' })
    expect(b.window.localStorage.length).toBe(0)
    expect(b.window.document.querySelector('script[src*="googletagmanager"]')).toBeNull()
    b.choose('denied')
    const values = b.submit()
    const captured = intakeAttribution(new URLSearchParams(values), new URL(origin), null, 'charlotte')
    expect(captured.consent).toBe('denied')
    expect(captured.first).toBeNull()
    expect(captured.current).not.toHaveProperty('gclid')
    expect(b.window.localStorage.getItem('melo.attribution.v1')).toBeNull()
    expect(values['Intake ID']).toMatch(/^[a-f0-9-]{36}$/)
  })
  it('preserves the ad session through internal browsing and first/last source through a later direct return', () => {
    const ad = browser('/?gclid=click-123&utm_campaign=storm')
    ad.choose('granted')
    const browse = browser('/contact/', { storage: ad.storage(), referrer: `${origin}/` })
    const sameSession = captured(browse.submit().Attribution)
    expect(sameSession.current.source).toBe('google')
    expect(sameSession.current.landing).toBe(`${origin}/contact/`)
    const storage = browse.storage()
    const old = captured(storage['melo.attribution.v1'])
    old.lastSeen = Date.now() - 2 * 86400000
    storage['melo.attribution.v1'] = JSON.stringify(old)
    const returned = browser('/contact/', { storage })
    const a = captured(returned.submit().Attribution)
    expect(a.first.source).toBe('google')
    expect(a.lastNonDirect.gclid).toBe('click-123')
    expect(a.current.source).toBe('direct')
  })
  it.each([['https://www.google.com/search?q=private', 'organic'], ['https://partner.example/private?email=private', 'referral']])('classifies %s without retaining private referrer URLs', (referrer, medium) => {
    const b = browser('/', { referrer })
    b.choose('granted')
    const a = captured(b.submit().Attribution)
    expect(a.current.medium).toBe(medium)
    expect(a.current.referrer).toBe(new URL(referrer).origin)
    expect(JSON.stringify(a)).not.toContain('private')
  })
  it('does not call an untagged Facebook click paid traffic', () => {
    const b = browser('/?fbclid=organic-click', { referrer: 'https://www.facebook.com/' })
    b.choose('granted')
    expect(captured(b.submit().Attribution).current.medium).toBe('referral')
  })
  it('withdraws consent, clears attribution and leaves a way to change preferences', () => {
    const b = browser('/?utm_source=partner')
    b.choose('granted')
    b.window.document.querySelector<HTMLButtonElement>('[data-measurement-settings]')!.click()
    b.choose('denied')
    expect(b.window.localStorage.getItem('melo.attribution.v1')).toBeNull()
    expect(captured(b.submit().Attribution)).not.toHaveProperty('first')
  })
  it('expires remembered choices and attribution', () => {
    const b = browser('/', { storage: {
      'melo.measurement-consent.v1': JSON.stringify({ choice: 'granted', expiresAt: Date.now() - 1 }),
      'melo.attribution.v1': JSON.stringify({ first: { source: 'old' }, expiresAt: Date.now() + 10000 }),
    } })
    expect(b.window.localStorage.getItem('melo.attribution.v1')).toBeNull()
    expect(b.submit()['Measurement consent']).toBe('unset')
  })
  it('counts a successful receipt once and never counts an ordinary thank-you visit', () => {
    const accepted = browser('/')
    accepted.choose('granted')
    const thanks = browser('/thank-you-page/', { storage: accepted.storage(), receipt: true, ga4: 'G-TEST123' })
    const layer = (thanks.window as unknown as { dataLayer: unknown[][] }).dataLayer
    expect(layer.filter(row => row[0] === 'event' && row[1] === 'generate_lead')).toHaveLength(1)
    expect(thanks.window.document.cookie).not.toContain(leadId)
    expect(JSON.stringify(layer)).not.toContain('Private Name')
    const ordinary = browser('/thank-you-page/', { storage: accepted.storage(), ga4: 'G-TEST123' })
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
