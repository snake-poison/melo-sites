<script setup lang="ts">
import type { Tone } from '~/constants/tones'
import type { Band } from '~/types/ui/uiTypes'
import { TONE_CLASSES } from '~/constants/tones'

const props = withDefaults(
  defineProps<{

    variant?: 'band' | 'callout' | 'panel' | 'well'

    tone?: Tone

    band?: Band

    padding?: 'band' | 'lg' | 'md' | 'none' | 'sm' | 'xs'

    radius?: '2xl' | '3xl' | 'lg' | 'xl'

    as?: 'article' | 'div' | 'section'
  }>(),
  {
    variant: 'panel',
    tone: 'neutral',
    band: 'faq',
    padding: undefined,
    radius: undefined,
    as: 'div',
  },
)

// A band is a page section on its own gradient wash.
const bandClasses: Record<Band, string> = {
  faq: 'bg-(image:--machine-band-faq)',
  how: 'bg-(image:--machine-band-how)',
  member: 'bg-(image:--machine-band-member)',
  metrics: 'bg-(image:--machine-band-metrics)',
  trial: 'bg-(image:--machine-band-trial)',
}

const paddingClasses = {
  band: 'p-5 sm:p-8',
  none: 'p-0',
  xs: 'px-4 py-3',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6 sm:p-8',
}

const radiusClasses = {
  'lg': 'rounded-lg',
  'xl': 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

const NESTED_CARD_KEY = 'ui-card-nested'

// A card is a hairline panel; a well, or any card inside another, is a faint well. A band is
// a section, not a card: it never turns into a well, and cards inside it stay panels.
const nested = inject(NESTED_CARD_KEY, false)
provide(NESTED_CARD_KEY, props.variant === 'band' ? nested : true)

const panelClasses = 'overflow-hidden border border-rule-soft bg-panel'
const wellClasses = 'border border-rule-soft bg-ink/4'

const styleClasses = computed(() => {
  if (props.variant === 'band') {
    return `border border-rule-soft ${bandClasses[props.band]}`
  }
  if (props.variant === 'callout') {
    return `border ${TONE_CLASSES.callout[props.tone]}`
  }
  if (props.variant === 'well' || nested) {
    return wellClasses
  }
  return panelClasses
})

const containerClasses = computed(() => [
  styleClasses.value,
  paddingClasses[props.padding ?? (props.variant === 'band' ? 'band' : 'md')],
  radiusClasses[props.radius ?? (props.variant === 'band' ? '2xl' : '3xl')],
])
</script>

<template>
  <component
    :is="props.as"
    class="ui-card"
    :class="containerClasses"
  >
    <slot />
  </component>
</template>
