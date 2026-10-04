<script setup lang="ts">
import { business, mainNav, promise, siteName } from '#site'

// The pages ship no script, so the menus open with CSS alone: the desktop dropdowns on hover
// and on keyboard focus inside them, the phone menu as a <details>.
const route = useRoute()
const reviewHref = await useClaimFormHref()

function isCurrent(to: string): boolean {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <header class="sticky top-0 z-40 text-ink">
    <!-- A top line that sells: the site's promise, and the phone, answered around the clock.
         A phone has the call bar at its foot instead. -->
    <div class="hidden bg-navy-2 text-on-dark sm:block">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-[0.8125rem] sm:px-6">
        <p class="hidden items-center gap-1.5 md:flex">
          <span class="icon-[carbon--checkmark-filled] shrink-0 text-brand" aria-hidden="true" />
          {{ promise }}
        </p>
        <a :href="business.phoneHref" class="ml-auto flex shrink-0 items-center gap-1.5 font-semibold hover:underline xl:hidden">
          <span class="icon-[carbon--phone] text-brand" aria-hidden="true" />
          Call 24/7: {{ business.phone }}
        </a>
        <a :href="business.mapUrl" rel="noopener" class="hidden shrink-0 items-center gap-1.5 text-on-dark/80 hover:text-on-dark hover:underline xl:flex">
          <span class="icon-[carbon--location] text-brand" aria-hidden="true" />
          {{ business.address.city }}, {{ business.address.region }}
        </a>
      </div>
    </div>

    <div class="border-b border-rule-soft bg-paper-2/95 backdrop-blur-md">
      <div class="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <NuxtLink to="/" class="shrink-0" :aria-label="`${siteName} home`">
          <SiteLogo :height="48" />
        </NuxtLink>

        <nav aria-label="Main" class="hidden lg:block">
          <ul class="flex items-center gap-0.5">
            <li v-for="item in mainNav" :key="item.to" class="group relative">
              <NuxtLink
                :to="item.to"
                class="flex items-center gap-1 rounded-lg px-3 py-2 text-[0.9375rem] font-medium transition-colors hover:bg-ink/5"
                :class="isCurrent(item.to) ? 'text-accent' : 'text-ink'"
                :aria-current="route.path === item.to ? 'page' : undefined"
              >
                {{ item.label }}
                <span v-if="item.children" class="icon-[carbon--chevron-down] text-xs" aria-hidden="true" />
              </NuxtLink>
              <ul
                v-if="item.children"
                class="invisible absolute top-full left-0 z-50 min-w-64 translate-y-1 rounded-xl border border-rule-soft bg-paper-2 p-1.5 opacity-0 shadow-xl shadow-ink/10 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
              >
                <li v-for="child in item.children" :key="child.to">
                  <NuxtLink
                    :to="child.to"
                    class="block rounded-lg px-3.5 py-2 text-sm text-ink-soft hover:bg-accent-soft hover:text-ink"
                    :aria-current="route.path === child.to ? 'page' : undefined"
                  >
                    {{ child.label }}
                  </NuxtLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        <div class="flex shrink-0 items-center gap-1.5">
          <a :href="business.phoneHref" class="mr-2 hidden flex-col items-end leading-tight xl:flex">
            <span class="text-xs text-ink-faint">Call 24/7, free</span>
            <span class="font-heading text-lg font-bold text-ink hover:text-accent">{{ business.phone }}</span>
          </a>
          <UIThemeToggle />
          <a
            :href="reviewHref"
            class="hidden rounded-xl bg-brand px-5 py-3 text-[0.9375rem] font-bold text-charcoal transition-colors hover:bg-navy hover:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:inline-flex"
          >
            Free claim review
          </a>

          <details class="group/menu lg:hidden">
            <summary class="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg text-ink hover:bg-ink/6 [&::-webkit-details-marker]:hidden" aria-label="Menu">
              <span class="icon-[carbon--menu] text-2xl group-open/menu:hidden" aria-hidden="true" />
              <span class="icon-[carbon--close] hidden text-2xl group-open/menu:block" aria-hidden="true" />
            </summary>
            <nav aria-label="Main" class="absolute inset-x-0 top-full max-h-[calc(100vh-6rem)] overflow-y-auto border-b border-rule-soft bg-paper-2 px-4 pt-2 pb-6 shadow-xl shadow-ink/10">
              <ul class="divide-y divide-rule-soft">
                <li v-for="item in mainNav" :key="item.to" class="py-2">
                  <NuxtLink :to="item.to" class="block py-1.5 font-semibold text-ink">
                    {{ item.label }}
                  </NuxtLink>
                  <ul v-if="item.children" class="mb-1 ml-3 border-l border-rule-soft pl-3">
                    <li v-for="child in item.children" :key="child.to">
                      <NuxtLink :to="child.to" class="block py-1.5 text-sm text-ink-soft">
                        {{ child.label }}
                      </NuxtLink>
                    </li>
                  </ul>
                </li>
              </ul>
              <a :href="reviewHref" class="mt-4 flex justify-center rounded-xl bg-brand px-4 py-3 text-base font-bold text-charcoal">
                Free claim review
              </a>
              <a :href="business.phoneHref" class="mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-bold text-ink ring-1 ring-rule">
                <span class="icon-[carbon--phone-filled]" aria-hidden="true" />
                {{ business.phone }}
              </a>
            </nav>
          </details>
        </div>
      </div>
    </div>
  </header>
</template>
