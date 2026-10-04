<script setup lang="ts">
import { claimTypes, claimTypesIntro, services } from '#site'

// The block the service pages shared on the old site: every claim type, each to its own page,
// or on an adjuster page every service (`services`). Some pages gave it their own heading and
// intro (claimTypesIntro in the page's frontmatter); the rest have the site's (in site.ts).
const props = defineProps<{ intro?: { title: string, text: string }, services?: boolean }>()
const intro = computed(() => props.intro ?? claimTypesIntro)
const items = computed(() => props.services ? services : claimTypes)

// The intro's one Markdown link, split out so it renders as a link: [before, label, to, after].
const introParts = computed(() => {
  const match = /^([^[]*)\[([^\]]+)\]\(([^)]+)\)(.*)$/s.exec(intro.value.text)
  return match == null ? [intro.value.text, '', '', ''] : match.slice(1)
})
</script>

<template>
  <section aria-labelledby="claim-types-heading" class="bg-paper-2 py-16 sm:py-20">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h2 id="claim-types-heading" class="font-heading text-3xl font-bold text-ink sm:text-4xl">
        {{ intro.title }}
      </h2>
      <UIText class="mt-4 text-base/relaxed">
        {{ introParts[0] }}<NuxtLink v-if="introParts[2]" :to="introParts[2]" class="font-medium text-accent underline underline-offset-2">
          {{ introParts[1] }}
        </NuxtLink>{{ introParts[3] }}
      </UIText>
    </div>
    <!-- Four to a row, and a shorter last row (three services, a fifth claim type) centred. -->
    <ul class="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center gap-6 px-4 sm:px-6">
      <li v-for="type in items" :key="type.to" class="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]">
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
