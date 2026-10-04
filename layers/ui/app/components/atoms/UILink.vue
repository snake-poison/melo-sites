<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to: string
    variant?: 'default' | 'muted'
    external?: boolean
  }>(),
  {
    variant: 'default',
    external: false,
  },
)

const isExternal = computed(() => props.external || props.to.startsWith('http'))

const variantClasses = {
  default: 'text-sm font-medium text-accent underline-offset-2 hover:underline',
  muted: 'text-sm text-ink-soft underline-offset-2 hover:text-ink hover:underline',
}
</script>

<template>
  <a
    v-if="isExternal"
    :href="props.to"
    target="_blank"
    rel="noopener"
    :class="variantClasses[props.variant]"
  >
    <slot />
  </a>
  <NuxtLink
    v-else
    :to="props.to"
    :class="variantClasses[props.variant]"
  >
    <slot />
  </NuxtLink>
</template>
