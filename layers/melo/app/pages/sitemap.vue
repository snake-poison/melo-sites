<script setup lang="ts">
import { business, sitemapPage } from '#site'

// The page-by-page index WordPress had at /sitemap/, for readers. Crawlers read /sitemap.xml.
const title = 'Sitemap'
const metaTitle = `Sitemap - ${business.shortName}`
const { description, order, names } = sitemapPage

useSeoMeta({ title: metaTitle, description, ogTitle: metaTitle, ogDescription: description })
useSchemaOrg([
  defineWebPage(),
  defineBreadcrumb({ itemListElement: [{ name: 'Home', item: '/' }, { name: 'Sitemap', item: '/sitemap/' }] }),
])
defineOgImage('MeloPage', { title, kicker: business.name })

const [{ data: pageTitles }, { data: posts }] = await Promise.all([
  useAsyncData('sitemap:pages', async () => queryCollection('pages').select('path', 'title').all()),
  useAsyncData('sitemap:posts', () => queryPosts().all()),
])
const pages = order.map(path => ({
  path,
  title: names[path] ?? pageTitles.value?.find(page => page.path === path)?.title ?? path,
}))
</script>

<template>
  <div>
    <PageHero :title="title" :lead="description" :actions="false" />
    <div class="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2">
      <section aria-labelledby="sitemap-pages">
        <UIHeading id="sitemap-pages" :level="2" size="lg">
          Pages
        </UIHeading>
        <ul class="mt-6 space-y-3">
          <li v-for="item in pages" :key="item.path" :class="item.path.split('/').length > 2 ? 'ml-5' : ''">
            <UILink :to="item.path">
              {{ item.title }}
            </UILink>
          </li>
        </ul>
      </section>
      <section aria-labelledby="sitemap-posts">
        <UIHeading id="sitemap-posts" :level="2" size="lg">
          Blog posts
        </UIHeading>
        <ul class="mt-6 space-y-3">
          <li v-for="post in posts" :key="post.path">
            <UILink :to="post.path">
              {{ post.title }}
            </UILink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
