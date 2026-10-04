<script setup lang="ts">
import { business, secondOpinion } from '#site'

/*
 * The cyan band over the footer of most pages on the old site, in its two wordings (site.ts):
 * the home page's and every other page's. A wording with selling points shows them and a phone
 * button; one without ends its text with a "Call us at" link instead.
 */
const props = withDefaults(defineProps<{
  variant?: 'home' | 'page'
}>(), {
  variant: 'page',
})

const band = computed(() => secondOpinion[props.variant])
</script>

<template>
  <section aria-labelledby="second-opinion-heading" class="on-brand">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div class="max-w-3xl">
        <h2 id="second-opinion-heading" class="font-heading text-3xl font-bold text-ink sm:text-4xl">
          {{ band.title }}
        </h2>
        <p class="mt-3 text-lg/relaxed text-ink">
          {{ band.text }}
          <a v-if="!band.points.length" :href="business.phoneHref" class="font-bold whitespace-nowrap underline underline-offset-2">Call us at {{ business.phone }}</a>
        </p>
        <ul v-if="band.points.length" class="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-medium text-ink">
          <li v-for="point in band.points" :key="point" class="flex items-center gap-2">
            <span class="icon-[carbon--checkmark-filled]" aria-hidden="true" />
            {{ point }}
          </li>
        </ul>
      </div>
      <div class="flex shrink-0 flex-wrap gap-3">
        <a
          v-if="band.points.length"
          :href="business.phoneHref"
          class="inline-flex items-center gap-2 border-2 border-ink px-6 py-3 text-sm font-bold tracking-[0.08em] text-ink uppercase transition-colors hover:bg-ink hover:text-brand"
        >
          <span class="icon-[carbon--phone-filled]" aria-hidden="true" />
          {{ business.phone }}
        </a>
        <PageCta kind="review" tone="dark" :label="band.cta" />
      </div>
    </div>
  </section>
</template>
