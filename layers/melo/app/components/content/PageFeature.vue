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
  <UICard as="article" padding="lg" class="page-feature relative h-full shadow-sm shadow-ink/5 transition" :class="props.to ? 'hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink/10' : ''">
    <span v-if="iconClass" class="flex size-12 items-center justify-center rounded-xl bg-accent-soft text-[1.75rem] text-accent" aria-hidden="true">
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
