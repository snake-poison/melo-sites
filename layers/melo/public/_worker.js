/* global HTMLRewriter */
const consultingServices = ['Insurance appraisal', 'Umpire services', 'Claims consulting', 'Expert witness', 'Help me choose']
const sites = {
  consulting: { domain: 'propertyclaimsconsulting.net', project: 'propertyclaimsconsulting', name: 'Property Claims Consulting', phone: '(704) 325-5525', phoneHref: 'tel:+17043255525' },
  charlotte: { domain: 'publicadjusterscharlotte.com', project: 'publicadjusterscharlotte', name: 'Charlotte', phone: '(704) 286-0707', phoneHref: 'tel:+17042860707', source: 41 },
  atlanta: { domain: 'publicadjustersofatlanta.com', project: 'publicadjustersofatlanta', name: 'Atlanta', phone: '(404) 467-5755', phoneHref: 'tel:+14044675755', source: 41 },
  national: { domain: 'melopropertyclaimsadjusting.com', project: 'melopropertyclaimsadjusting', name: 'Melo Property Claims', phone: '(704) 325-5525', phoneHref: 'tel:+17043255525', source: 37 },
}
const labels = { charlotte: '8d1c4650-c016-11f1-b5ea-256102effffb', atlanta: '8d47ea30-c016-11f1-ae22-b155b03e262e', national: '8d6ed320-c016-11f1-ae22-b155b03e262e' }
const crmFields = {
  claim: '45ef25ca1ae3be18a5290f13f3c6d1af56079a5f',
  policy: '412f092eb747565b254cbe73c486ccde29dc5453',
  address: '74819b0574d4841d2de3a1a79d6828f7b25b444c',
  date: '45563afa2d12fb820bab8efe71fb5ed3f4923cf8',
  cause: '29ad6a44c75c2a226a82c692f6408f4d828b4205',
  insurer: '7f0de28d76691d9b26ed60f090a2f61315ee0f17',
  leadSource: 'a1334637cc7cbce838edc0d6c50df95a22929bb9',
  carrierText: '4e1235b3bac8c5276d17a9ba9bb74c98c8034826',
  website: 'f86d52c6d340fd5e4a316d3e9a8b401d975c633c',
  landing: 'bd579d846683e7edbd9b84bd71ebc457fe9456f4',
}
function siteFor(host) {
  return Object.entries(sites).find(([, site]) => [site.domain, `www.${site.domain}`, `${site.project}.pages.dev`].includes(host))
}
const apiBase = 'https://melopropertyclaims.pipedrive.com'

const clickKeys = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid']
const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const measurementLifetime = 90 * 86400000
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

// Visitor-supplied touches are bounded to this site's own HTTPS landing paths and the last 90 days.
function sanitizeTouch(value, url, siteId, withClicks) {
  if (!value || typeof value !== 'object')
    return null
  const out = {}
  try {
    const landing = new URL(value.landing)
    if (siteFor(landing.hostname)?.[0] !== siteId || landing.protocol !== 'https:')
      return null
    out.landing = url.origin + landing.pathname.slice(0, 500)
  }
  catch { return null }
  const timestamp = Date.parse(value.at)
  if (!Number.isFinite(timestamp) || timestamp < Date.now() - measurementLifetime || timestamp > Date.now() + 300000)
    return null
  out.at = new Date(timestamp).toISOString()
  for (const key of ['source', 'medium', ...campaignKeys, ...(withClicks ? clickKeys : [])]) {
    if (typeof value[key] === 'string')
      out[key] = Array.from(value[key]).filter(char => char.charCodeAt(0) >= 32).join('').slice(0, 200)
  }
  try {
    const referrer = new URL(value.referrer)
    if (['http:', 'https:'].includes(referrer.protocol))
      out.referrer = referrer.origin
  }
  catch { /* Never retain referrer paths or queries. */ }
  return out
}

