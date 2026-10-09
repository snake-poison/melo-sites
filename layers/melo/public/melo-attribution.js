/* Small, framework-free measurement for the static sites. No customer form values enter analytics. */
(function () {
  const script = document.currentScript
  const measurementId = script?.getAttribute('data-ga4') || ''
  // Safari erases storage written by page scripts after 7 days without a visit. The choice and
  // first/last touches therefore live in a cookie only the server sets (POST /api/measurement);
  // localStorage keeps just the 30-minute session, which that limit cannot outlast.
  const cookieName = '__Host-melo_measurement'
  const sessionKey = 'melo.attribution-session.v1'
  const legacyKeys = { consent: 'melo.measurement-consent.v1', attribution: 'melo.attribution.v1' }
  const lifetime = 90 * 24 * 60 * 60 * 1000
  const sessionLength = 30 * 60 * 1000
  const now = Date.now()
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid']
  const page = new URL(location.href)
  const current = { at: new Date(now).toISOString(), landing: page.origin + page.pathname, source: 'direct', medium: 'none' }
  for (const key of keys) {
    const value = page.searchParams.get(key)
    if (value)
      current[key] = value.slice(0, 200)
  }
  try {
    const referrer = new URL(document.referrer)
    if (referrer.hostname !== page.hostname) {
      current.referrer = referrer.origin
      current.source = referrer.hostname
      current.medium = /(?:^|\.)(?:google\.[a-z.]+|bing\.com|search\.yahoo\.com|duckduckgo\.com)$/.test(referrer.hostname) ? 'organic' : 'referral'
    }
  }
  catch { /* No referrer is direct/unknown, not evidence of an organic visit. */ }
  if (current.gclid || current.gbraid || current.wbraid) {
    current.source = 'google'
    current.medium = 'cpc'
  }
  else if (current.msclkid) {
    current.source = 'bing'
    current.medium = 'cpc'
  }
  // fbclid alone also appears on unpaid Facebook links; only explicit UTMs establish paid social.
  else if (current.utm_source) {
    current.source = current.utm_source
    current.medium = current.utm_medium || 'unknown'
  }
  const pageTouch = { ...current }
  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    }
    catch { return null }
  }
  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    }
    catch { /* Storage denial must never prevent a claim submission. */ }
  }
  function remove(key) {
    try {
      localStorage.removeItem(key)
    }
    catch { /* Storage can be unavailable. */ }
  }
  function readCookie() {
    try {
      const raw = document.cookie.split(';').map(v => v.trim()).find(v => v.startsWith(`${cookieName}=`))
      return raw ? JSON.parse(decodeURIComponent(raw.slice(cookieName.length + 1))) : null
    }
    catch { return null }
  }
  function valid(choice) {
    return Boolean(choice) && ['granted', 'denied'].includes(choice.choice) && Date.parse(choice.at) + lifetime > now
  }
  let stored = readCookie()
  if (!valid(stored)) {
    // Carry over a choice made before the cookie existed, keeping its original 90 days.
    const legacy = read(legacyKeys.consent)
    const history = read(legacyKeys.attribution)
    stored = legacy?.expiresAt > now && valid(legacy) ? { choice: legacy.choice, at: legacy.at, migrated: true } : null
    if (stored?.choice === 'granted' && history?.expiresAt > now)
      Object.assign(stored, { first: history.first || null, lastNonDirect: history.lastNonDirect || null })
  }
  remove(legacyKeys.consent)
  remove(legacyKeys.attribution)
  let consent = stored && { choice: stored.choice, at: stored.at }
  let state = { first: current, lastNonDirect: current.source === 'direct' ? null : current, current }
  function persist() {
    try {
      const body = { choice: consent.choice, at: consent.at }
      if (consent.choice === 'granted')
        Object.assign(body, { first: state.first, lastNonDirect: state.lastNonDirect })
      fetch('/api/measurement', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true, credentials: 'same-origin' }).catch(() => {})
    }
    catch { /* Without the cookie the visitor is simply asked again; the form still works. */ }
  }
  let googleLoaded = false
  let panel
  window.dataLayer = window.dataLayer || []
  function tag(...args) {
    window.dataLayer.push(args)
  }
  tag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
  function loadGoogle() {
    window[`ga-disable-${measurementId}`] = false
    if (googleLoaded || !/^G-[A-Z0-9]+$/.test(measurementId))
      return
    googleLoaded = true
    tag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'denied', ad_personalization: 'denied' })
    tag('js', new Date())
    tag('config', measurementId, {
      page_location: current.landing,
      page_referrer: current.referrer || '',
      campaign_source: current.source,
      campaign_medium: current.medium,
      campaign_name: current.utm_campaign || '',
      campaign_content: current.utm_content || '',
      campaign_term: current.utm_term || '',
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })
    const loader = document.createElement('script')
    loader.async = true
    loader.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(loader)
  }
  function accept(chosen) {
    const previous = chosen ? null : stored
    const session = read(sessionKey)
    // Internal page browsing stays in the same acquisition session. After 30 minutes
    // of inactivity a direct return is a new direct session, while first/last persist.
    const carriesSession = current.source === 'direct' && session?.lastSeen > now - sessionLength && session.current
    if (carriesSession) {
      const landing = current.landing
      const at = current.at
      Object.assign(current, session.current, { landing, at })
    }
    if (previous?.first) {
      state.first = previous.first
      state.lastNonDirect = carriesSession || current.source === 'direct' ? previous.lastNonDirect || null : current
    }
    save(sessionKey, { current, lastSeen: now })
    // Write the cookie only when the long-lived touches change, not on every page view.
    if (chosen || previous?.migrated || JSON.stringify([state.first, state.lastNonDirect]) !== JSON.stringify([previous?.first, previous?.lastNonDirect]))
      persist()
    loadGoogle()
  }
  if (consent?.choice === 'granted')
    accept(false)
  else
    remove(sessionKey)
  if (consent?.choice === 'denied' && stored.migrated)
    persist()
  function input(form, name, value) {
    let field = form.querySelector(`input[name="${name}"]`)
    if (!field) {
      field = document.createElement('input')
      field.type = 'hidden'
      field.name = name
      form.appendChild(field)
    }
    field.value = value
  }
  for (const form of document.querySelectorAll('form[action="/api/claim-review"]')) {
    form.addEventListener('submit', () => {
      const existing = form.querySelector('input[name="Intake ID"]')?.value
      input(form, 'Intake ID', existing || crypto.randomUUID())
      const granted = consent?.choice === 'granted'
      input(form, 'Measurement consent', granted ? 'granted' : (consent?.choice || 'unset'))
      input(form, 'Attribution', JSON.stringify(granted ? state : { current: pageTouch }))
    })
  }
  function choose(choice) {
    consent = { choice, at: new Date().toISOString() }
    if (choice === 'granted') {
      accept(true)
    }
    else {
      for (const key of Object.keys(current))
        delete current[key]
      Object.assign(current, pageTouch)
      state = { first: current, lastNonDirect: null, current }
      persist()
      window[`ga-disable-${measurementId}`] = true
      remove(sessionKey)
      tag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
      // Clear measurement cookies set by this integration, including parent-domain cookies.
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.trim().split('=')[0]
        if (!/^(?:_ga|_gcl_)/.test(name))
          continue
        document.cookie = `${name}=; Max-Age=0; Path=/`
        const parts = location.hostname.split('.')
        for (let i = 0; i < parts.length - 1; i++)
          document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${parts.slice(i).join('.')}`
      }
    }
    panel.hidden = true
  }
  panel = document.createElement('section')
  panel.className = 'measurement-consent'
  panel.setAttribute('aria-label', 'Website measurement preferences')
  panel.innerHTML = '<p>May we save how you found us and measure visits to improve our website and campaigns? Your claim review works either way. <a href="/privacy-policy/">Privacy policy</a></p><div><button type="button" data-choice="granted">Allow measurement</button><button type="button" data-choice="denied">Decline</button></div>'
  panel.hidden = Boolean(consent)
  for (const button of panel.querySelectorAll('button'))
    button.addEventListener('click', () => choose(button.getAttribute('data-choice')))
  document.body.appendChild(panel)
  for (const button of document.querySelectorAll('[data-measurement-settings]')) {
    button.hidden = false
    button.addEventListener('click', () => {
      panel.hidden = false
      panel.querySelector('button').focus()
    })
  }
  // Only a backend-issued receipt on a successful redirect can trigger generate_lead.
  // Consume it even without consent, so later visits/refreshes do not become fake conversions.
  if (location.pathname === '/thank-you-page/') {
    const receipt = document.cookie.split(';').map(v => v.trim()).find(v => v.startsWith('__Host-melo_receipt='))?.split('=')[1]
    document.cookie = '__Host-melo_receipt=; Max-Age=0; Path=/; Secure; SameSite=Strict'
    if (receipt && /^[a-f0-9-]{36}$/.test(receipt) && consent?.choice === 'granted' && googleLoaded)
      tag('event', 'generate_lead', { event_id: receipt, lead_id: receipt, send_to: measurementId })
  }
  document.addEventListener('click', (event) => {
    if (consent?.choice === 'granted' && googleLoaded && event.target.closest?.('a[href^="tel:"]'))
      tag('event', 'phone_click', { send_to: measurementId })
  })
})()
