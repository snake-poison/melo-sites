<script setup lang="ts">
import { blogPage, business } from '#site'

const { title, metaTitle, lead, description } = blogPage

useSeoMeta({ title: metaTitle, description, ogTitle: metaTitle, ogDescription: description })
useSchemaOrg([
  defineWebPage({ '@type': 'CollectionPage' }),
  defineBreadcrumb({ itemListElement: [{ name: 'Home', item: '/' }, { name: 'Blog', item: '/blog/' }] }),
])
defineOgImage('MeloPage', { title, kicker: business.name })

const { data: posts } = await useAsyncData('posts:all', () => queryPosts().all())
</script>

<template>
  <div>
    <PageHero :title="title" :lead="lead" :image="blogPage.image" />
    <div class="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <PostList :posts="posts ?? []" />
    </div>
    <div class="pb-20">
      <SecondOpinionBand />
    </div>
  </div>
</template>