export function intakeAttribution(form, url, referer, siteId) {
  const consent = ['granted', 'denied'].includes(form.get('Measurement consent')) ? form.get('Measurement consent') : 'unset'
  let supplied = null
  try {
    const value = form.get('Attribution') || ''
    if (value.length <= 7000)
      supplied = JSON.parse(value)
  }
  catch { /* Cached forms still work with same-origin referrer attribution. */ }
  const touch = value => sanitizeTouch(value, url, siteId, consent === 'granted')
  let current = touch(supplied?.current)
  if (!current) {
    current = { landing: url.origin, at: new Date().toISOString(), source: 'unknown', medium: 'unknown' }
    try {
      const page = new URL(referer)
      if (page.origin === url.origin) {
        current.landing += page.pathname.slice(0, 500)
        for (const key of [...campaignKeys, ...(consent === 'granted' ? clickKeys : [])]) {
          if (page.searchParams.has(key))
            current[key] = page.searchParams.get(key).slice(0, 200)
        }
        if (current.utm_source) {
          current.source = current.utm_source
          current.medium = current.utm_medium || 'unknown'
        }
      }
    }
    catch { /* An absent referrer is unknown. */ }
  }
  return { version: 1, consent, provenance: 'visitor-supplied', current, first: consent === 'granted' ? touch(supplied?.first) || current : null, lastNonDirect: consent === 'granted' ? touch(supplied?.lastNonDirect) : null }
}

function saved(id) {
  return new Response(null, { status: 303, headers: {
    'Location': '/thank-you-page/',
    'Cache-Control': 'no-store',
    'Set-Cookie': `__Host-melo_receipt=${id}; Max-Age=600; Path=/; Secure; SameSite=Strict`,
  } })
}

async function digest(text) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(hash), value => value.toString(16).padStart(2, '0')).join('')
}

// Reads at most `limit` bytes of a request body as text; null when absent or too large.
async function readText(request, limit) {
  const reader = request.body?.getReader()
  if (!reader)
    return null
  const chunks = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done)
      break
    size += value.length
    if (size > limit) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  return new TextDecoder().decode(new Uint8Array(chunks.flatMap(chunk => Array.from(chunk))))
}

// Safari erases storage written by page scripts after 7 days without a visit, but not cookies
// set by the server, so the consent choice and long-lived touches live in this cookie. It is
// readable by melo-attribution.js; only this endpoint writes it.
export async function measurementPreference(request) {
  const url = new URL(request.url)
  const siteId = siteFor(url.hostname)?.[0]
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  if (request.method !== 'POST')
    return new Response('Method not allowed', { status: 405, headers: { ...headers, Allow: 'POST' } })
  if (!siteId || request.headers.get('Origin') !== url.origin)
    return new Response('Forbidden', { status: 403, headers })
  let body
  try {
    body = JSON.parse(await readText(request, 8000))
  }
  catch { /* Rejected below. */ }
  if (!body || typeof body !== 'object' || !['granted', 'denied'].includes(body.choice))
    return new Response('Invalid preference', { status: 400, headers })
  // The choice lasts 90 days from when it was made, however often the touches are updated.
  let at = Date.parse(body.at)
  if (!Number.isFinite(at) || at < Date.now() - measurementLifetime || at > Date.now() + 300000)
    at = Date.now()
  const value = { version: 1, choice: body.choice, at: new Date(at).toISOString() }
  if (body.choice === 'granted') {
    value.first = sanitizeTouch(body.first, url, siteId, true)
    value.lastNonDirect = sanitizeTouch(body.lastNonDirect, url, siteId, true)
  }
  let encoded = encodeURIComponent(JSON.stringify(value))
  // Stay well inside the 4 KB cookie limit: the latest source goes first, then the first touch.
  for (const key of ['lastNonDirect', 'first']) {
    if (encoded.length > 3000) {
      value[key] = null
      encoded = encodeURIComponent(JSON.stringify(value))
    }
  }
  const maxAge = Math.floor((at + measurementLifetime - Date.now()) / 1000)
  headers['Set-Cookie'] = `__Host-melo_measurement=${encoded}; Max-Age=${maxAge}; Path=/; Secure; SameSite=Lax`
  return new Response(null, { status: 204, headers })
}

