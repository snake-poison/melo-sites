<script setup lang="ts">
import { siteName } from '#site'

const route = useRoute()

// Every page names its own URL as canonical: the site origin, the base path, the trailing slash.
const canonical = withSiteUrl(computed(() => route.path), { withBase: true })

useHead({
  // Each page sets its whole <title>, word for word what WordPress had (`metaTitle`), so nothing
  // is appended to it.
  titleTemplate: title => title || siteName,
  link: [{ rel: 'canonical', href: canonical }],
})
useSeoMeta({
  ogUrl: canonical,
  ogSiteName: siteName,
  ogLocale: 'en_US',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
