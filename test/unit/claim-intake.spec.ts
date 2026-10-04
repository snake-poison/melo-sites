import { handleSubmission } from '../../sites/charlotte/public/_worker.js'

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
      'Loss type': 'Water Damage',
      'cf-turnstile-response': 'valid-token',
      ...overrides,
    }),
  })
}
function mockApi(options: { captcha?: boolean, hostname?: string, failLead?: boolean, failLink?: boolean } = {}) {
  const calls: { url: string, method?: string, body: Record<string, unknown> }[] = []
  vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url, method: init.method, body: typeof init.body === 'string' ? JSON.parse(init.body) : {} })
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

describe('Charlotte claim intake', () => {
  it('saves contact details, a lead and an escaped loss note before redirecting', async () => {
    const calls = mockApi()
    const response = await handleSubmission(request(), env)
    expect(response.status).toBe(303)
    expect(response.headers.get('Location')).toBe('/thank-you-page/')
    expect(calls[1]?.body).toMatchObject({ name: 'Website Test', emails: [{ value: 'test@example.com', primary: true }], phones: [{ value: '7045550100', primary: true }] })
    expect(calls[2]?.body.content).toContain('&lt;script&gt;')
    expect(calls[2]?.body.content).toContain('123 Test Street, Charlotte, NC, 28208')
    expect(calls[3]?.body).toMatchObject({ person_id: 123, title: 'Charlotte website — Website Test' })
    expect(calls[4]?.body).toMatchObject({ lead_id: 'test-lead', person_id: 123 })
  })
  it.each([
    [{ Email: 'invalid' }, origin],
    [{ Website: 'spam.example' }, origin],
    [{ 'Loss type': 'unknown' }, origin],
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
