<script setup lang="ts">
/**
 * A section of a page with its photos beside it, the way the old site set its service copy.
 * In Markdown:
 *
 *   ::page-section{image="/wp-content/uploads/…" alt="…" image2="…" alt2="…" reverse}
 *   ## The heading
 *   The copy.
 *   ::
 *
 * As there, it is a white box, copy on one half and the photo filling the other to the box's
 * edge: to the right, or the left with `reverse`; above the copy on phones. `plain` drops the
 * box and shows the photo whole, for a chart, with `caption` under it. `video` is a YouTube
 * video's id, shown in the photo's place; its poster is public/images/video/<id>.webp. `checks`
 * marks its lists with ticks instead of bullets.
 */
const props = withDefaults(defineProps<{
  image?: string
  alt?: string
  image2?: string
  alt2?: string
  reverse?: boolean
  plain?: boolean
  caption?: string
  video?: string
  videoTitle?: string
  checks?: boolean
}>(), {
  image: undefined,
  alt: '',
  image2: undefined,
  alt2: '',
  reverse: false,
  plain: false,
  caption: undefined,
  video: undefined,
  videoTitle: 'Video',
  checks: false,
})

const photos = [
  { src: props.image, alt: props.alt },
  { src: props.image2, alt: props.alt2 },
].filter((photo): photo is { src: string, alt: string } => photo.src != null)
const hasMedia = photos.length > 0 || props.video != null
const boxed = hasMedia && !props.plain

/*
 * The video waits for a click, with no script: the frame first holds a page of its own (srcdoc,
 * which resolves URLs against this page) that is the video's poster, linking to YouTube's
 * player. Nothing of YouTube's loads until the visitor asks, and then it plays in place.
 */
const videoDoc = props.video == null
  ? undefined
  : '<style>*{margin:0}a{display:block;position:relative;height:100vh}img{width:100%;height:100%;object-fit:cover}'
    + 'span{position:absolute;inset:0;margin:auto;width:68px;height:48px;border-radius:12px;background:#f00}'
    + 'span::after{content:"";position:absolute;left:27px;top:14px;border:10px solid transparent;border-left:16px solid #fff}</style>'
    + `<a href="https://www.youtube-nocookie.com/embed/${props.video}?autoplay=1" aria-label="Play: ${props.videoTitle}">`
    + `<img src="/images/video/${props.video}.webp" alt=""><span></span></a>`

// Boxed, the photo comes first on phones; side by side, `reverse` puts it on the left.
const bodyOrder = [
  boxed ? 'order-last' : '',
  props.reverse ? 'md:order-last' : 'md:order-first',
]
</script>

<template>
  <section
    class="page-section grid"
    :class="[
      hasMedia ? 'md:grid-cols-2' : '',
      boxed ? 'page-section--boxed overflow-hidden bg-paper-2 shadow-xl shadow-ink/8' : 'gap-8 md:items-center md:gap-12',
      props.checks ? 'page-section--checks' : '',
    ]"
  >
    <div class="page-section__body min-w-0" :class="[bodyOrder, boxed ? 'self-center p-6 sm:p-10' : '']">
      <slot />
    </div>
    <div v-if="props.video" :class="boxed ? 'self-center p-6 sm:p-10' : ''">
      <iframe
        :srcdoc="videoDoc"
        :title="props.videoTitle"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
        loading="lazy"
        class="aspect-video w-full"
      />
    </div>
    <figure v-else-if="photos.length > 0" class="grid" :class="[photos.length > 1 ? 'grid-cols-2 md:grid-cols-1' : '', props.plain ? 'gap-4' : '']">
      <NuxtPicture
        v-for="photo in photos"
        :key="photo.src"
        :src="photo.src"
        sizes="xs:100vw md:576px"
        width="576"
        height="432"
        :class="props.plain ? 'block' : 'relative block min-h-64'"
        :img-attrs="{
          alt: photo.alt,
          class: props.plain ? 'h-auto w-full' : 'absolute inset-0 size-full bg-paper object-cover',
          loading: 'lazy',
          decoding: 'async',
        }"
      />
      <figcaption v-if="props.caption" class="text-sm text-ink-faint">
        {{ props.caption }}
      </figcaption>
    </figure>
  </section>
</template>
