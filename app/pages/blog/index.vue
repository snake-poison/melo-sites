<script setup lang="ts">
import { business } from '~/constants/site'

// The title and heading WordPress gave the blog page.
const title = 'Our Blog & Other Resources'
const metaTitle = 'Our Blog - Public Adjusters of Charlotte'
const lead = 'Get the maximum valuation for any insurance claim type. We work for you, so let\'s work together!'
const description = 'Tips on insurance claims and public adjusters, and news and things to do around Charlotte, NC, from Melo Public Adjusters Charlotte.'

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
    <PageHero :title="title" :lead="lead" image="/wp-content/uploads/2020/02/Header-8.jpg" />
    <div class="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <PostList :posts="posts ?? []" />
    </div>
    <div class="pb-20">
      <SecondOpinionBand />
    </div>
  </div>
</template>
