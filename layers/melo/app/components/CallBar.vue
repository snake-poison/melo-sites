<script setup lang="ts">
import { business } from '#site'

// On a phone, the number and the form are one tap away on every page, in a bar at the foot.
const reviewHref = await useClaimFormHref()
</script>

<template>
  <div class="sticky bottom-0 z-30 border-t border-on-dark/10 bg-navy-2/95 p-2 backdrop-blur-sm sm:hidden">
    <div class="grid grid-cols-2 gap-2">
      <a :href="business.phoneHref" class="flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-base font-bold text-charcoal">
        <span class="icon-[carbon--phone-filled]" aria-hidden="true" />
        Call now, free
      </a>
      <a :href="reviewHref" class="flex items-center justify-center rounded-xl py-3 text-base font-bold text-on-dark ring-1 ring-on-dark/40">
        Free claim review
      </a>
    </div>
  </div>
</template>
