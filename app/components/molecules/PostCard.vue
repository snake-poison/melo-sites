<script setup lang="ts">
import { categories } from '~/constants/site'

const props = defineProps<{
  post: PostListItem
  /** The heading level the card's title takes in the page's outline. */
  level?: 2 | 3
}>()
</script>

<template>
  <article class="group relative grid gap-5" :class="props.post.image ? 'sm:grid-cols-[minmax(0,1fr)_15rem] sm:gap-8' : ''">
    <NuxtPicture
      v-if="props.post.image"
      :src="props.post.image.src"
      sizes="xs:100vw sm:240px"
      width="480"
      height="320"
      class="sm:order-last"
      :img-attrs="{
        alt: '',
        class: 'aspect-3/2 w-full border border-rule-soft bg-paper-2 object-cover transition-opacity group-hover:opacity-90',
        loading: 'lazy',
        decoding: 'async',
      }"
    />
    <div class="min-w-0">
      <UIText variant="label" as="p" class="flex flex-wrap items-center gap-x-2">
        <span class="text-accent">{{ categories[props.post.category].label }}</span>
        <span aria-hidden="true">·</span>
        <time :datetime="isoDate(props.post.date)">{{ formatDate(props.post.date) }}</time>
        <span aria-hidden="true">·</span>
        <span>{{ props.post.readingTime }} min read</span>
      </UIText>
      <UIHeading :level="props.level ?? 2" size="sm" class="mt-2">
        <!-- The link covers the card, so the whole card is one target with one accessible name. -->
        <NuxtLink :to="props.post.path" class="group-hover:text-accent after:absolute after:inset-0">
          {{ props.post.title }}
        </NuxtLink>
      </UIHeading>
      <UIText class="mt-2">
        {{ props.post.description }}
      </UIText>
    </div>
  </article>
</template>
