<script setup lang="ts">
import { business, heroPoints } from '#site'

/**
 * The end of a post, for the reader who came with a claim of their own: the free review and the
 * phone, with the site's promises. Readers arrive from search mid-problem.
 */
</script>

<template>
  <aside aria-labelledby="post-claim-cta-heading" class="overflow-hidden rounded-3xl bg-navy p-6 text-on-dark sm:p-10">
    <p class="text-sm font-semibold tracking-[0.12em] text-brand uppercase">
      Free claim review
    </p>
    <h2 id="post-claim-cta-heading" class="mt-2 font-heading text-2xl/tight font-bold sm:text-3xl/tight">
      Dealing with a claim right now?
    </h2>
    <ul class="mt-4 flex flex-col gap-2 text-base sm:flex-row sm:flex-wrap sm:gap-x-6">
      <li v-for="point in heroPoints" :key="point" class="flex items-center gap-2">
        <span class="icon-[carbon--checkmark-filled] shrink-0 text-brand" aria-hidden="true" />
        {{ point }}
      </li>
    </ul>
    <div class="mt-7 flex flex-wrap gap-3">
      <PageCta kind="review" label="Get my free claim review" />
      <PageCta kind="call" :label="`Call ${business.phone}`" tone="light" />
    </div>
  </aside>
</template>
