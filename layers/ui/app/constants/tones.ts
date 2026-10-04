/**
 * The five tones the machine style paints state with. Every shared part that shows a state takes
 * a `tone`, and each tone names one theme colour: accent for done or good, info for in progress,
 * warn for needs attention, danger for failed or blocked, neutral for everything else.
 */
import type { IconName } from '~/constants/icons'

export type Tone = 'accent' | 'danger' | 'info' | 'neutral' | 'warn'

/** The icon that says the tone: done, in progress or neutral, needs attention, failed. */
export const TONE_ICONS: Record<Tone, IconName> = {
  accent: 'checkmark-filled',
  info: 'information-filled',
  warn: 'warning-alt-filled',
  danger: 'warning-filled',
  neutral: 'information-filled',
}

export const TONE_CLASSES = {
  /** Ink in the tone, for a value or a label. */
  text: {
    accent: 'text-accent',
    info: 'text-accent-2',
    warn: 'text-warn',
    danger: 'text-danger',
    neutral: 'text-ink-faint',
  },
  /** A solid fill, for dots and bars. */
  bg: {
    accent: 'bg-accent',
    info: 'bg-accent-2',
    warn: 'bg-warn',
    danger: 'bg-danger',
    neutral: 'bg-ink-faint',
  },
  /** The soft wash of the tone with its ink, for icon discs and tinted panels. */
  soft: {
    accent: 'bg-accent-soft text-accent',
    info: 'bg-accent-2-soft text-accent-2',
    warn: 'bg-warn-soft text-warn',
    danger: 'bg-danger-soft text-danger',
    neutral: 'bg-ink/4 text-ink-soft',
  },
  /** A hairline edge on the soft wash, for callouts and alerts. */
  callout: {
    accent: 'border-accent/30 bg-accent-soft',
    info: 'border-accent-2/30 bg-accent-2-soft',
    warn: 'border-warn/30 bg-warn-soft',
    danger: 'border-danger/30 bg-danger-soft',
    neutral: 'border-rule-soft bg-ink/4',
  },
  /** A rule in the tone. */
  border: {
    accent: 'border-accent',
    info: 'border-accent-2',
    warn: 'border-warn',
    danger: 'border-danger',
    neutral: 'border-rule',
  },
  /** An SVG stroke in the tone. */
  stroke: {
    accent: 'stroke-accent',
    info: 'stroke-accent-2',
    warn: 'stroke-warn',
    danger: 'stroke-danger',
    neutral: 'stroke-ink-faint',
  },
  /** The wash behind a status pill; UIBadge draws the pill itself. */
  pill: {
    accent: 'bg-accent-soft',
    info: 'bg-accent-2-soft',
    warn: 'bg-warn-soft',
    danger: 'bg-danger-soft',
    neutral: 'bg-rule-soft',
  },
} as const satisfies Record<string, Record<Tone, string>>
