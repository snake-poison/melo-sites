<script setup lang="ts">
import { business } from '#site'

// The old site's floating call button: on a phone, the number is one tap away on every page.
</script>

<template>
  <div class="sticky bottom-0 z-30 bg-charcoal-2 p-2 sm:hidden">
    <div class="grid grid-cols-2 gap-2">
      <a :href="business.phoneHref" class="flex items-center justify-center gap-2 bg-brand py-3 text-sm font-bold tracking-[0.06em] text-charcoal uppercase">
        <span class="icon-[carbon--phone-filled]" aria-hidden="true" />
        Call 24/7
      </a>
      <NuxtLink to="/contact/" class="flex items-center justify-center border border-on-dark/40 py-3 text-sm font-bold tracking-[0.06em] text-on-dark uppercase">
        Free claim review
      </NuxtLink>
    </div>
  </div>
</template>
