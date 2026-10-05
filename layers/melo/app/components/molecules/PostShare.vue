<script setup lang="ts">
/**
 * The share buttons the old site had over each post. Plain links to each network's share page,
 * which needs no script on ours.
 */
const props = defineProps<{
  url: string
  title: string
  image?: string
}>()

const siteUrl = useSiteConfig().url
const links = [
  {
    label: 'Share',
    network: 'Facebook',
    icon: 'icon-[carbon--logo-facebook]',
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`,
  },
  {
    label: 'Tweet',
    network: 'Twitter',
    icon: 'icon-[carbon--logo-x]',
    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}`,
  },
  {
    label: 'Pin',
    network: 'Pinterest',
    icon: 'icon-[carbon--logo-pinterest]',
    href: `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(props.url)}&description=${encodeURIComponent(props.title)}${props.image ? `&media=${encodeURIComponent(siteUrl + props.image)}` : ''}`,
  },
]
</script>

<template>
  <aside aria-labelledby="share-heading">
    <UIText id="share-heading" variant="title" as="h2">
      Sharing is caring!
    </UIText>
    <ul class="mt-3 grid grid-cols-3 gap-3">
      <li v-for="link in links" :key="link.network">
        <a
          :href="link.href"
          target="_blank"
          rel="noopener"
          class="flex items-center justify-center gap-2 rounded-lg border border-rule bg-paper-2 px-3 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent"
          :aria-label="`${link.label} on ${link.network}`"
        >
          <span :class="link.icon" aria-hidden="true" />
          {{ link.label }}
        </a>
      </li>
    </ul>
  </aside>
</template>
