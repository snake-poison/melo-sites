<script setup lang="ts">
import { credentials } from '#site'

/** The site's credentials, in a strip under the hero of every page with the claim form. */
</script>

<template>
  <section aria-label="Why us" class="border-b border-rule-soft bg-paper-2">
    <ul class="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
      <li v-for="item in credentials" :key="item.title" class="flex items-start gap-3.5">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-2xl text-accent" aria-hidden="true">
          <span :class="item.icon" />
        </span>
        <span>
          <span class="block font-heading text-base font-bold text-ink">{{ item.title }}</span>
          <span class="mt-0.5 block text-sm/snug text-ink-soft">{{ item.text }}</span>
        </span>
      </li>
    </ul>
  </section>
</template>
