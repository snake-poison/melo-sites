import { handleSubmission } from '../../layers/melo/public/_worker.js'

const origin = 'https://publicadjusterscharlotte.pages.dev'
const env = { PIPEDRIVE_API_TOKEN: 'server-secret', TURNSTILE_SECRET_KEY: 'captcha-secret' }
function request(overrides: Record<string, string> = {}, from = origin) {
  return new Request(`${origin}/api/claim-review`, {
    method: 'POST',
    headers: { 'Origin': from, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'First name': 'Website',
      'Last name': 'Test',
      'Email': 'test@example.com',
      'Phone': '7045550100',
      'Street address': '123 Test Street',
      'City': 'Charlotte',
      'State': 'NC',
      'ZIP code': '28208',
      'Where they are with the loss': '<script>alert(1)</script>\nWater damage',
      'Claim Number': '7010577499-1',
      'Policy Number': '381 5024818649 01',
      'Date of Loss': '2026-08-28',
      'Cause of Loss': 'Fallen Tree',
      'Insurance Company': 'Foremost Insurance',
      'cf-turnstile-response': 'valid-token',
      ...overrides,
    }),
  })
}
function mockApi(options: { captcha?: boolean, hostname?: string, failLead?: boolean, failLink?: boolean } = {}) {
  const calls: { url: string, method?: string, body: Record<string, unknown> }[] = []
  vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, method: init.method, body: typeof init.body === 'string' ? JSON.parse(init.body) : {} })
    if (url.includes('/persons/search'))
      return Response.json({ success: true, data: { items: [] } })
    if (url.includes('siteverify'))
      return Response.json({ success: options.captcha ?? true, hostname: options.hostname ?? 'publicadjusterscharlotte.pages.dev', action: 'claim-review' })
    if (init.method === 'DELETE')
      return Response.json({ success: true, data: {} })
    if (url.endsWith('/persons'))
      return Response.json({ success: true, data: { id: 123 } })
    if (url.endsWith('/leads'))
      return Response.json({ success: !options.failLead, data: { id: 'test-lead' } }, { status: options.failLead ? 500 : 200 })
    return Response.json({ success: !(options.failLink && init.method === 'PUT'), data: { id: 456 } })
  }))
  return calls
}

