<script setup lang="ts">
/**
 * Cards in a grid: the services on the home page, the claim types on their index. In Markdown:
 *
 *   ::page-grid{cols="3"}
 *   :::page-feature{title="…" icon="carbon--fire" to="/…/"}
 *   The card's text.
 *   :::
 *   ::
 *
 * `solid` marks the old home page's services, which it filled cyan and charcoal in turn. They
 * are white cards now, like any grid's; the flag is kept so the content need not change.
 */
const props = withDefaults(defineProps<{
  /** Markdown passes `cols="3"` as the number 3. */
  cols?: '2' | '3' | 2 | 3
  solid?: boolean
}>(), {
  cols: 3,
  solid: false,
})
</script>

<template>
  <div class="page-grid grid gap-6 sm:grid-cols-2" :class="[Number(props.cols) === 3 ? 'lg:grid-cols-3' : '', props.solid ? 'page-grid--solid' : '']">
    <slot />
  </div>
</template>
