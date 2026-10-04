<script setup lang="ts">
import { business } from '#site'

/**
 * A call to action between a page's sections. In Markdown:
 *
 *   :page-cta{kind="review" label="Get a free claims review"}
 *   :page-cta{kind="call" label="Call us 24/7"}
 *
 * A review button goes to the claim-review form: further down the page when the page has one
 * (claimForm in its frontmatter), the contact page's otherwise. Square and in capitals, as the
 * old site's buttons were: a review is cyan, a call charcoal. `tone` overrides that: `light`
 * outlines it in white, for a photo; `dark` fills it charcoal, for a cyan band.
 */
const props = withDefaults(defineProps<{
  kind?: 'call' | 'review'
  label: string
  tone?: 'dark' | 'light'
}>(), {
  kind: 'review',
  tone: undefined,
})

const formHref = inject(claimFormHrefKey, '/contact/#claim-review')
const href = props.kind === 'call' ? business.phoneHref : formHref
</script>

<template>
  <a
    :href="href"
    class="page-cta inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold tracking-[0.08em] uppercase no-underline! transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
    :class="props.tone === 'light'
      ? 'border-2 border-on-dark text-on-dark! hover:bg-on-dark hover:text-charcoal!'
      : props.kind === 'call' || props.tone === 'dark'
        ? 'bg-charcoal text-on-dark! hover:bg-charcoal-2'
        : 'bg-brand text-charcoal! hover:bg-charcoal hover:text-on-dark!'"
  >
    <span v-if="props.kind === 'call'" class="icon-[carbon--phone-filled]" aria-hidden="true" />
    {{ props.label }}
  </a>
</template>
