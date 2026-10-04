<script setup lang="ts">
import type { Tone } from '~/constants/tones'
import { TONE_CLASSES } from '~/constants/tones'

type Variant = 'body' | 'caption' | 'figure' | 'hint' | 'kicker' | 'label' | 'micro' | 'mono' | 'overline' | 'small' | 'title' | 'value-sm' | 'value-xl' | 'value'
// A tone, or an ink level: the variant's own ink, or full-strength ink. Neutral is faint ink.
type TextTone = Tone | 'default' | 'strong'
type Weight = 'bold' | 'medium' | 'semibold'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    tone?: TextTone
    weight?: Weight
    tabular?: boolean
    as?: 'div' | 'dt' | 'h2' | 'h3' | 'label' | 'li' | 'p' | 'span'
  }>(),
  {
    variant: 'body',
    tone: 'default',
    tabular: false,
    as: 'p',
  },
)

const variantClasses: Record<Variant, string> = {
  'body': 'text-sm leading-relaxed',
  'small': 'text-xs leading-relaxed',
  'caption': 'text-[11px] leading-relaxed',
  'micro': 'text-[10px]',
  'title': 'text-sm font-semibold leading-snug',
  'value': 'text-xl font-bold',
  'value-sm': 'text-sm font-semibold',
  'value-xl': 'text-4xl sm:text-5xl font-black tracking-tight tabular-nums',
  'figure': 'font-mono text-lg font-semibold leading-tight tabular-nums',
  'kicker': 'font-mono text-[0.7rem] font-semibold tracking-[0.16em] uppercase',
  'label': 'font-mono text-[0.625rem] font-semibold tracking-[0.16em] uppercase',
  'overline': 'font-mono text-[10px] tracking-wider uppercase font-medium',
  'hint': 'text-[11px] leading-relaxed',
  'mono': 'text-xs font-mono',
}

// Body copy is soft ink, figures and titles full ink, small print faint, and kickers the second accent.
const variantDefaultColors: Record<Variant, string> = {
  'body': 'text-ink-soft',
  'small': 'text-ink-soft',
  'caption': 'text-ink-soft',
  'micro': 'text-ink-faint',
  'title': 'text-ink',
  'value': 'text-ink',
  'value-sm': 'text-ink',
  'value-xl': 'text-ink',
  'figure': 'text-ink',
  'kicker': 'text-accent-2',
  'label': 'text-ink-faint',
  'overline': 'text-ink-faint',
  'hint': 'text-ink-faint',
  'mono': 'text-ink-soft',
}

const toneClasses: Record<Exclude<TextTone, 'default'>, string> = {
  ...TONE_CLASSES.text,
  strong: 'text-ink',
}

const weightClasses: Record<Weight, string> = {
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const componentVariantClasses: Record<Variant, string> = {
  'body': 'ui-text--body',
  'caption': 'ui-text--caption',
  'figure': 'ui-text--figure',
  'hint': 'ui-text--hint',
  'kicker': 'ui-text--kicker',
  'label': 'ui-text--label',
  'micro': 'ui-text--micro',
  'mono': 'ui-text--mono',
  'overline': 'ui-text--overline',
  'small': 'ui-text--small',
  'title': 'ui-text--title',
  'value': 'ui-text--value',
  'value-sm': 'ui-text--value-sm',
  'value-xl': 'ui-text--value-xl',
}

const computedClasses = computed(() => {
  const classes = ['ui-text', componentVariantClasses[props.variant], variantClasses[props.variant]]

  if (props.tone === 'default') {
    classes.push(variantDefaultColors[props.variant])
  }
  else {
    classes.push(toneClasses[props.tone])
  }

  if (props.weight) {
    classes.push(weightClasses[props.weight])
  }

  if (props.tabular) {
    classes.push('tabular-nums')
  }

  return classes
})
</script>

<template>
  <component :is="props.as" :class="computedClasses">
    <slot />
  </component>
</template>
