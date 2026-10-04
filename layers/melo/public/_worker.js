/* global HTMLRewriter */
const sites = {
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
  for (const name of ['First name', 'Last name', 'Phone', 'Email', 'Street address', 'City', 'State', 'ZIP code', 'Claim Number', 'Policy Number', 'Date of Loss', 'Cause of Loss', 'Insurance Company']) {
    const value = form.get(name)?.trim()
    const max = 200
    if (!value || value.length > max)
      return failure(`Please check the ${name.toLowerCase()} field.`)
    fields[name] = value
  }
  if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(fields.Email) || fields.Phone.replace(/\D/g, '').length < 7)
    return failure('Please enter a valid email address and phone number.')
  if ((form.get('Address line 2')?.length ?? 0) > 200)
    return failure('Please shorten address line 2.')
  const date = fields['Date of Loss']
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date || date > new Date().toISOString().slice(0, 10))
    return failure('Please enter a valid date of loss that is not in the future.')
  const description = form.get('Where they are with the loss')?.trim() || ''
  if (description.length > 3000)
    return failure('Please shorten the description.')
  if (!/^[A-Z]{2}$/.test(fields.State) || !/^\d{5}(?:-\d{4})?$/.test(fields['ZIP code']))
    return failure('Please enter a two-letter state and valid ZIP code.')
  const referer = request.headers.get('Referer')
  let landing = url.origin
  let attribution = ''
  try {
    const page = new URL(referer)
    if (page.origin === url.origin) {
      landing += page.pathname.slice(0, 500)
      attribution = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].map(key => page.searchParams.has(key) ? `${key}: ${page.searchParams.get(key).slice(0, 200)}` : '').filter(Boolean).join('\n')
    }
  }
  catch { /* The website host still identifies the source without a referrer. */ }
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
    const content = `<h2>${escapeHtml(site.name)} website — claim intake</h2><p><b>Source:</b> ${escapeHtml(landing)}</p><p><b>Policyholder:</b> ${escapeHtml(name)}<br><b>Phone:</b> ${escapeHtml(fields.Phone)}<br><b>Email:</b> ${escapeHtml(fields.Email)}</p><p><b>Property:</b> ${escapeHtml(address)}<br><b>Date of loss:</b> ${escapeHtml(date)}<br><b>Cause:</b> ${escapeHtml(fields['Cause of Loss'])}<br><b>Insurance company:</b> ${escapeHtml(fields['Insurance Company'])}<br><b>Policy:</b> ${escapeHtml(fields['Policy Number'])}<br><b>Claim:</b> ${escapeHtml(fields['Claim Number'])}</p><p><b>Commission:</b> To be set by the team before preparing the contract.</p><p><b>Additional details:</b><br>${escapeHtml(description).replace(/\n/g, '<br>')}</p><p>${escapeHtml(attribution).replace(/\n/g, '<br>')}</p>`
    const leadFields = {
      [crmFields.claim]: fields['Claim Number'],
      [crmFields.policy]: fields['Policy Number'],
      [crmFields.address]: address,
      [crmFields.date]: date,
      [crmFields.cause]: fields['Cause of Loss'],
      [crmFields.carrierText]: fields['Insurance Company'],
      [crmFields.leadSource]: site.source,
      [crmFields.website]: site.domain,
      [crmFields.landing]: landing,
    }
    // Known carrier aliases resolve to the existing INSURANCE contact, not adjuster contacts.
    const carrierName = fields['Insurance Company'].toLowerCase() === 'foremost insurance' ? 'Foremost Insurance Group' : fields['Insurance Company']
    // Resolve only an exact, existing INSURANCE contact; never invent a carrier contact.
    try {
      const search = await pipedrive(env, `/api/v2/persons/search?term=${encodeURIComponent(carrierName)}&fields=name&exact_match=true`, 'GET')
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
    person = await pipedrive(env, '/api/v2/persons', 'POST', { name, owner_id: 11555257, emails: [{ value: fields.Email, primary: true }], phones: [{ value: fields.Phone, primary: true }] })
    // Save the loss details before creating the lead, then link the note to both records.
    note = await pipedrive(env, '/api/v1/notes', 'POST', { person_id: person.id, content })
    lead = await pipedrive(env, '/api/v1/leads', 'POST', { title: `${site.name} website — ${name}`, person_id: person.id, owner_id: 11555257, label_ids: [labels[siteId]], channel: 77, channel_id: site.domain, origin_id: 'melo-sites-claim-intake', ...leadFields })
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
    const site = siteFor(url.hostname)?.[1]
    if (!response.headers.get('Content-Type')?.includes('text/html') || !env.TURNSTILE_SITE_KEY || !site)
      return response
    // Only form-bearing pages gain the small Turnstile script; static pages keep no JS runtime.
    return new HTMLRewriter().on('[data-claim-captcha]', {
      element(element) {
        element.setInnerContent(`<div class="cf-turnstile" data-sitekey="${escapeHtml(env.TURNSTILE_SITE_KEY)}" data-action="claim-review" data-size="flexible" data-theme="light"></div><script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script><noscript>Please enable JavaScript for the spam check, or call ${escapeHtml(site.phone)}.</noscript>`, { html: true })
      },
    }).transform(response)
  },
}
