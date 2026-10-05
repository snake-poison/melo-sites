<script setup lang="ts">
import { business, secondOpinion } from '#site'

/*
 * The cyan panel over the footer of most pages, in the old site's two wordings (site.ts): the
 * home page's and every other page's. A wording with selling points ticks them off; one
 * without ends its text with a "Call us at" link instead. Both offer the form and the phone.
 */
const props = withDefaults(defineProps<{
  variant?: 'home' | 'page'
}>(), {
  variant: 'page',
})

const band = computed(() => secondOpinion[props.variant])
</script>

<template>
  <section aria-labelledby="second-opinion-heading" class="px-4 py-16 sm:px-6 sm:py-20">
    <div class="on-brand relative mx-auto flex max-w-6xl flex-col gap-8 overflow-hidden rounded-3xl px-6 py-12 sm:px-12 lg:flex-row lg:items-center lg:justify-between">
      <span class="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-paper-2/20" aria-hidden="true" />
      <div class="relative max-w-2xl">
        <h2 id="second-opinion-heading" class="font-heading text-3xl/tight font-bold text-ink sm:text-4xl/tight">
          {{ band.title }}
        </h2>
        <p class="mt-3 text-lg/relaxed text-ink">
          {{ band.text }}
          <a v-if="!band.points.length" :href="business.phoneHref" class="font-bold whitespace-nowrap underline underline-offset-2">Call us at {{ business.phone }}</a>
        </p>
        <ul v-if="band.points.length" class="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-semibold text-ink">
          <li v-for="point in band.points" :key="point" class="flex items-center gap-2">
            <span class="icon-[carbon--checkmark-filled]" aria-hidden="true" />
            {{ point }}
          </li>
        </ul>
      </div>
      <div class="relative flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
        <PageCta kind="review" tone="dark" :label="band.cta" />
        <a
          :href="business.phoneHref"
          class="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold text-ink ring-2 ring-ink transition-colors ring-inset hover:bg-ink hover:text-brand"
        >
          <span class="icon-[carbon--phone-filled]" aria-hidden="true" />
          {{ business.phone }}
        </a>
      </div>
    </div>
  </section>
</template>
