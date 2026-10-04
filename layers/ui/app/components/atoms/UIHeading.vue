<script setup lang="ts">
type HeadingLevel = 1 | 2 | 3 | 4
type HeadingSize = 'lg' | 'md' | 'sm' | 'xl' | 'xs'

const props = withDefaults(
  defineProps<{
    level?: HeadingLevel
    size?: HeadingSize
    uppercase?: boolean
  }>(),
  {
    level: 2,
    uppercase: false,
  },
)

const sizeClasses: Record<HeadingSize, string> = {
  xl: 'text-3xl sm:text-4xl font-bold',
  lg: 'text-2xl sm:text-3xl font-bold',
  md: 'text-lg font-semibold',
  sm: 'text-base sm:text-lg font-semibold',
  xs: 'text-sm font-semibold',
}

const defaultSizeForLevel: Record<HeadingLevel, HeadingSize> = {
  1: 'lg',
  2: 'md',
  3: 'xs',
  4: 'xs',
}

const resolvedSize = computed(() => props.size ?? defaultSizeForLevel[props.level])
const headingClasses = computed(() => [
  'font-heading tracking-[0.02em] text-ink',
  sizeClasses[resolvedSize.value],
  props.uppercase ? 'uppercase tracking-widest' : '',
])
</script>

<template>
  <component :is="`h${props.level}`" class="ui-heading" :class="headingClasses">
    <slot />
  </component>
</template>