describe('Multi-site claim intake', () => {
  it('saves contact details, a lead and an escaped loss note before redirecting', async () => {
    const calls = mockApi()
    const response = await handleSubmission(request(), env)
    expect(response.status).toBe(303)
    expect(response.headers.get('Location')).toBe('/thank-you-page/')
    expect(calls[2]?.body).toMatchObject({ name: 'Website Test', emails: [{ value: 'test@example.com', primary: true }], phones: [{ value: '7045550100', primary: true }] })
    expect(calls[3]?.body.content).toContain('&lt;script&gt;')
    expect(calls[3]?.body.content).toContain('123 Test Street, Charlotte, NC, 28208')
    expect(calls[4]?.body).toMatchObject({ person_id: 123, title: 'Charlotte website — Website Test' })
    expect(calls[4]?.body).toMatchObject({ 'owner_id': 11555257, 'channel': 77, 'channel_id': 'publicadjusterscharlotte.com', '45ef25ca1ae3be18a5290f13f3c6d1af56079a5f': '7010577499-1', '412f092eb747565b254cbe73c486ccde29dc5453': '381 5024818649 01', '45563afa2d12fb820bab8efe71fb5ed3f4923cf8': '2026-08-28', '4e1235b3bac8c5276d17a9ba9bb74c98c8034826': 'Foremost Insurance' })
    expect(calls[4]?.body).not.toHaveProperty('0d46b54a15fa17c27620b0746f7d7f0a71a5601f')
    expect(calls[5]?.body).toMatchObject({ lead_id: 'test-lead', person_id: 123 })
  })
  it.each([
    [{ Email: 'invalid' }, origin],
    [{ Website: 'spam.example' }, origin],
    [{ 'Date of Loss': '2026-02-30' }, origin],
    [{ 'Street address': '' }, origin],
    [{}, 'https://other.example'],
  ])('rejects invalid or cross-origin intake before contacting services', async (values, from) => {
    const calls = mockApi()
    expect((await handleSubmission(request(values, from), env)).status).toBeGreaterThanOrEqual(400)
    expect(calls).toHaveLength(0)
  })
  it.each([{ captcha: false }, { hostname: 'other.example' }])('rejects failed or wrong-host spam verification', async (options) => {
    const calls = mockApi(options)
    expect((await handleSubmission(request(), env)).status).toBe(403)
    expect(calls).toHaveLength(1)
  })
  it.each([true, false])('links a carrier only when its exact match is an insurance contact (%s)', async (insurance) => {
    const calls = mockApi()
    const baseFetch = globalThis.fetch
    vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
      if (url.includes('/persons/search')) {
        expect(url).toContain('Foremost%20Insurance%20Group')
        return Response.json({ success: true, data: { items: [{ item: { id: 114, name: 'Foremost Insurance Group' } }] } })
      }
      if (url.endsWith('/persons/114'))
        return Response.json({ success: true, data: { id: 114, label_ids: insurance ? [3] : [] } })
      return baseFetch(url, init)
    }))
    expect((await handleSubmission(request(), env)).status).toBe(303)
    const lead = calls.find(call => call.url.endsWith('/leads'))?.body
    if (insurance)
      expect(lead?.['7f0de28d76691d9b26ed60f090a2f61315ee0f17']).toBe(114)
    else
      expect(lead).not.toHaveProperty('7f0de28d76691d9b26ed60f090a2f61315ee0f17')
  })
  it.each([
    ['publicadjusterscharlotte', 'Charlotte', 'publicadjusterscharlotte.com'],
    ['publicadjustersofatlanta', 'Atlanta', 'publicadjustersofatlanta.com'],
    ['melopropertyclaimsadjusting', 'Melo Property Claims', 'melopropertyclaimsadjusting.com'],
  ])('routes %s to Ramon with trusted website attribution', async (project, name, domain) => {
    const host = `${project}.pages.dev`
    const calls = mockApi({ hostname: host })
    const original = request({ 'Website source': 'spoofed.example', 'Commission Percent': '99' })
    const response = await handleSubmission(new Request(`https://${host}/api/claim-review`, {
      method: 'POST',
      headers: { 'Origin': `https://${host}`, 'Content-Type': 'application/x-www-form-urlencoded', 'Referer': `https://${host}/contact/?utm_source=google` },
      body: await original.text(),
    }), env)
    expect(response.status).toBe(303)
    const lead = calls.find(call => call.url.endsWith('/leads'))?.body
    expect(lead).toMatchObject({ title: `${name} website — Website Test`, owner_id: 11555257, channel_id: domain, f86d52c6d340fd5e4a316d3e9a8b401d975c633c: domain, bd579d846683e7edbd9b84bd71ebc457fe9456f4: `https://${host}/contact/` })
    expect(lead?.label_ids).toHaveLength(1)
    expect(lead).not.toHaveProperty('0d46b54a15fa17c27620b0746f7d7f0a71a5601f')
    expect(calls.find(call => call.url.endsWith('/notes'))?.body.content).toContain('utm_source: google')
  })
  it('cleans up only its new contact and note when lead creation fails', async () => {
    const calls = mockApi({ failLead: true })
    expect((await handleSubmission(request(), env)).status).toBe(502)
    expect(calls.filter(call => call.method === 'DELETE').map(call => call.url)).toEqual([
      'https://melopropertyclaims.pipedrive.com/api/v1/notes/456',
      'https://melopropertyclaims.pipedrive.com/api/v2/persons/123',
    ])
  })
  it('keeps a saved lead and its person note when linking the note fails', async () => {
    const calls = mockApi({ failLink: true })
    expect((await handleSubmission(request(), env)).status).toBe(303)
    expect(calls.some(call => call.method === 'DELETE')).toBe(false)
  })
})
