<script setup lang="ts">
import { addressLine, business } from '~/constants/site'

/*
 * Every page the old WordPress site had, at the URL it had: content/pages/<path>.md renders at
 * /<path>/, and the home page is content/pages/index.md. The blog has its own routes.
 */
const route = useRoute()
const path = route.path.replace(/\/$/, '') || '/'

const { data: page } = await useAsyncData(`page:${path}`, async () =>
  queryCollection('pages').path(path).first())

if (page.value == null) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
const content = page.value

// The page above this one, for the breadcrumb trail: /claims-adjuster/ above its services.
const parentPath = path.split('/').slice(0, -1).join('/')
const { data: parent } = await useAsyncData(`page:${path}:parent`, async () =>
  parentPath === '' ? null : queryCollection('pages').path(parentPath).select('title', 'path').first())

const isHome = path === '/'
const isContact = path === '/contact'

useSeoMeta({
  title: content.metaTitle,
  description: content.description,
  ogTitle: content.metaTitle,
  ogDescription: content.description,
  articleModifiedTime: isoDate(content.updated ?? content.date),
})
if (content.noindex) {
  useRobotsRule('noindex, follow')
}

useSchemaOrg([
  defineWebPage({
    '@type': isContact ? 'ContactPage' : 'WebPage',
    'name': content.metaTitle,
    'datePublished': isoDate(content.date),
    'dateModified': isoDate(content.updated ?? content.date),
  }),
  ...(isHome
    ? [defineWebSite({ name: business.name, description: business.description })]
    : [defineBreadcrumb({
        itemListElement: [
          { name: 'Home', item: '/' },
          ...(parent.value == null ? [] : [{ name: parent.value.title, item: `${parent.value.path}/` }]),
          { name: content.title, item: `${path}/` },
        ],
      })]),
])
defineOgImage('MeloPage', { title: content.title, kicker: content.kicker ?? business.name })

// Where this page's "get a claims review" buttons point (components/content/PageCta.vue).
provide(claimFormHrefKey, content.claimForm ? '#claim-review' : '/contact/#claim-review')

// The thank-you page sells nothing, so it opens without the call-to-action buttons.
const quiet = path === '/thank-you-page'

/*
 * The claim review is a band the page's width, so it cannot sit in the body's column. It goes
 * after the body, or where the body marks it with `:page-claim-review` (the home page, as the
 * old one had it); the body then renders in two parts around it.
 */
const bodyNodes = content.body.value
const reviewAt = bodyNodes.findIndex(node => Array.isArray(node) && node[0] === 'page-claim-review')
const bodyParts = reviewAt === -1
  ? [content]
  : [bodyNodes.slice(0, reviewAt), bodyNodes.slice(reviewAt + 1)].map(value => ({ ...content, body: { ...content.body, value } }))
</script>

<template>
  <div>
    <PageHero
      :title="content.title"
      :kicker="content.kicker"
      :lead="content.lead"
      :image="content.image?.src"
      :actions="!quiet && !isContact"
      :review-label="isHome ? 'Start A Claims Review' : undefined"
    />

    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20" :class="isContact ? 'grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]' : ''">
      <ContentRenderer :value="bodyParts[0]!" class="post-body page-body" />

      <!-- The contact page's card: how to reach the office, besides the form below. -->
      <aside v-if="isContact" aria-labelledby="contact-card-heading">
        <UICard padding="lg">
          <h2 id="contact-card-heading" class="font-heading text-xl font-bold text-ink">
            {{ business.name }}
          </h2>
          <address class="mt-4 space-y-3 text-sm text-ink-soft not-italic">
            <a :href="business.mapUrl" rel="noopener" class="flex gap-2 hover:text-ink">
              <span class="mt-0.5 icon-[carbon--location] shrink-0 text-accent" aria-hidden="true" />
              {{ addressLine }}
            </a>
            <a :href="business.phoneHref" class="flex gap-2 font-semibold text-ink hover:underline">
              <span class="mt-0.5 icon-[carbon--phone] shrink-0 text-accent" aria-hidden="true" />
              {{ business.phone }}
            </a>
            <a :href="`mailto:${business.email}`" class="flex gap-2 break-all hover:text-ink">
              <span class="mt-0.5 icon-[carbon--email] shrink-0 text-accent" aria-hidden="true" />
              {{ business.email }}
            </a>
            <span class="flex gap-2">
              <span class="mt-0.5 icon-[carbon--time] shrink-0 text-accent" aria-hidden="true" />
              {{ business.hours }}
            </span>
          </address>
        </UICard>
      </aside>
    </div>

    <template v-if="bodyParts.length > 1">
      <ClaimReview :testimonial="content.testimonial" />
      <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <ContentRenderer :value="bodyParts[1]!" class="post-body page-body" />
      </div>
    </template>
    <ClaimReview v-else-if="content.claimForm" :testimonial="content.testimonial" />
    <ClaimTypesGrid v-if="content.claimTypes" :intro="content.claimTypesIntro" />
    <SecondOpinionBand v-if="content.secondOpinion" :variant="isHome ? 'home' : 'page'" />
  </div>
</template>
