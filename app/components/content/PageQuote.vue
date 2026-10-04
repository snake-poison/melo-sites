<script setup lang="ts">
/**
 * A client's review. In Markdown:
 *
 *   ::page-quote{name="Bethany Simonetti" source="Verified Google Review"}
 *   The review.
 *   ::
 */
const props = withDefaults(defineProps<{
  name: string
  source?: string
}>(), {
  source: undefined,
})
</script>

<template>
  <figure class="page-quote">
    <UICard padding="lg" class="shadow-lg shadow-ink/8">
      <p class="text-2xl tracking-[0.15em] text-star" role="img" aria-label="Five stars">
        ★★★★★
      </p>
      <blockquote class="mt-3 text-lg/relaxed text-ink [&_p]:m-0">
        <slot />
      </blockquote>
      <figcaption class="mt-4 flex flex-wrap items-baseline gap-x-3">
        <UIText variant="title" as="span">
          {{ props.name }}
        </UIText>
        <UIText v-if="props.source" variant="label" as="span">
          {{ props.source }}
        </UIText>
      </figcaption>
    </UICard>
  </figure>
</template>
