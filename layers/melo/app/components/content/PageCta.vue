<script setup lang="ts">
import { business } from '#site'

/**
 * A call to action between a page's sections. In Markdown:
 *
 *   :page-cta{kind="review" label="Get a free claims review"}
 *   :page-cta{kind="call" label="Call us 24/7"}
 *
 * A review button goes to the claim-review form: further down the page when the page has one
 * (claimForm in its frontmatter), the contact page's otherwise. A review is cyan, the brand's
 * button, with charcoal words; a call is navy. `tone` overrides that: `light` outlines it in
 * white, for a photo; `dark` fills it navy, for a cyan band.
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
    class="page-cta inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold no-underline! transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
    :class="props.tone === 'light'
      ? 'text-on-dark! ring-2 ring-on-dark/70 ring-inset hover:bg-on-dark hover:text-navy!'
      : props.kind === 'call' || props.tone === 'dark'
        ? 'bg-navy text-on-dark! hover:bg-navy-2 dark:ring-1 dark:ring-on-dark/25'
        : 'bg-brand text-charcoal! hover:bg-navy hover:text-on-dark!'"
  >
    <span v-if="props.kind === 'call'" class="icon-[carbon--phone-filled]" aria-hidden="true" />
    {{ props.label }}
  </a>
</template>
