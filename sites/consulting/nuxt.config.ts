import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  extends: ['../../layers/ui'],
  vite: { plugins: [tailwindcss() as unknown as never] },
  css: ['~/assets/css/site.css'],
  routeRules: { '/**': { prerender: true, experimental: { noScripts: true } } },
  app: { head: { htmlAttrs: { lang: 'en' }, title: 'Property Claims Consulting | Appraisal Umpire Services', meta: [{ name: 'description', content: 'Property Claims Consulting, part of the Melo brand. Umpire services for property insurance appraisal disputes. Inquire about availability and assignment review.' }], link: [{ rel: 'canonical', href: 'https://propertyclaimsconsulting.net/' }] } },
  typescript: { tsConfig: { compilerOptions: { paths: {
    '~/constants/tones': ['../../../layers/ui/app/constants/tones'],
    '~/constants/icons': ['../../../layers/ui/app/constants/icons'],
    '@/constants/icons': ['../../../layers/ui/app/constants/icons'],
    '~/types/ui/uiTypes': ['../../../layers/ui/app/types/ui/uiTypes'],
  } } } },
  compatibilityDate: '2026-10-01',
})
