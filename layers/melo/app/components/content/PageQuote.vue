<script setup lang="ts">
/**
 * A client's review. In Markdown:
 *
 *   ::page-quote{name="Jane Doe" source="Google review"}
 *   The review.
 *   ::
 *
 * The stars are decoration, hidden from screen readers: a quote does not say what the client
 * rated. A star rating is only ever stated where Google's listing gives one (`googleRating`).
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
      <p class="text-2xl tracking-[0.15em] text-star" aria-hidden="true">
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
