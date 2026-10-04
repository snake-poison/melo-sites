<script setup lang="ts">
/**
 * The small line over a heading. In Markdown:
 *
 *   :page-kicker{text="disappointed with your claim?"}
 */
const props = defineProps<{ text: string }>()
</script>

<template>
  <UIText variant="kicker" as="p" class="page-kicker">
    {{ props.text }}
  </UIText>
</template>
