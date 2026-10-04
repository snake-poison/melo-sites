<script setup lang="ts">
/** One card of a page-grid: an icon, a title and a line or two. The whole card links when `to` is set. */
const props = withDefaults(defineProps<{
  title: string
  /** A Carbon icon, as `carbon--fire`. main.css lists the ones content may use. */
  icon?: string
  to?: string
}>(), {
  icon: undefined,
  to: undefined,
})

const iconClass = props.icon == null ? undefined : `icon-[${props.icon}]`
</script>

<template>
  <UICard as="article" padding="lg" class="page-feature relative h-full border-0 shadow-lg shadow-ink/8 transition-shadow" :class="props.to ? 'hover:shadow-xl hover:shadow-ink/14' : ''">
    <span v-if="iconClass" class="block text-4xl text-accent" aria-hidden="true">
      <span :class="iconClass" />
    </span>
    <h3 class="mt-4 font-heading text-xl/snug font-bold text-ink">
      <NuxtLink v-if="props.to" :to="props.to" class="after:absolute after:inset-0 hover:text-accent">
        {{ props.title }}
      </NuxtLink>
      <template v-else>
        {{ props.title }}
      </template>
    </h3>
    <div class="page-feature__body mt-2 text-[0.9375rem]/relaxed text-ink-soft">
      <slot />
    </div>
  </UICard>
</template>
