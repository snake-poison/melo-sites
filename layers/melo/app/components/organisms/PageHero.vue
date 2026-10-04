<script setup lang="ts">
import { business, googleRating, heroPoints } from '#site'

/**
 * The top of a page: its one h1 over the page's header photo under a navy veil. A page with the
 * claim form (`form`) splits: the heading, the promises and the phone on the left, the form card
 * on the right; on a phone the card follows the heading, below the photo. The photo is the
 * page's share image too.
 */
const props = withDefaults(defineProps<{
  title: string
  kicker?: string
  lead?: string
  image?: string
  /** The call-to-action buttons and promises; off for pages that are not selling anything (thanks). */
  actions?: boolean
  /** The claim form, in the hero's right half. */
  form?: boolean
}>(), {
  kicker: undefined,
  lead: undefined,
  image: undefined,
  actions: true,
  form: false,
})

// Under a navy veil, so a low quality does not show and halves the bytes of these detailed photos.
// Under the heading only on a phone, so near square; under the whole hero from 1024px, wide.
// Three crops at most: the page preloads one per screen, and test/site/budget.spec.ts counts them.
const heroCrops = [
  { media: '(max-width: 639px)', widths: [480, 800, 1080], ratio: 1.1, sizes: '100vw' },
  { media: '(min-width: 640px) and (max-width: 1279px)', widths: [1024, 1536, 2048], ratio: 0.65, sizes: '100vw' },
  { media: '(min-width: 1280px)', widths: [1600, 2400], ratio: 0.45, sizes: '100vw' },
]
</script>

<template>
  <section class="relative isolate">
    <div
      class="mx-auto grid max-w-6xl px-4 sm:px-6"
      :class="props.form ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:items-center lg:gap-14' : ''"
    >
      <!-- The text column holds the photo on a phone; from lg it lets the photo fill the section. -->
      <div class="relative py-14 text-on-dark sm:py-20 lg:static" :class="props.form ? 'pb-20 lg:py-24' : 'lg:py-28'">
        <div class="absolute -inset-x-4 inset-y-0 -z-10 bg-navy-2 sm:-inset-x-6 lg:inset-0" aria-hidden="true">
          <CropPicture
            v-if="props.image"
            :src="props.image"
            :crops="heroCrops"
            :quality="40"
            priority
            class="absolute inset-0"
            img-class="size-full object-cover"
          />
          <div class="absolute inset-0 bg-navy-2/75 lg:bg-transparent lg:bg-linear-to-r lg:from-navy-2/95 lg:via-navy-2/80 lg:to-navy-2/35" />
        </div>

        <div class="max-w-3xl">
          <p v-if="props.kicker" class="inline-flex items-center gap-2 rounded-full bg-on-dark/10 px-3.5 py-1.5 text-sm font-medium ring-1 ring-on-dark/20">
            <span class="size-2 rounded-full bg-brand" aria-hidden="true" />
            {{ props.kicker }}
          </p>
          <h1 class="mt-5 font-heading text-[2.125rem]/[1.1] font-bold text-balance sm:text-5xl/[1.08] lg:text-[3.25rem]/[1.06]">
            {{ props.title }}
          </h1>
          <p v-if="props.lead" class="mt-5 max-w-2xl text-lg/relaxed text-pretty text-on-dark/85">
            {{ props.lead }}
          </p>
          <!-- A post's date and reading time. -->
          <slot />

          <template v-if="props.actions">
            <ul class="mt-6 flex flex-col gap-2.5 text-base font-medium sm:flex-row sm:flex-wrap sm:gap-x-6">
              <li v-for="point in heroPoints" :key="point" class="flex items-center gap-2">
                <span class="icon-[carbon--checkmark-filled] shrink-0 text-lg text-brand" aria-hidden="true" />
                {{ point }}
              </li>
            </ul>

            <!-- With the form beside it, the hero offers the phone; without, both ways in. -->
            <div v-if="props.form" class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a :href="business.phoneHref" class="group flex items-center gap-3">
                <span class="flex size-12 items-center justify-center rounded-full bg-brand text-xl text-charcoal" aria-hidden="true">
                  <span class="icon-[carbon--phone-filled]" />
                </span>
                <span>
                  <span class="block text-sm text-on-dark/75">Call 24/7, free</span>
                  <span class="block font-heading text-2xl font-bold group-hover:underline sm:text-[1.75rem]">{{ business.phone }}</span>
                </span>
              </a>
              <a v-if="googleRating" :href="business.mapUrl" rel="noopener" class="text-sm text-on-dark/85 hover:text-on-dark">
                <span class="block"><span class="font-bold text-on-dark">{{ googleRating.value.toFixed(1) }}</span> <span class="tracking-[0.15em] text-star" aria-hidden="true">★★★★★</span></span>
                <span class="underline underline-offset-2">Read our Google reviews</span>
              </a>
            </div>
            <div v-else class="mt-9 flex flex-wrap gap-3">
              <PageCta kind="review" label="Get my free claim review" />
              <PageCta kind="call" :label="`Call ${business.phone}`" tone="light" />
            </div>
          </template>
        </div>
      </div>

      <div v-if="props.form" class="relative -mt-10 pb-4 lg:mt-0 lg:py-12">
        <ClaimIntake />
      </div>
    </div>
  </section>
</template>
