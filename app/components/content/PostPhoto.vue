<script setup lang="ts">
/**
 * A photo with its caption and credit. In Markdown:
 *
 *   ::post-photo{src="/images/blog/x/y.jpg" alt="…" credit="Name / FEMA" credit-url="https://…"}
 *   The caption.
 *   ::
 *
 * Cropped to 3:2 so the page never jumps while it loads, and served as AVIF or WebP at the
 * width the reader's screen needs.
 */
const props = withDefaults(defineProps<{
  src: string
  alt: string
  credit?: string
  creditUrl?: string
  /** The post's lead photo: loaded first, at the width of the page rather than the column. */
  lead?: boolean
}>(), {
  credit: undefined,
  creditUrl: undefined,
  lead: false,
})
</script>

<template>
  <figure class="post-photo">
    <NuxtPicture
      :src="props.src"
      :sizes="props.lead ? 'xs:100vw lg:1024px' : 'xs:100vw md:720px'"
      width="1200"
      height="800"
      :img-attrs="{
        alt: props.alt,
        class: 'aspect-3/2 w-full border border-rule-soft bg-paper-2 object-cover',
        loading: props.lead ? 'eager' : 'lazy',
        fetchpriority: props.lead ? 'high' : 'auto',
        decoding: 'async',
      }"
    />
    <figcaption v-if="$slots.default || props.credit" class="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <UIText v-if="$slots.default" as="span" variant="small" class="max-w-prose [&_p]:inline">
        <slot />
      </UIText>
      <UIText v-if="props.credit" as="span" variant="label" class="shrink-0">
        Photo:
        <a v-if="props.creditUrl" :href="props.creditUrl" class="underline-offset-2 hover:text-ink hover:underline" rel="noopener">{{ props.credit }}</a>
        <template v-else>
          {{ props.credit }}
        </template>
      </UIText>
    </figcaption>
  </figure>
</template>
