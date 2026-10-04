<script setup lang="ts">
import { business, howItWorks, reviews } from '#site'

/**
 * Why to send the form, under a service page's first sections (or where its body marks
 * `:page-claim-review`): a claim's three steps with the fee stated, then clients' own words on
 * navy. A site with no review to quote links to its Google reviews instead.
 */
</script>

<template>
  <section aria-labelledby="how-it-works-heading" class="bg-paper-2 py-16 sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <UIText variant="kicker" as="p" class="text-accent">
        How it works
      </UIText>
      <h2 id="how-it-works-heading" class="mt-2 max-w-2xl font-heading text-3xl/tight font-bold text-ink sm:text-4xl/tight">
        {{ howItWorks.title }}
      </h2>
      <ol class="mt-10 grid gap-5 md:grid-cols-3">
        <li v-for="(step, index) in howItWorks.steps" :key="step.title" class="rounded-2xl border border-rule-soft bg-paper p-6 sm:p-8">
          <span class="flex size-12 items-center justify-center rounded-xl bg-navy font-heading text-xl font-bold text-brand dark:bg-accent-soft" aria-hidden="true">
            {{ index + 1 }}
          </span>
          <h3 class="mt-5 font-heading text-xl font-bold text-ink">
            {{ step.title }}
          </h3>
          <p class="mt-2 text-base/relaxed text-ink-soft">
            {{ step.text }}
          </p>
        </li>
      </ol>
      <div class="mt-10 flex flex-wrap items-center gap-3">
        <PageCta kind="review" label="Get my free claim review" />
        <PageCta kind="call" :label="`Call ${business.phone}`" />
      </div>
    </div>
  </section>

  <section aria-labelledby="reviews-heading" class="bg-navy py-16 text-on-dark sm:py-20">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6" :class="reviews.length ? 'lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-center' : 'text-center'">
      <div>
        <p class="text-2xl tracking-[0.15em] text-star" role="img" aria-label="Five stars">
          ★★★★★
        </p>
        <h2 id="reviews-heading" class="mt-3 font-heading text-3xl font-bold">
          Rated five stars on Google and Facebook
        </h2>
        <a :href="business.mapUrl" rel="noopener" class="mt-5 inline-flex items-center gap-2 font-semibold text-brand underline-offset-4 hover:underline">
          Read our reviews on Google
          <span class="icon-[carbon--arrow-right]" aria-hidden="true" />
        </a>
      </div>
      <ul v-if="reviews.length" class="grid gap-5" :class="reviews.length > 1 ? 'md:grid-cols-2' : ''">
        <li v-for="review in reviews" :key="review.name">
          <figure class="flex h-full flex-col rounded-2xl bg-on-dark/6 p-6 ring-1 ring-on-dark/12 sm:p-8">
            <span class="icon-[carbon--quotes] text-3xl text-brand" aria-hidden="true" />
            <blockquote class="mt-3 flex-1 text-lg/relaxed">
              {{ review.quote }}
            </blockquote>
            <figcaption class="mt-5 text-sm">
              <span class="font-semibold">{{ review.name }}</span>
              <span v-if="review.source" class="text-on-dark/70"> · {{ review.source }}</span>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>
</template>
