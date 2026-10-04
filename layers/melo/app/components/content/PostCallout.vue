<script setup lang="ts">
import type { Tone } from '#layers/ui/app/constants/tones'
import { TONE_CLASSES } from '#layers/ui/app/constants/tones'

/**
 * A boxed aside: a warning, or a point a reader must not miss. In Markdown:
 *
 *   ::post-callout{tone="danger" title="Leave first"}
 *   The body.
 *   ::
 */
const props = withDefaults(defineProps<{
  title?: string
  tone?: Tone
}>(), {
  title: undefined,
  tone: 'info',
})

const icons: Record<Tone, string> = {
  accent: 'icon-[carbon--checkmark-filled]',
  info: 'icon-[carbon--information-filled]',
  warn: 'icon-[carbon--warning-alt-filled]',
  danger: 'icon-[carbon--warning-filled]',
  neutral: 'icon-[carbon--information-filled]',
}
</script>

<template>
  <aside class="post-callout flex gap-4 border p-5" :class="TONE_CLASSES.callout[props.tone]">
    <span class="mt-0.5 shrink-0 text-xl" :class="[icons[props.tone], TONE_CLASSES.text[props.tone]]" aria-hidden="true" />
    <div class="min-w-0">
      <p v-if="props.title" class="font-heading text-lg/snug font-bold text-ink">
        {{ props.title }}
      </p>
      <div class="post-callout__body">
        <slot />
      </div>
    </div>
  </aside>
</template>
