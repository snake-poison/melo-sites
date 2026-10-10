import { handleSubmission } from '../../layers/melo/public/_worker.js'

const origin = 'https://publicadjusterscharlotte.pages.dev'
const env = { PIPEDRIVE_API_TOKEN: 'server-secret', TURNSTILE_SECRET_KEY: 'captcha-secret' }
function request(overrides: Record<string, string> = {}, from = origin) {
  return new Request(`${origin}/api/claim-review`, {
    method: 'POST',
    headers: { 'Origin': from, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      'Name': 'Website Test',
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
  function consultingRequest(values: Record<string, string> = {}, host = 'propertyclaimsconsulting.net') {
    return new Request(`https://${host}/api/claim-review`, {
      method: 'POST',
      headers: { 'Origin': `https://${host}`, 'Content-Type': 'application/x-www-form-urlencoded', 'Referer': `https://${host}/umpire-services/` },
      body: new URLSearchParams({ 'Name': 'Assignment Test', 'Phone': '7045550100', 'Requested service': 'Umpire services', 'City': 'Cary', 'State': 'NC', 'Parties involved': 'Owner <script> and carrier', 'Timing': 'Before November', 'Where they are with the loss': 'Review the disputed repair scope.', 'cf-turnstile-response': 'valid-token', ...values }),
    })
  }

  it.each(['Insurance appraisal', 'Umpire services', 'Claims consulting', 'Expert witness', 'Help me choose'])('preserves a consulting %s inquiry in its own lead and conflict-review note', async (service) => {
    const calls = mockApi({ hostname: 'propertyclaimsconsulting.net' })
    expect((await handleSubmission(consultingRequest({ 'Requested service': service }), env)).status).toBe(303)
    const lead = calls.find(call => call.url.endsWith('/leads'))?.body
    expect(lead).toMatchObject({ title: `Property Claims Consulting — ${service} — Assignment Test`, owner_id: 11555257, channel_id: 'propertyclaimsconsulting.net', f86d52c6d340fd5e4a316d3e9a8b401d975c633c: 'propertyclaimsconsulting.net' })
    expect(lead).not.toHaveProperty('label_ids')
    expect(lead).not.toHaveProperty('a1334637cc7cbce838edc0d6c50df95a22929bb9')
    const note = calls.find(call => call.url.endsWith('/notes'))?.body.content
    expect(note).toContain(service)
    expect(note).toContain('Cary, NC')
    expect(note).toContain('Owner &lt;script&gt; and carrier')
    expect(note).toContain('Before November')
    expect(note).toContain('Review the disputed repair scope.')
    expect(note).not.toContain('Policyholder:')
    expect(note).not.toContain('Commission:')
  })
  it.each(['www.propertyclaimsconsulting.net', 'propertyclaimsconsulting.pages.dev'])('accepts the consulting host %s', async (hostname) => {
    mockApi({ hostname })
    expect((await handleSubmission(consultingRequest({}, hostname), env)).status).toBe(303)
  })
  it.each([['Requested service', ''], ['Requested service', 'Public adjusting'], ['Parties involved', 'x'.repeat(1001)], ['Timing', 'x'.repeat(1001)]])('rejects invalid consulting inquiry %s before CRM writes', async (key, value) => {
    const calls = mockApi({ hostname: 'propertyclaimsconsulting.net' })
    expect((await handleSubmission(consultingRequest({ [key]: value }), env)).status).toBe(400)
    expect(calls).toHaveLength(0)
  })
  it('requires Pipedrive configuration for consulting even when a Twenty outbox is bound', async () => {
    const calls = mockApi({ hostname: 'propertyclaimsconsulting.net' })
    const outboxEnv = { TURNSTILE_SECRET_KEY: 'captcha-secret', INTAKE_DB: {}, INTAKE_OUTBOX_TOKEN: 'outbox-secret' }
    expect((await handleSubmission(consultingRequest(), outboxEnv)).status).toBe(503)
    expect(calls).toHaveLength(0)
    expect((await handleSubmission(consultingRequest(), { ...outboxEnv, ...env })).status).toBe(303)
    expect(calls.some(call => call.url.endsWith('/leads'))).toBe(true)
  })
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
    [{ Name: '' }, origin],
    [{ Phone: '' }, origin],
    [{ 'ZIP code': 'wrong' }, origin],
    [{ State: 'North Carolina' }, origin],
    [{ 'Policy Number': 'x'.repeat(201) }, origin],
    [{}, 'https://other.example'],
  ])('rejects invalid or cross-origin intake before contacting services', async (values, from) => {
    const calls = mockApi()
    expect((await handleSubmission(request(values, from), env)).status).toBeGreaterThanOrEqual(400)
    expect(calls).toHaveLength(0)
  })
  it('accepts name and phone alone without empty contact or claim fields', async () => {
    const calls = mockApi()
    const response = await handleSubmission(request({
      'Email': '',
      'Street address': '',
      'City': '',
      'State': '',
      'ZIP code': '',
      'Claim Number': '',
      'Policy Number': '',
      'Date of Loss': '',
      'Cause of Loss': '',
      'Insurance Company': '',
      'Where they are with the loss': '',
    }), env)
    expect(response.status).toBe(303)
    expect(calls.some(call => call.url.includes('/persons/search'))).toBe(false)
    const person = calls.find(call => call.url.endsWith('/persons'))?.body
    expect(person).toMatchObject({ name: 'Website Test', emails: [], phones: [{ value: '7045550100', primary: true }] })
    const lead = calls.find(call => call.url.endsWith('/leads'))?.body
    for (const key of ['45ef25ca1ae3be18a5290f13f3c6d1af56079a5f', '412f092eb747565b254cbe73c486ccde29dc5453', '45563afa2d12fb820bab8efe71fb5ed3f4923cf8', '74819b0574d4841d2de3a1a79d6828f7b25b444c', '4e1235b3bac8c5276d17a9ba9bb74c98c8034826'])
      expect(lead).not.toHaveProperty(key)
    expect(calls.find(call => call.url.endsWith('/notes'))?.body.content).toContain('Not provided')
  })
  it('accepts a partial address, optional email and lowercase state', async () => {
    const calls = mockApi()
    expect((await handleSubmission(request({ 'Email': '', 'State': 'nc', 'ZIP code': '', 'Policy Number': '', 'Claim Number': '' }), env)).status).toBe(303)
    expect(calls.find(call => call.url.endsWith('/leads'))?.body['74819b0574d4841d2de3a1a79d6828f7b25b444c']).toBe('123 Test Street, Charlotte, NC')
  })
  it('continues accepting older cached forms with separate first and last names', async () => {
    const calls = mockApi()
    expect((await handleSubmission(request({ 'Name': '', 'First name': 'Website', 'Last name': 'Test' }), env)).status).toBe(303)
    expect(calls.find(call => call.url.endsWith('/persons'))?.body.name).toBe('Website Test')
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
