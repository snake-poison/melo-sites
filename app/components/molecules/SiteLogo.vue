<script setup lang="ts">
import { siteName } from '~/constants/site'

/**
 * The Melo logo, the old site's own artwork. Its wordmark is navy, which a dark page would swallow,
 * so dark mode swaps in a copy with the wordmark light (public/images/brand/logo-dark.png).
 */
const props = withDefaults(defineProps<{
  /** The rendered height, in pixels; the width follows the logo's shape. */
  height?: number
}>(), {
  height: 40,
})

// public/images/brand/logo.png is 901 by 260.
const width = Math.round(props.height * 901 / 260)
</script>

<template>
  <span class="inline-flex shrink-0">
    <NuxtImg
      src="/images/brand/logo.png"
      :alt="siteName"
      :width="width"
      :height="props.height"
      densities="x1 x2"
      format="webp"
      class="dark:hidden"
    />
    <NuxtImg
      src="/images/brand/logo-dark.png"
      alt=""
      :width="width"
      :height="props.height"
      densities="x1 x2"
      format="webp"
      class="hidden dark:block"
    />
  </span>
</template>
