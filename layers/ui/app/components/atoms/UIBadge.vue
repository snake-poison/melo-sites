<script setup lang="ts">
import type { Tone } from '~/constants/tones'
import { TONE_CLASSES } from '~/constants/tones'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    variant?: Variant
    tone?: Tone

    label?: string

    animated?: boolean
  }>(),
  {
    variant: 'tag',
    tone: 'accent',
    animated: false,
  },
)

// A tag is the bare pill; a status pill leads with a dot of its tone; an outline is a hairline
// ring with no wash, for a count or a category.
type Variant = 'outline' | 'status' | 'tag'

const dotClasses = computed(() => [
  TONE_CLASSES.bg[props.tone],
  props.animated ? 'animate-pulse' : '',
])
</script>

<template>
  <!-- Status variant with label prop renders as dot + text -->
  <div v-if="props.variant === 'status' && props.label" v-bind="$attrs" class="ui-badge flex items-center gap-1.5">
    <span class="size-2 rounded-full" :class="dotClasses" />
    <span class="text-[11px] font-semibold tracking-wider uppercase" :class="TONE_CLASSES.text[props.tone]">
      {{ props.label }}
    </span>
  </div>
  <!-- Standard badge rendering -->
  <span
    v-else
    v-bind="$attrs"
    class="ui-badge inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-ink capitalize"
    :class="props.variant === 'outline' ? 'border border-rule-soft font-mono text-ink-faint' : TONE_CLASSES.pill[props.tone]"
  >
    <span v-if="props.variant === 'status'" class="size-1.5 rounded-full" :class="dotClasses" />
    <slot />
  </span>
</template>