export async function intakeOutbox(request, env) {
  const url = new URL(request.url)
  const siteId = siteFor(url.hostname)?.[0]
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  if (!env.INTAKE_DB || !env.INTAKE_OUTBOX_TOKEN || !siteId)
    return new Response('Unavailable', { status: 503, headers })
  const supplied = request.headers.get('Authorization') || ''
  if (supplied.length > 1000 || await digest(supplied) !== await digest(`Bearer ${env.INTAKE_OUTBOX_TOKEN}`))
    return new Response('Unauthorized', { status: 401, headers })
  if (request.method === 'GET') {
    const result = await env.INTAKE_DB.prepare('SELECT id, payload FROM website_intakes WHERE site = ? AND delivered_at IS NULL ORDER BY received_at, id LIMIT 50').bind(siteId).all()
    return Response.json({ intakes: result.results.map(row => JSON.parse(row.payload)) }, { headers })
  }
  if (request.method === 'POST') {
    const text = await readText(request, 1000)
    if (text === null)
      return request.body ? new Response('Too large', { status: 413, headers }) : new Response('Invalid acknowledgement', { status: 400, headers })
    let ack
    try {
      ack = JSON.parse(text)
    }
    catch { return new Response('Invalid acknowledgement', { status: 400, headers }) }
    if (!ack || typeof ack !== 'object' || !uuid.test(ack.id) || !uuid.test(ack.twentyId))
      return new Response('Invalid acknowledgement', { status: 400, headers })
    const result = await env.INTAKE_DB.prepare('UPDATE website_intakes SET delivered_at = ?, twenty_id = ? WHERE id = ? AND site = ? AND (twenty_id IS NULL OR twenty_id = ?)').bind(new Date().toISOString(), ack.twentyId, ack.id, siteId, ack.twentyId).run()
    return Response.json({ acknowledged: result.meta.changes === 1 }, { headers })
  }
  return new Response('Method not allowed', { status: 405, headers: { ...headers, Allow: 'GET, POST' } })
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' })[char])
}

