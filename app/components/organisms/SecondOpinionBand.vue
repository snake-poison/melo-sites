<script setup lang="ts">
import { business } from '~/constants/site'

/*
 * The cyan band over the footer of most pages on the old site, in its two wordings: the home
 * page's, with its three selling points, and every other page's.
 */
const props = withDefaults(defineProps<{
  variant?: 'home' | 'page'
}>(), {
  variant: 'page',
})
</script>

<template>
  <section aria-labelledby="second-opinion-heading" class="on-brand">
    <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div class="max-w-3xl">
        <h2 id="second-opinion-heading" class="font-heading text-3xl font-bold text-ink sm:text-4xl">
          Get a Second Opinion on Your Claim, for FREE!
        </h2>
        <template v-if="props.variant === 'home'">
          <p class="mt-3 text-lg/relaxed text-ink">
            It never hurts to have another expert on your side, especially with large insurance claims.
          </p>
          <ul class="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-medium text-ink">
            <li v-for="point in ['Licensed Public Adjusters', 'Experienced & Skilled', 'No Up-Front Fees']" :key="point" class="flex items-center gap-2">
              <span class="icon-[carbon--checkmark-filled]" aria-hidden="true" />
              {{ point }}
            </li>
          </ul>
        </template>
        <p v-else class="mt-3 text-lg/relaxed text-ink">
          Melo Public Adjusters Charlotte will do all that they can to ensure the insurance companies
          are treating you fairly! <a :href="business.phoneHref" class="font-bold whitespace-nowrap underline underline-offset-2">Call us at {{ business.phone }}</a>
        </p>
      </div>
      <div class="flex shrink-0 flex-wrap gap-3">
        <a
          v-if="props.variant === 'home'"
          :href="business.phoneHref"
          class="inline-flex items-center gap-2 border-2 border-ink px-6 py-3 text-sm font-bold tracking-[0.08em] text-ink uppercase transition-colors hover:bg-ink hover:text-brand"
        >
          <span class="icon-[carbon--phone-filled]" aria-hidden="true" />
          {{ business.phone }}
        </a>
        <PageCta kind="review" tone="dark" :label="props.variant === 'home' ? 'Get Started Now' : 'Get A Claims Review'" />
      </div>
    </div>
  </section>
</template>
