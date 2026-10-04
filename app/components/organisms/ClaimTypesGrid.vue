<script setup lang="ts">
import { claimTypes } from '~/constants/site'

// The block the service pages shared on the old site: every claim type, each to its own page.
// Some pages gave it their own heading and intro (claimTypesIntro in the page's frontmatter).
const props = defineProps<{ intro?: { title: string, text: string } }>()

// The intro's one Markdown link, split out so it renders as a link: [before, label, to, after].
const introParts = computed(() => {
  if (props.intro == null) {
    return null
  }
  const match = /^([^[]*)\[([^\]]+)\]\(([^)]+)\)(.*)$/s.exec(props.intro.text)
  return match == null ? [props.intro.text, '', '', ''] : match.slice(1)
})
</script>

<template>
  <section aria-labelledby="claim-types-heading" class="bg-paper-2 py-16 sm:py-20">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h2 id="claim-types-heading" class="font-heading text-3xl font-bold text-ink sm:text-4xl">
        {{ props.intro?.title ?? 'Insurance Adjuster for Many Types of Claims' }}
      </h2>
      <UIText v-if="introParts" class="mt-4 text-base/relaxed">
        {{ introParts[0] }}<NuxtLink v-if="introParts[2]" :to="introParts[2]" class="font-medium text-accent underline underline-offset-2">
          {{ introParts[1] }}
        </NuxtLink>{{ introParts[3] }}
      </UIText>
      <UIText v-else class="mt-4 text-base/relaxed">
        Do you have a property loss claim that needs to be filed but your insurance policy makes no
        sense? No worries! Melo Public Adjusters Charlotte is here to help. We offer a series of
        different
        <NuxtLink to="/insurance-claim-type/" class="font-medium text-accent underline underline-offset-2">
          insurance claim types
        </NuxtLink>
        that range from storm & wind damage to losses from house fires. Call us today to get the
        compensation you're paying for.
      </UIText>
    </div>
    <ul class="mx-auto mt-10 grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
      <li v-for="type in claimTypes" :key="type.to">
        <UICard as="article" padding="lg" class="relative h-full border-t-4 border-t-brand shadow-lg shadow-ink/8 transition-shadow hover:shadow-xl hover:shadow-ink/14">
          <span class="block text-4xl text-accent" aria-hidden="true">
            <span :class="type.icon" />
          </span>
          <h3 class="mt-4 font-heading text-xl font-bold text-ink">
            <NuxtLink :to="type.to" class="after:absolute after:inset-0 hover:text-accent">
              {{ type.label }}
            </NuxtLink>
          </h3>
          <UIText class="mt-1">
            {{ type.summary }}
          </UIText>
        </UICard>
      </li>
    </ul>
  </section>
</template>
