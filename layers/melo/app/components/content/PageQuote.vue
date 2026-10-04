<script setup lang="ts">
/**
 * A client's review. In Markdown:
 *
 *   ::page-quote{name="Jane Doe" source="Google review"}
 *   The review.
 *   ::
 *
 * No stars: a quote does not say what the client rated, and the sites show a star rating only
 * where Google's listing gives one (`googleRating`).
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
      <span class="icon-[carbon--quotes] text-3xl text-accent" aria-hidden="true" />
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
