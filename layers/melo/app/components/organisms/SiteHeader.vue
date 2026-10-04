<script setup lang="ts">
import { addressLine, business, mainNav, siteName } from '#site'

// The pages ship no script, so the menus open with CSS alone: the desktop dropdowns on hover
// and on keyboard focus inside them, the phone menu as a <details>.
const route = useRoute()

function isCurrent(to: string): boolean {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <header class="sticky top-0 z-40 text-ink">
    <!-- The old site's top line: where the office is, and the phone, open around the clock. -->
    <div class="bg-charcoal-2 text-on-dark">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-[0.8125rem] sm:px-6">
        <a :href="business.mapUrl" rel="noopener" class="hidden items-center gap-1.5 hover:underline sm:flex">
          <span class="icon-[carbon--location] text-brand" aria-hidden="true" />
          {{ addressLine }}
        </a>
        <a :href="business.phoneHref" class="ml-auto flex items-center gap-1.5 font-semibold hover:underline sm:ml-0">
          <span class="icon-[carbon--phone] text-brand" aria-hidden="true" />
          Call us 24/7: {{ business.phone }}
        </a>
      </div>
    </div>

    <div class="border-b border-rule-soft bg-paper-2 shadow-sm shadow-ink/5">
      <div class="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <NuxtLink to="/" class="shrink-0" :aria-label="`${siteName} home`">
          <SiteLogo :height="48" />
        </NuxtLink>

        <nav aria-label="Main" class="hidden lg:block">
          <ul class="flex items-center gap-0.5">
            <li v-for="item in mainNav" :key="item.to" class="group relative">
              <NuxtLink
                :to="item.to"
                class="flex items-center gap-1 border-b-2 px-3 py-2 text-[0.9375rem] font-medium text-accent transition-colors"
                :class="isCurrent(item.to) ? 'border-brand' : 'border-transparent hover:border-brand'"
                :aria-current="route.path === item.to ? 'page' : undefined"
              >
                {{ item.label }}
                <span v-if="item.children" class="icon-[carbon--chevron-down] text-xs" aria-hidden="true" />
              </NuxtLink>
              <ul
                v-if="item.children"
                class="invisible absolute top-full left-0 z-50 min-w-60 translate-y-1 border-t-2 border-brand bg-paper-2 py-1.5 opacity-0 shadow-xl shadow-ink/10 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
              >
                <li v-for="child in item.children" :key="child.to">
                  <NuxtLink
                    :to="child.to"
                    class="block px-4 py-2 text-sm text-ink-soft hover:bg-accent-soft hover:text-ink"
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
          <UIThemeToggle />
          <NuxtLink
            to="/contact/"
            class="hidden bg-brand px-5 py-3 text-sm font-bold tracking-[0.08em] text-charcoal uppercase transition-colors hover:bg-charcoal hover:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:inline-flex"
          >
            Free claim review
          </NuxtLink>

          <details class="group/menu lg:hidden">
            <summary class="flex size-10 cursor-pointer list-none items-center justify-center text-ink hover:bg-ink/6 [&::-webkit-details-marker]:hidden" aria-label="Menu">
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
              <NuxtLink to="/contact/" class="mt-4 flex justify-center bg-brand px-4 py-3 text-sm font-bold tracking-[0.08em] text-charcoal uppercase">
                Free claim review
              </NuxtLink>
            </nav>
          </details>
        </div>
      </div>
    </div>
  </header>
</template>
