/* global HTMLRewriter */
const hosts = new Set(['publicadjusterscharlotte.pages.dev', 'publicadjusterscharlotte.com', 'www.publicadjusterscharlotte.com'])
const lossTypes = new Set(['Fire / Smoke Damage', 'Water Damage', 'Mold Remediation', 'Storm Damage', 'Other'])
const apiBase = 'https://melopropertyclaims.pipedrive.com'

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' })[char])
}

function failure(message, status = 400) {
  return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Claim review submission</title><body style="font-family:system-ui;max-width:40rem;margin:4rem auto;padding:1rem"><h1>We couldn’t submit your request</h1><p>${escapeHtml(message)}</p><p>Go back to your form to try again, or <a href="tel:+17042860707">call (704) 286-0707</a>.</p><p><a href="/contact/#claim-review">Contact us</a></p></body></html>`, {
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
  if (!hosts.has(url.hostname) || request.headers.get('Origin') !== url.origin)
    return failure('Please submit the form from our website.', 403)
  if (!env.PIPEDRIVE_API_TOKEN || !env.TURNSTILE_SECRET_KEY)
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
  for (const name of ['First name', 'Last name', 'Phone', 'Email', 'Street address', 'City', 'State', 'ZIP code', 'Where they are with the loss']) {
    const value = form.get(name)?.trim()
    const max = name === 'Where they are with the loss' ? 3000 : 200
    if (!value || value.length > max)
      return failure(`Please check the ${name.toLowerCase()} field.`)
    fields[name] = value
  }
  if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(fields.Email) || fields.Phone.replace(/\D/g, '').length < 7)
    return failure('Please enter a valid email address and phone number.')
  if ((form.get('Address line 2')?.length ?? 0) > 200)
    return failure('Please shorten address line 2.')
  const losses = [...new Set(form.getAll('Loss type'))]
  if (!losses.length || losses.some(type => !lossTypes.has(type)))
    return failure('Please select at least one damage type.')
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
    const name = `${fields['First name']} ${fields['Last name']}`
    const address = [fields['Street address'], form.get('Address line 2')?.trim(), fields.City, fields.State, fields['ZIP code']].filter(Boolean).join(', ')
    const content = `<h2>Charlotte website — free claim review</h2><p><b>Source:</b> ${escapeHtml(url.origin)}</p><p><b>Damage:</b> ${losses.map(escapeHtml).join(', ')}</p><p><b>Property:</b> ${escapeHtml(address)}</p><p><b>Phone:</b> ${escapeHtml(fields.Phone)}<br><b>Email:</b> ${escapeHtml(fields.Email)}</p><p><b>Claim status / description:</b><br>${escapeHtml(fields['Where they are with the loss']).replace(/\n/g, '<br>')}</p>`
    person = await pipedrive(env, '/api/v2/persons', 'POST', { name, emails: [{ value: fields.Email, primary: true }], phones: [{ value: fields.Phone, primary: true }] })
    // Save the loss details before creating the lead, then link the note to both records.
    note = await pipedrive(env, '/api/v1/notes', 'POST', { person_id: person.id, content })
    lead = await pipedrive(env, '/api/v1/leads', 'POST', { title: `Charlotte website — ${name}`, person_id: person.id })
    await pipedrive(env, `/api/v1/notes/${note.id}`, 'PUT', { lead_id: lead.id, person_id: person.id, content })
    return new Response(null, { status: 303, headers: { 'Location': '/thank-you-page/', 'Cache-Control': 'no-store' } })
  }
  catch {
    // Never delete existing CRM data. These IDs belong only to this incomplete submission.
    // If a lead was saved, its linked person's note already preserves the entire request.
    if (lead)
      return new Response(null, { status: 303, headers: { 'Location': '/thank-you-page/', 'Cache-Control': 'no-store' } })
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/claim-review')
      return handleSubmission(request, env)
    const response = await env.ASSETS.fetch(request)
    if (!response.headers.get('Content-Type')?.includes('text/html') || !env.TURNSTILE_SITE_KEY)
      return response
    // Only form-bearing pages gain the small Turnstile script; static pages keep no JS runtime.
    return new HTMLRewriter().on('[data-claim-captcha]', {
      element(element) {
        element.setInnerContent(`<div class="cf-turnstile" data-sitekey="${escapeHtml(env.TURNSTILE_SITE_KEY)}" data-action="claim-review" data-size="flexible" data-theme="light"></div><script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script><noscript>Please enable JavaScript for the spam check, or call (704) 286-0707.</noscript>`, { html: true })
      },
    }).transform(response)
  },
}
