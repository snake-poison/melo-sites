<script setup lang="ts">
import type { NuxtError } from '#app'
import { business } from '~/constants/site'

// GitHub Pages answers a URL it has no file for with 404.html, which is this page.
const props = defineProps<{ error: NuxtError }>()

const notFound = props.error.statusCode === 404
useSeoMeta({ title: notFound ? `Page not found - ${business.shortName}` : `Something went wrong - ${business.shortName}` })
useRobotsRule('noindex, follow')
</script>

<template>
  <NuxtLayout>
    <PageHero
      :title="notFound ? 'We couldn\'t find that page' : 'Something went wrong'"
      kicker="Oops!"
      lead="The page may have moved. Our services, claim types and blog are all a click away below, and an adjuster is a phone call away, 24/7."
      :actions="false"
    />
    <div class="mx-auto flex max-w-6xl flex-wrap gap-3 px-4 py-14 sm:px-6">
      <UILink to="/">
        Home
      </UILink>
      <span aria-hidden="true">·</span>
      <UILink to="/claims-adjuster">
        Our services
      </UILink>
      <span aria-hidden="true">·</span>
      <UILink to="/insurance-claim-type">
        Claim types
      </UILink>
      <span aria-hidden="true">·</span>
      <UILink to="/blog">
        Blog
      </UILink>
      <span aria-hidden="true">·</span>
      <UILink to="/contact">
        Contact
      </UILink>
    </div>
  </NuxtLayout>
</template>
