<script setup lang="ts">
import { business } from '#site'

/**
 * The top of a page: its one h1, centred over the page's header photo under a dark veil, as the
 * old site opened every page. The photo is the page's share image too.
 */
const props = withDefaults(defineProps<{
  title: string
  kicker?: string
  lead?: string
  image?: string
  /** The call-to-action buttons; off for pages that are not selling anything (thanks). */
  actions?: boolean
  /** The claims review button's words: the home page's differ from the rest. */
  reviewLabel?: string
}>(), {
  kicker: undefined,
  lead: undefined,
  image: undefined,
  actions: true,
  reviewLabel: 'Get A Claim Review',
})
</script>

<template>
  <section class="relative isolate overflow-hidden bg-charcoal-2 text-on-dark">
    <NuxtPicture
      v-if="props.image"
      :src="props.image"
      sizes="xs:100vw lg:1600px"
      width="1600"
      height="600"
      class="absolute inset-0 -z-10"
      :img-attrs="{
        alt: '',
        class: 'size-full object-cover',
        loading: 'eager',
        fetchpriority: 'high',
        decoding: 'async',
      }"
    />
    <div class="absolute inset-0 -z-10 bg-charcoal-2/60" aria-hidden="true" />

    <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-32">
      <div class="mx-auto max-w-4xl text-center">
        <p v-if="props.kicker" class="text-sm font-medium tracking-[0.08em] uppercase sm:text-base">
          {{ props.kicker }}
        </p>
        <h1 class="mt-3 font-heading text-4xl/[1.1] font-bold text-balance sm:text-5xl/[1.1] lg:text-[3.5rem]/[1.1]">
          {{ props.title }}
        </h1>
        <p v-if="props.lead" class="mx-auto mt-6 max-w-2xl text-lg/relaxed text-pretty text-on-dark/90">
          {{ props.lead }}
        </p>
        <div v-if="props.actions" class="mt-10 flex flex-wrap justify-center gap-4">
          <PageCta kind="review" :label="props.reviewLabel" />
          <PageCta kind="call" :label="`Call ${business.phone}`" tone="light" />
        </div>
      </div>
    </div>
  </section>
</template>
