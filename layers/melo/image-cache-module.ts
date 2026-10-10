import { defineNuxtModule, useLogger } from 'nuxt/kit'
import { restoreImages, saveImages } from './image-cache'

export default defineNuxtModule({
  meta: { name: 'melo-image-cache' },
  setup(_, nuxt) {
    let active = false
    let prerenderSucceeded = false
    const logger = useLogger('image-cache')
    nuxt.hook('nitro:config', (config) => {
      // Non-root previews and non-static builds retain the ordinary generation path.
      if (nuxt.options._generate !== true || nuxt.options.app.baseURL !== '/')
        return
      active = true
      const cached = restoreImages(nuxt.options.rootDir)
      config.publicAssets ??= []
      config.publicAssets.push({ dir: cached.dir, baseURL: '/', fallthrough: true })
      config.prerender ??= {}
      config.prerender.ignore ??= []
      config.prerender.ignore.push(route => cached.routes.has(route))
      logger.info(`Reusing ${cached.routes.size} unchanged image variants; missing or changed images will be generated.`)
    })
    nuxt.hook('nitro:init', (nitro) => {
      nitro.hooks.hook('prerender:done', ({ failedRoutes }) => {
        prerenderSucceeded = failedRoutes.length === 0
      })
    })
    // Nuxt copies the original and cached public assets after prerender:done, during
    // the final Nitro build. Save only after that copy, when all published bytes exist.
    nuxt.hook('nitro:build:public-assets', (nitro) => {
      if (active && prerenderSucceeded) {
        const count = saveImages(nuxt.options.rootDir, nitro.options.output.publicDir)
        logger.info(`Saved ${count} validated image variants.`)
      }
    })
  },
})
