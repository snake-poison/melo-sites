<script setup lang="ts">
import { categories } from '#site'

const route = useRoute('blog-slug')
const path = route.path.replace(/\/$/, '')

const { data: post } = await useAsyncData(`post:${path}`, async () =>
  queryCollection('blog').path(path).first())

if (post.value == null || ((post.value.draft || isScheduled(post.value.date)) && !import.meta.dev)) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}
const page = post.value
const category = categories[page.category]

// More from the same category, the links a reader who finished this one wants next.
const { data: related } = await useAsyncData(`post:${path}:related`, async () =>
  queryPosts().where('category', '=', page.category).where('path', '<>', page.path).limit(3).all())

const published = isoDate(page.date)
const modified = page.updated == null ? published : isoDate(page.updated)

useSeoMeta({
  title: page.metaTitle,
  description: page.description,
  ogType: 'article',
  ogTitle: page.title,
  ogDescription: page.description,
  articlePublishedTime: published,
  articleModifiedTime: modified,
  articleSection: category.label,
})

// WordPress credited the posts to "Public Adjusters Charlotte Team": the business wrote them.
useSchemaOrg([
  defineArticle({
    '@type': 'BlogPosting',
    'headline': page.title,
    'description': page.description,
    'datePublished': published,
    'dateModified': modified,
    'articleSection': [category.label],
    'image': page.image?.src,
    'author': { '@id': '#identity' },
  }),
  defineWebPage({
    '@type': page.faq.length > 0 ? ['WebPage', 'FAQPage'] : 'WebPage',
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: 'Blog', item: '/blog/' },
      { name: page.title, item: `${page.path}/` },
    ],
  }),
  ...page.faq.map(item => defineQuestion({ name: item.question, acceptedAnswer: item.answer })),
])

defineOgImage('MeloPage', { title: page.title, kicker: category.label })

// The page's own address, for the share links.
const canonical = `${useSiteConfig().url}${page.path}/`

// The post's h2s, for the outline beside the body.
const toc = page.body.toc?.links ?? []
</script>

<template>
  <div>
    <!-- As WordPress opened a post: its title and date over the featured photo. -->
    <PageHero :title="page.title" :kicker="category.label" :image="page.image?.src" :actions="false">
      <UIText variant="label" as="p" class="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-on-dark/80!">
        <time :datetime="published">{{ formatDate(page.date) }}</time>
        <template v-if="page.updated">
          <span aria-hidden="true">·</span>
          <span>Updated <time :datetime="modified">{{ formatDate(page.updated) }}</time></span>
        </template>
        <span aria-hidden="true">·</span>
        <span>{{ page.readingTime }} min read</span>
      </UIText>
      <UIBadge v-if="page.draft" tone="warn" class="mt-4">
        Draft: not published
      </UIBadge>
      <UIBadge v-else-if="isScheduled(page.date)" tone="info" class="mt-4">
        Scheduled: goes live {{ formatDate(page.date) }}
      </UIBadge>
    </PageHero>

    <article class="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div class="grid gap-x-14 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div class="min-w-0">
          <PostShare :url="canonical" :title="page.title" :image="page.image?.src" />

          <UICard v-if="page.summary" as="section" variant="callout" tone="accent" aria-label="In short" class="mt-10">
            <UIText variant="kicker" as="p" tone="accent" class="flex items-center gap-2">
              <span class="icon-[carbon--flash-filled] text-sm" aria-hidden="true" />
              In short
            </UIText>
            <p class="mt-3 text-lg/relaxed text-ink">
              {{ page.summary }}
            </p>
          </UICard>

          <ContentRenderer :value="page" class="post-body mt-10" />

          <PostFaq v-if="page.faq.length > 0" :items="page.faq" class="mt-16" />
        </div>

        <!-- The outline, beside the body on wide screens. Plain anchor links: no script. -->
        <aside v-if="toc.length > 0" class="hidden lg:block" aria-labelledby="toc-heading">
          <nav class="sticky top-32">
            <UIText id="toc-heading" variant="label" as="h2">
              On this page
            </UIText>
            <ol class="mt-4 space-y-2.5 border-l border-rule-soft">
              <li v-for="link in toc" :key="link.id">
                <a :href="`#${link.id}`" class="-ml-px block border-l border-transparent pl-4 text-sm/snug text-ink-soft hover:border-accent hover:text-ink">
                  {{ link.text }}
                </a>
              </li>
            </ol>
          </nav>
        </aside>
      </div>

      <section v-if="related && related.length > 0" aria-labelledby="related-heading" class="mt-20">
        <UIHeading id="related-heading" :level="2" size="xs" uppercase>
          Keep reading
        </UIHeading>
        <UIDivider class="mt-3 mb-6" />
        <PostList :posts="related" :level="3" />
      </section>
    </article>
  </div>
</template>
