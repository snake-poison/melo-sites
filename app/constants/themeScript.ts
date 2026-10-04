/**
 * The only script the site ships. Pages render with no Nuxt runtime (routeRules in
 * nuxt.config.ts), so this does what the color-mode module and UIThemeToggle's click handler
 * would do after hydration. It goes into the head as source text, so it must not close over
 * anything outside itself.
 *
 * The site is light, as the old one was, whatever the system's setting; dark is for whoever
 * picks it with the toggle. It runs before the inlined styles, so that reader never sees a
 * light first frame. The key is the color-mode module's, the one UIThemeToggle would write.
 */
export function themeScript(): void {
  const KEY = 'nuxt-color-mode'
  const root = document.documentElement
  root.classList.toggle('dark', localStorage.getItem(KEY) === 'dark')

  // UIThemeToggle is Avow's atom, kept as it is, so it is found by its accessible name.
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || event.target.closest('[aria-label="Toggle dark mode"]') == null)
      return
    const dark = root.classList.toggle('dark')
    localStorage.setItem(KEY, dark ? 'dark' : 'light')
  })
}
