<script setup lang="ts">
const route = useRoute()
const isConfirmation = computed(() => route.path.replace(/\/$/, '') === '/thank-you-page')
</script>

<template>
  <div class="machine-root flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-sm focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
    >
      Skip to content
    </a>

    <SiteHeader :quiet="isConfirmation" />

    <main id="main" class="flex-1">
      <slot />
    </main>

    <SiteFooter :compact="isConfirmation" />
    <CallBar v-if="!isConfirmation" />
  </div>
</template>
