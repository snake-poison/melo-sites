<script setup lang="ts">
/**
 * A photo cut differently per screen, which NuxtPicture cannot do: it gives every width the one
 * aspect ratio, so a full-bleed photo cut for a desktop's wide band reached a phone's tall box
 * a few hundred pixels wide and was stretched to fill it. Each crop is a <source> with its own
 * media query, widths and ratio (height over width), in AVIF and WebP, with a JPEG fallback.
 *
 * With `priority` (the photo the page opens on) each crop is preloaded under its media query, so
 * the browser fetches the one it will show as soon as it reads the head, ahead of the CSS and
 * fonts. Built pages carry these files as static ones: this tells the prerenderer about them, as
 * NuxtPicture does for its own.
 */
export interface Crop {
  media: string
  /** The widths to offer, in pixels: enough to cover the screens the media query matches at 1x and 2x. */
  widths: number[]
  ratio: number
  sizes: string
}

const props = withDefaults(defineProps<{
  src: string
  alt?: string
  crops: Crop[]
  quality?: number
  priority?: boolean
  imgClass?: string
}>(), {
  alt: '',
  quality: 60,
  priority: false,
  imgClass: undefined,
})

const img = useImage()

function url(width: number, ratio: number, format: string): string {
  return img(props.src, { width, height: Math.round(width * ratio), format, quality: props.quality })
}
function srcset(crop: Crop, format: string): string {
  return crop.widths.map(width => `${url(width, crop.ratio, format)} ${width}w`).join(', ')
}

const sources = ['avif', 'webp'].flatMap(format => props.crops.map(crop => ({
  key: `${format}${crop.media}`,
  media: crop.media,
  type: `image/${format}`,
  srcset: srcset(crop, format),
  sizes: crop.sizes,
})))
const widest = props.crops.at(-1)!
const fallback = url(widest.widths.at(-1)!, widest.ratio, 'jpeg')

if (props.priority) {
  useHead({
    // Ahead of the inlined CSS in the head, so the fetch starts on the first bytes of the page.
    link: props.crops.map(crop => ({
      tagPriority: 5,
      rel: 'preload',
      as: 'image',
      type: 'image/avif',
      media: crop.media,
      imagesrcset: srcset(crop, 'avif'),
      imagesizes: crop.sizes,
      fetchpriority: 'high',
    })),
  })
}

if (import.meta.server && import.meta.prerender) {
  const response = useRequestEvent()?.node.res
  if (response != null) {
    const paths = [fallback, ...sources.flatMap(source => source.srcset.split(', ').map(entry => entry.split(' ')[0]!))]
    const current = response.getHeader('x-nitro-prerender')
    response.setHeader('x-nitro-prerender', [current, ...paths.map(path => encodeURIComponent(path))].filter(Boolean).join(', '))
  }
}
</script>

<template>
  <picture>
    <source v-for="source in sources" :key="source.key" :media="source.media" :type="source.type" :srcset="source.srcset" :sizes="source.sizes">
    <img
      :src="fallback"
      :alt="props.alt"
      :class="props.imgClass"
      :loading="props.priority ? 'eager' : 'lazy'"
      :fetchpriority="props.priority ? 'high' : undefined"
      decoding="async"
    >
  </picture>
</template>
