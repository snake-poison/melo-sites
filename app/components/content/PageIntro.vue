<script setup lang="ts">
/**
 * A heading and its lead, centred over the blocks they introduce, as the old site opened a run
 * of cards or sections. In Markdown:
 *
 *   ::page-intro
 *   :page-kicker{text="disappointed with your claim?"}
 *   ## The heading
 *   The lead.
 *   ::
 */
</script>

<template>
  <div class="page-intro mx-auto max-w-4xl text-center">
    <slot />
  </div>
</template>
