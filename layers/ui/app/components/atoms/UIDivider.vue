<script setup lang="ts">
withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
  }>(),
  {
    orientation: 'horizontal',
  },
)

const horizontalClasses = 'border-t border-rule-soft w-full'
const verticalClasses = 'border-l border-rule-soft h-full'
</script>

<template>
  <hr v-if="$props.orientation === 'horizontal'" :class="horizontalClasses">
  <div v-else :class="verticalClasses" role="separator" aria-orientation="vertical" />
</template>
