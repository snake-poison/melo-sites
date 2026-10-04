import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

/** A path inside this layer. `~` in a layer's config is the app's srcDir, not the layer's. */
function here(path: string): string {
  return fileURLToPath(new URL(path, import.meta.url))
}

/*
 * Avow's design system as a Nuxt layer: the machine-style tokens, the self-hosted fonts and the
 * shared atoms. Nuxt extends every directory under layers/ on its own. README.md here says where
 * each file comes from and how to keep it in step with Avow.
 */
export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode'],

  css: [
    here('./app/assets/css/fonts.css'),
    here('./app/assets/css/tokens.css'),
  ],

  components: [
    { path: here('./app/components'), pathPrefix: false },
  ],

  // The atoms import ~/constants/tones and the like, as in Avow. Nuxt resolves `~` in a
  // layer's files to the layer when it builds; TypeScript resolves it to the app, so these
  // more specific paths point it here. Relative to .nuxt/.
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '~/constants/tones': ['../layers/ui/app/constants/tones'],
          '~/constants/icons': ['../layers/ui/app/constants/icons'],
          '@/constants/icons': ['../layers/ui/app/constants/icons'],
          '~/types/ui/uiTypes': ['../layers/ui/app/types/ui/uiTypes'],
        },
      },
    },
  },
})
