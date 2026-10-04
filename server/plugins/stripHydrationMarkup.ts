/**
 * Server HTML carries markup for the client runtime to hydrate: Vue's fragment and empty-v-if
 * comments (`<!--[-->`, `<!--]-->`, `<!---->`) and @nuxt/image's error hook and markers on each
 * image. Pages here ship no runtime (routeRules noScripts), so nothing reads any of it, and it
 * is a few hundred bytes of every page, compressed.
 */
const runtimeOnly = /<!--\[-->|<!--\]-->|<!---->| onerror="this\.setAttribute\(&#39;data-error&#39;, 1\)"| data-nuxt-(?:img|pic)(?=[\s>])/g

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.body = html.body.map(part => part.replace(runtimeOnly, ''))
  })
})
