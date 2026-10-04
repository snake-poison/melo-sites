<script setup lang="ts">
import type { Category } from '~/constants/site'
import { business, categories, categoryIds } from '~/constants/site'

// A WordPress category archive, at the URL WordPress gave it. Yoast kept these out of search
// results, and so does this page (and the sitemap, nuxt.config.ts routeRules).
const route = useRoute('blog-category-category')

function isCategory(value: string): value is Category {
  return categoryIds.some(id => id === value)
}

const id = route.params.category
if (!isCategory(id)) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
const category = categories[id]

const metaTitle = `${category.label} Archives - ${business.shortName}`
useSeoMeta({ title: metaTitle, description: category.description, ogTitle: metaTitle, ogDescription: category.description })
useSchemaOrg([
  defineWebPage({ '@type': 'CollectionPage' }),
  defineBreadcrumb({ itemListElement: [{ name: 'Home', item: '/' }, { name: 'Blog', item: '/blog/' }, { name: category.label, item: `/blog/category/${id}/` }] }),
])
defineOgImage('MeloPage', { title: category.label, kicker: 'Our Blog' })

const { data: posts } = await useAsyncData(`posts:category:${id}`, async () =>
  queryPosts().where('category', '=', id).all())
</script>

<template>
  <div>
    <PageHero :title="category.label" kicker="Our Blog" :lead="category.description" :actions="false" />
    <div class="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <PostList :posts="posts ?? []" />
    </div>
  </div>
</template>
