/* Small, framework-free measurement for the static sites. No customer form values enter analytics. */
(function () {
  const script = document.currentScript
  const measurementId = script?.getAttribute('data-ga4') || ''
  const consentKey = 'melo.measurement-consent.v1'
  const attributionKey = 'melo.attribution.v1'
  const lifetime = 90 * 24 * 60 * 60 * 1000
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
  let consent = read(consentKey)
  if (!consent || consent.expiresAt <= now || !['granted', 'denied'].includes(consent.choice)) {
    consent = null
    remove(consentKey)
    remove(attributionKey)
  }
  let state = { first: current, lastNonDirect: current.source === 'direct' ? null : current, current, lastSeen: now, expiresAt: now + lifetime }
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
  function accept() {
    const previous = read(attributionKey)
    if (previous?.expiresAt > now && previous.first) {
      // Internal page browsing stays in the same acquisition session. After 30 minutes
      // of inactivity a direct return is a new direct session, while first/last persist.
      if (current.source === 'direct' && previous.lastSeen > now - 30 * 60 * 1000 && previous.current) {
        const landing = current.landing
        const at = current.at
        Object.assign(current, previous.current, { landing, at })
      }
      state.first = previous.first
      state.lastNonDirect = current.source === 'direct' ? previous.lastNonDirect : current
    }
    save(attributionKey, state)
    loadGoogle()
  }
  if (consent?.choice === 'granted')
    accept()
  else
    remove(attributionKey)
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
      input(form, 'Attribution', JSON.stringify(granted ? state : { current }))
    })
  }
  function choose(choice) {
    consent = { choice, expiresAt: Date.now() + lifetime, at: new Date().toISOString() }
    save(consentKey, consent)
    if (choice === 'granted') {
      accept()
    }
    else {
      state = { first: current, lastNonDirect: null, current, lastSeen: now, expiresAt: now + lifetime }
      window[`ga-disable-${measurementId}`] = true
      remove(attributionKey)
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
