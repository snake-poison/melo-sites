<script setup lang="ts">
import { claimTypes, claimTypesIntro, services } from '#site'

// The block the service pages shared on the old site: every claim type, each to its own page,
// or on an adjuster page every service (`services`). Some pages gave it their own heading and
// intro (claimTypesIntro in the page's frontmatter); the rest have the site's (in site.ts).
// Each tile shows the photo its page opens on.
const props = defineProps<{ intro?: { title: string, text: string }, services?: boolean }>()
const intro = computed(() => props.intro ?? claimTypesIntro)
const items = computed(() => props.services ? services : claimTypes)

const { data: photos } = await useAsyncData(`claim-type-photos:${props.services === true}`, async () => {
  const paths = items.value.map(item => item.to.replace(/\/$/, ''))
  const pages = await queryCollection('pages').where('path', 'IN', paths).select('path', 'image').all()
  return Object.fromEntries(pages.filter(page => page.image != null).map(page => [`${page.path}/`, page.image!]))
})

// The intro's one Markdown link, split out so it renders as a link: [before, label, to, after].
const introParts = computed(() => {
  const match = /^([^[]*)\[([^\]]+)\]\(([^)]+)\)(.*)$/s.exec(intro.value.text)
  return match == null ? [intro.value.text, '', '', ''] : match.slice(1)
})
</script>

<template>
  <section aria-labelledby="claim-types-heading" class="bg-paper-2 py-16 sm:py-24">
    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h2 id="claim-types-heading" class="font-heading text-3xl/tight font-bold text-ink sm:text-4xl/tight">
        {{ intro.title }}
      </h2>
      <UIText class="mt-4 text-base/relaxed">
        {{ introParts[0] }}<NuxtLink v-if="introParts[2]" :to="introParts[2]" class="font-medium text-accent underline underline-offset-2">
          {{ introParts[1] }}
        </NuxtLink>{{ introParts[3] }}
      </UIText>
    </div>
    <!-- Four to a row, and a shorter last row (three services, a fifth claim type) centred. -->
    <ul class="mx-auto mt-12 flex max-w-6xl flex-wrap justify-center gap-5 px-4 sm:px-6">
      <li v-for="type in items" :key="type.to" class="w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]">
        <article class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-rule-soft bg-paper shadow-sm shadow-ink/5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-ink/10">
          <NuxtPicture
            v-if="photos?.[type.to]"
            :src="photos[type.to]!.src"
            sizes="xs:100vw sm:50vw lg:270px"
            width="540"
            height="360"
            class="block aspect-3/2 overflow-hidden bg-paper-2"
            :img-attrs="{ alt: '', class: 'size-full object-cover transition duration-500 group-hover:scale-105', loading: 'lazy', decoding: 'async' }"
          />
          <div class="flex flex-1 flex-col p-6">
            <span class="relative flex size-11 items-center justify-center rounded-xl text-2xl text-accent" :class="photos?.[type.to] ? '-mt-12 bg-paper-2 shadow-md ring-1 ring-rule-soft' : 'bg-accent-soft'" aria-hidden="true">
              <span :class="type.icon" />
            </span>
            <h3 class="mt-4 font-heading text-xl font-bold text-ink">
              <NuxtLink :to="type.to" class="group-hover:text-accent after:absolute after:inset-0">
                {{ type.label }}
              </NuxtLink>
            </h3>
            <UIText class="mt-1.5 flex-1">
              {{ type.summary }}
            </UIText>
            <span class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent" aria-hidden="true">
              Learn more <span class="icon-[carbon--arrow-right] transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </article>
      </li>
    </ul>
  </section>
</template>
