<script setup lang="ts">
import { business } from '#site'

defineProps<{
  title: string
}>()
</script>

<template>
  <section aria-labelledby="confirmation-heading" class="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-12">
    <UICard padding="lg" radius="2xl">
      <span class="mb-5 flex size-12 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent" aria-hidden="true">
        <span class="icon-[carbon--checkmark]" />
      </span>
      <UIHeading id="confirmation-heading" :level="1" size="xl">
        {{ title }}
      </UIHeading>
      <div class="mt-3 text-base/relaxed text-ink-soft">
        <slot />
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <NuxtLink
          to="/"
          class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-navy hover:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
        >
          Back to home
          <span class="icon-[carbon--arrow-right]" aria-hidden="true" />
        </NuxtLink>
        <a :href="business.phoneHref" :aria-label="`Call ${business.phone}`" class="inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent">
          <span class="icon-[carbon--phone]" aria-hidden="true" />
          {{ business.phone }}
        </a>
      </div>
    </UICard>
  </section>
</template>
