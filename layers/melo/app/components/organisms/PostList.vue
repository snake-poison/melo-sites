<script setup lang="ts">
const props = defineProps<{
  posts: PostListItem[]
  level?: 2 | 3
}>()
</script>

<template>
  <ol v-if="props.posts.length > 0" class="divide-y divide-rule-soft">
    <li v-for="post in props.posts" :key="post.path" class="py-6 first:pt-0 last:pb-0">
      <PostCard :post="post" :level="props.level" />
    </li>
  </ol>
  <UIText v-else>
    Nothing here yet.
  </UIText>
</template>
