<script setup lang="ts">
import { logoSize, siteName } from '#site'

/**
 * The Melo logo, the old site's own artwork. Its wordmark is navy, which a dark page would swallow,
 * so dark mode swaps in a copy with the wordmark light (public/images/brand/logo-dark.png).
 * Both are lazy: the browser never fetches a lazy image it is not showing, so each reader loads
 * one logo, not both.
 */
const props = withDefaults(defineProps<{
  /** The rendered height, in pixels; the width follows the logo's shape. */
  height?: number
}>(), {
  height: 40,
})

const width = Math.round(props.height * logoSize.width / logoSize.height)
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
      loading="lazy"
      class="dark:hidden"
    />
    <NuxtImg
      src="/images/brand/logo-dark.png"
      alt=""
      :width="width"
      :height="props.height"
      densities="x1 x2"
      format="webp"
      loading="lazy"
      class="hidden dark:block"
    />
  </span>
</template>
