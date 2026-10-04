<script setup lang="ts">
/**
 * A list to work through, drawn as a card of tick boxes that prints cleanly. In Markdown,
 * a task list inside the block:
 *
 *   ::post-checklist{title="The 48-hour checklist"}
 *   - [ ] Everyone out and safe
 *   ::
 */
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <section class="post-checklist border border-rule bg-panel p-6 sm:p-8" :aria-label="props.title">
    <p class="text-sm font-medium tracking-[0.06em] text-accent uppercase">
      Save or print this
    </p>
    <p class="mt-2 font-heading text-2xl font-bold text-ink">
      {{ props.title }}
    </p>
    <div class="post-checklist__items mt-5">
      <slot />
    </div>
  </section>
</template>
