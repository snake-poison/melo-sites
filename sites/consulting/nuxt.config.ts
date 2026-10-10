import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../../layers/ui'],
  // Photos are resized and re-encoded at build time into AVIF and WebP, as on the Melo sites.
  modules: ['@nuxt/image'],
  image: {
    quality: 60,
    format: ['avif', 'webp'],
    screens: { 'xs': 400, 'sm': 640, 'md': 768, 'lg': 1024, 'xl': 1280, '2xl': 1536 },
  },
  // The page's CSS goes in its HTML: no stylesheet request before first paint.
  features: { inlineStyles: true },
  vite: { plugins: [tailwindcss() as unknown as never] },
  nitro: { publicAssets: [{ dir: fileURLToPath(new URL('../../layers/melo/public', import.meta.url)) }] },
  css: ['~/assets/css/site.css'],
  routeRules: { '/**': { prerender: true, noScripts: true } },
  app: { head: { htmlAttrs: { lang: 'en' }, link: [{ rel: 'icon', type: 'image/svg+xml', href: '/logo-mark.svg' }], meta: [{ name: 'theme-color', content: '#102a68' }] } },
  typescript: { tsConfig: { compilerOptions: { paths: {
    '~/constants/tones': ['../../../layers/ui/app/constants/tones'],
    '~/constants/icons': ['../../../layers/ui/app/constants/icons'],
    '@/constants/icons': ['../../../layers/ui/app/constants/icons'],
    '~/types/ui/uiTypes': ['../../../layers/ui/app/types/ui/uiTypes'],
  } } } },
  compatibilityDate: '2026-10-01',
})
