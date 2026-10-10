<script setup lang="ts">
import { business } from '#site'

defineProps<{
  title: string
  lead?: string
}>()
</script>

<template>
  <section aria-labelledby="confirmation-heading" class="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
    <UICard padding="lg" radius="2xl">
      <span class="mb-5 flex size-12 items-center justify-center rounded-full bg-accent-soft text-2xl text-accent" aria-hidden="true">
        <span class="icon-[carbon--checkmark]" />
      </span>
      <UIHeading id="confirmation-heading" :level="1" size="xl">
        {{ title }}
      </UIHeading>
      <UIText v-if="lead" class="mt-3">
        {{ lead }}
      </UIText>

      <div class="mt-7 border-t border-rule-soft pt-6">
        <UIHeading :level="2" size="sm">
          What happens next
        </UIHeading>
        <div class="mt-2 text-base/relaxed text-ink-soft">
          <slot />
        </div>
      </div>

      <NuxtLink
        to="/"
        class="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-base font-semibold text-charcoal transition-colors hover:bg-navy hover:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:w-auto"
      >
        Return to homepage
        <span class="icon-[carbon--arrow-right]" aria-hidden="true" />
      </NuxtLink>

      <div class="mt-7 border-t border-rule-soft pt-5">
        <UIText tone="strong" weight="semibold">
          Need to add anything?
        </UIText>
        <a :href="business.phoneHref" class="mt-2 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent">
          <span class="icon-[carbon--phone]" aria-hidden="true" />
          Call {{ business.phone }}
        </a>
      </div>
    </UICard>
  </section>
</template>