function failure(message, status = 400) {
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Claim review submission</title><body style="font-family:system-ui;max-width:40rem;margin:4rem auto;padding:1rem"><h1>We couldn’t submit your request</h1><p>${escapeHtml(message)}</p><p>Go back to your form to try again, or <a href="/contact/">contact us</a>.</p><p><a href="/contact/#claim-review">Contact us</a></p></body></html>`, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  })
}

async function pipedrive(env, path, method, body) {
  const response = await fetch(apiBase + path, {
    method,
    headers: { 'x-api-token': env.PIPEDRIVE_API_TOKEN, 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(12000),
  })
  const json = await response.json()
  if (!response.ok || !json.success)
    throw new Error(`Pipedrive request failed (${response.status})`)
  return json.data
}

export async function handleSubmission(request, env) {
  const url = new URL(request.url)
  if (request.method !== 'POST')
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } })
  const matchedSite = siteFor(url.hostname)
  if (!matchedSite || request.headers.get('Origin') !== url.origin)
    return failure('Please submit the form from our website.', 403)
  const [siteId, site] = matchedSite
  const useOutbox = Boolean(env.INTAKE_DB && siteId !== 'consulting')
  if ((!useOutbox && !env.PIPEDRIVE_API_TOKEN) || !env.TURNSTILE_SECRET_KEY || (useOutbox && !env.INTAKE_OUTBOX_TOKEN))
    return failure('The form is temporarily unavailable. Please call us.', 503)
  if (!request.headers.get('Content-Type')?.startsWith('application/x-www-form-urlencoded'))
    return failure('Please use the form on our website.', 415)
  if (!request.body)
    return failure('Please complete the form.')
  const reader = request.body.getReader()
  const chunks = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done)
      break
    size += value.length
    if (size > 16000) {
      await reader.cancel()
      return failure('Your request is too long. Please shorten the description.', 413)
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  const form = new URLSearchParams(new TextDecoder().decode(bytes))
  if (form.get('Website'))
    return failure('Please submit the form from our website.', 403)
  const fields = {}
  for (const name of ['Name', 'First name', 'Last name', 'Phone', 'Email', 'Street address', 'City', 'State', 'ZIP code', 'Claim Number', 'Policy Number', 'Date of Loss', 'Cause of Loss', 'Insurance Company']) {
    const value = form.get(name)?.trim() || ''
    const max = 200
    if (value.length > max)
      return failure(`Please check the ${name.toLowerCase()} field.`)
    fields[name] = value
  }
  const name = fields.Name || [fields['First name'], fields['Last name']].filter(Boolean).join(' ')
  if (!name)
    return failure('Please enter your name.')
  if (fields.Phone.replace(/\D/g, '').length < 7)
    return failure('Please enter a valid phone number.')
  if (fields.Email && !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(fields.Email))
    return failure('Please check your email address, or leave it blank.')
  fields.State = fields.State.toUpperCase()
  if ((form.get('Address line 2')?.length ?? 0) > 200)
    return failure('Please shorten address line 2.')
  const date = fields['Date of Loss']
  if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date || date > new Date().toISOString().slice(0, 10)))
    return failure('Please enter a valid date of loss that is not in the future.')
  const description = form.get('Where they are with the loss')?.trim() || ''
  if (description.length > 3000)
    return failure('Please shorten the description.')
  if ((fields.State && !/^[A-Z]{2}$/.test(fields.State)) || (fields['ZIP code'] && !/^\d{5}(?:-\d{4})?$/.test(fields['ZIP code'])))
    return failure('Please enter a two-letter state and valid ZIP code.')
  if (siteId === 'consulting') {
    const service = form.get('Requested service')?.trim() || ''
    if (!consultingServices.includes(service))
      return failure('Please select a service.')
    fields['Requested service'] = service
    for (const key of ['Parties involved', 'Timing']) {
      const value = form.get(key)?.trim() || ''
      if (value.length > 1000)
        return failure(`Please shorten the ${key.toLowerCase()} field.`)
      fields[key] = value
    }
  }
  const captured = intakeAttribution(form, url, request.headers.get('Referer'), siteId)
  const landing = captured.current.landing
  const attribution = Object.entries(captured.current).map(([key, value]) => `${key}: ${value}`).join('\n')
  const requestedId = form.get('Intake ID')
  if (requestedId && !uuid.test(requestedId))
    return failure('Please refresh the form and try again.')
  const intakeId = requestedId || crypto.randomUUID()
  const captcha = form.get('cf-turnstile-response')
  if (!captcha || captcha.length > 2048)
    return failure('Please complete the spam check and try again.')
  let person
  let lead
  let note
  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: captcha, remoteip: request.headers.get('CF-Connecting-IP') || '' }),
      signal: AbortSignal.timeout(12000),
    })
    const check = await verification.json()
    if (!verification.ok || !check.success || check.hostname !== url.hostname || check.action !== 'claim-review')
      return failure('The spam check expired or failed. Go back, refresh the form, and try again.', 403)
    if (useOutbox) {
      const payload = { version: 1, id: intakeId, site: siteId, website: site.domain, receivedAt: new Date().toISOString(), name, fields, description, attribution: captured }
      // Receipt time is server controlled; it is excluded from the retry fingerprint.
      const retryAttribution = JSON.parse(JSON.stringify(captured))
      for (const key of ['first', 'lastNonDirect', 'current']) {
        if (retryAttribution[key])
          delete retryAttribution[key].at
      }
      const fingerprint = await digest(JSON.stringify({ siteId, name, fields, description, captured: retryAttribution }))
      await env.INTAKE_DB.prepare('INSERT INTO website_intakes (id, site, received_at, fingerprint, payload) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(intakeId, siteId, payload.receivedAt, fingerprint, JSON.stringify(payload)).run()
      const existing = await env.INTAKE_DB.prepare('SELECT fingerprint, site FROM website_intakes WHERE id = ?').bind(intakeId).first()
      if (existing?.fingerprint !== fingerprint || existing?.site !== siteId)
        return failure('This request changed after submission. Refresh the form to send a new request.', 409)
      return saved(intakeId)
    }
    const address = [fields['Street address'], form.get('Address line 2')?.trim(), fields.City, fields.State, fields['ZIP code']].filter(Boolean).join(', ')
    let content = `<h2>${escapeHtml(site.name)} website — claim intake</h2><p><b>Source:</b> ${escapeHtml(landing)}</p><p><b>Policyholder:</b> ${escapeHtml(name)}<br><b>Phone:</b> ${escapeHtml(fields.Phone)}<br><b>Email:</b> ${escapeHtml(fields.Email || 'Not provided')}</p><p><b>Property:</b> ${escapeHtml(address || 'Not provided')}<br><b>Date of loss:</b> ${escapeHtml(date || 'Not provided')}<br><b>Cause:</b> ${escapeHtml(fields['Cause of Loss'] || 'Not provided')}<br><b>Insurance company:</b> ${escapeHtml(fields['Insurance Company'] || 'Not provided')}<br><b>Policy:</b> ${escapeHtml(fields['Policy Number'] || 'Not provided')}<br><b>Claim:</b> ${escapeHtml(fields['Claim Number'] || 'Not provided')}</p><p><b>Commission:</b> To be set by the team before preparing the contract.</p><p><b>Additional details:</b><br>${escapeHtml(description).replace(/\n/g, '<br>')}</p><p>${escapeHtml(attribution).replace(/\n/g, '<br>')}</p><p><b>Intake ID:</b> ${intakeId}</p><pre>${escapeHtml(JSON.stringify(captured))}</pre>`
    if (siteId === 'consulting') {
      content = `<h2>Property Claims Consulting — assignment inquiry</h2><p><b>Requested service:</b> ${escapeHtml(fields['Requested service'])}</p><p><b>Contact:</b> ${escapeHtml(name)}<br><b>Phone:</b> ${escapeHtml(fields.Phone)}<br><b>Email:</b> ${escapeHtml(fields.Email || 'Not provided')}</p><p><b>Property location:</b> ${escapeHtml(address || 'Not provided')}<br><b>Parties involved:</b> ${escapeHtml(fields['Parties involved'] || 'Not provided')}<br><b>Timing:</b> ${escapeHtml(fields.Timing || 'Not provided')}</p><p><b>Questions to review:</b><br>${escapeHtml(description).replace(/\n/g, '<br>')}</p><p><b>Source:</b> ${escapeHtml(landing)}<br><b>Intake ID:</b> ${intakeId}</p><p>Inquiry only. Availability, conflicts, qualifications, scope, and fees require review before engagement.</p>`
    }
    const leadFields = {
      [crmFields.claim]: fields['Claim Number'],
      [crmFields.policy]: fields['Policy Number'],
      [crmFields.address]: fields['Street address'] ? address : '',
      [crmFields.date]: date,
      [crmFields.cause]: fields['Cause of Loss'],
      [crmFields.carrierText]: fields['Insurance Company'],
      [crmFields.leadSource]: site.source,
      [crmFields.website]: site.domain,
      [crmFields.landing]: landing,
    }
    // Leave unanswered fields unset so an incomplete intake still creates a useful lead.
    for (const key of Object.keys(leadFields)) {
      if (leadFields[key] === '')
        delete leadFields[key]
    }
    // Known carrier aliases resolve to the existing INSURANCE contact, not adjuster contacts.
    const carrierName = fields['Insurance Company'].toLowerCase() === 'foremost insurance' ? 'Foremost Insurance Group' : fields['Insurance Company']
    // Resolve only an exact, existing INSURANCE contact; never invent a carrier contact.
    try {
      const search = carrierName ? await pipedrive(env, `/api/v2/persons/search?term=${encodeURIComponent(carrierName)}&fields=name&exact_match=true`, 'GET') : { items: [] }
      const matches = []
      for (const result of search.items || []) {
        if (result.item.name.toLowerCase() !== carrierName.toLowerCase())
          continue
        const carrier = await pipedrive(env, `/api/v2/persons/${result.item.id}`, 'GET')
        if (carrier.label_ids?.includes(3))
          matches.push(carrier.id)
      }
      if (matches.length === 1)
        leadFields[crmFields.insurer] = matches[0]
    }
    catch { /* The submitted carrier name remains in its structured intake field for review. */ }
    person = await pipedrive(env, '/api/v2/persons', 'POST', { name, owner_id: 11555257, emails: fields.Email ? [{ value: fields.Email, primary: true }] : [], phones: [{ value: fields.Phone, primary: true }] })
    // Save the loss details before creating the lead, then link the note to both records.
    note = await pipedrive(env, '/api/v1/notes', 'POST', { person_id: person.id, content })
    lead = await pipedrive(env, '/api/v1/leads', 'POST', { title: siteId === 'consulting' ? `${site.name} — ${fields['Requested service']} — ${name}` : `${site.name} website — ${name}`, person_id: person.id, owner_id: 11555257, ...(labels[siteId] ? { label_ids: [labels[siteId]] } : {}), channel: 77, channel_id: site.domain, origin_id: 'melo-sites-claim-intake', ...leadFields })
    await pipedrive(env, `/api/v1/notes/${note.id}`, 'PUT', { lead_id: lead.id, person_id: person.id, content })
    return saved(intakeId)
  }
  catch {
    // Never delete existing CRM data. These IDs belong only to this incomplete submission.
    // If a lead was saved, its linked person's note already preserves the entire request.
    if (lead)
      return saved(intakeId)
    if (person) {
      try {
        if (note)
          await pipedrive(env, `/api/v1/notes/${note.id}`, 'DELETE')
        await pipedrive(env, `/api/v2/persons/${person.id}`, 'DELETE')
      }
      catch { /* Keep any recoverable intake details if cleanup is unavailable. */ }
    }
    return failure('We could not save your request. Please try again or call us.', 502)
  }
}

/*
 * Turnstile is about 850 KB once it runs (its script, frame and challenge), so a page loads it
 * the first time a visitor touches the form, by when it has the token long before they finish
 * typing. It shows only if it needs the visitor to click. A form sent before the token is ready
 * waits for it (aria-busy) and sends itself. It is source text, not a function, because the
 * Pages bundler may wrap named functions in helpers the browser does not have.
 */
const turnstileLoader = `(function (slot) {
  var form = slot.closest('form'), box = slot.querySelector('.cf-turnstile'), started = false, waiting = false;
  if (!form || !box) return;
  function render() {
    window.turnstile.render(box, {
      sitekey: box.getAttribute('data-sitekey'), action: 'claim-review', size: 'flexible',
      theme: 'light', appearance: 'interaction-only',
      callback: function () {
        if (!waiting) return;
        waiting = false; form.removeAttribute('aria-busy'); form.requestSubmit();
      }
    });
  }
  function start() {
    if (started) return;
    started = true;
    if (window.turnstile) return render();
    (window.meloTurnstileQueue = window.meloTurnstileQueue || []).push(render);
    window.meloTurnstileReady = function () { window.meloTurnstileQueue.splice(0).forEach(function (run) { run(); }); };
    if (document.getElementById('melo-turnstile')) return;
    var script = document.createElement('script');
    script.id = 'melo-turnstile'; script.async = true;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=meloTurnstileReady';
    document.head.appendChild(script);
  }
  form.addEventListener('focusin', start);
  form.addEventListener('pointerdown', start);
  form.addEventListener('submit', function (event) {
    var token = form.querySelector('[name="cf-turnstile-response"]');
    if (token && token.value) return;
    event.preventDefault(); waiting = true; form.setAttribute('aria-busy', 'true'); start();
  });
})(document.currentScript.parentNode)`

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/intake-outbox')
      return intakeOutbox(request, env)
    if (url.pathname === '/api/measurement')
      return measurementPreference(request)
    if (url.pathname === '/api/claim-review')
      return handleSubmission(request, env)
    const response = await env.ASSETS.fetch(request)
    const site = siteFor(url.hostname)?.[1]
    if (!response.headers.get('Content-Type')?.includes('text/html') || !site)
      return response
    // Only form-bearing pages gain the Turnstile slot, and its script stays small until a
    // visitor touches the form: see turnstileLoader.
    return new HTMLRewriter().on('body', {
      element(element) {
        const ga4 = /^G-[A-Z0-9]+$/.test(env.GA4_MEASUREMENT_ID || '') ? env.GA4_MEASUREMENT_ID : ''
        element.append(`<script src="/melo-attribution.js" defer data-ga4="${ga4}"></script>`, { html: true })
      },
    }).on('[data-claim-captcha]', {
      element(element) {
        if (!env.TURNSTILE_SITE_KEY)
          return
        element.setInnerContent(`<div class="cf-turnstile" data-sitekey="${escapeHtml(env.TURNSTILE_SITE_KEY)}"></div><script>${turnstileLoader}</script><noscript>Please enable JavaScript for the spam check, or call ${escapeHtml(site.phone)}.</noscript>`, { html: true })
      },
    }).transform(response)
  },
}
