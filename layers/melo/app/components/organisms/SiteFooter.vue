<script setup lang="ts">
import { addressLine, business, footerNav, footerSocial, serviceAreas } from '#site'

// Charcoal in both modes, as the old site's footer was. Name, address and phone are written the
// same way on every page: local search reads them as one business.
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-charcoal text-on-dark">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
      <div>
        <h2 class="font-heading text-xl font-bold text-on-dark/75">
          {{ business.name }}
        </h2>
        <address class="mt-5 space-y-3 text-[0.9375rem] text-on-dark/85 not-italic">
          <a :href="business.mapUrl" rel="noopener" class="flex gap-2 hover:text-on-dark">
            <span class="mt-0.5 icon-[carbon--location] shrink-0 text-brand" aria-hidden="true" />
            {{ addressLine }}
          </a>
          <a :href="business.phoneHref" class="flex gap-2 font-semibold text-on-dark hover:underline">
            <span class="mt-0.5 icon-[carbon--phone] shrink-0 text-brand" aria-hidden="true" />
            {{ business.phone }}
          </a>
          <a :href="`mailto:${business.email}`" class="flex gap-2 break-all hover:text-on-dark">
            <span class="mt-0.5 icon-[carbon--email] shrink-0 text-brand" aria-hidden="true" />
            {{ business.email }}
          </a>
          <span class="flex gap-2">
            <span class="mt-0.5 icon-[carbon--time] shrink-0 text-brand" aria-hidden="true" />
            {{ business.hours }}
          </span>
        </address>
        <ul class="mt-6 flex gap-3" :aria-label="`${business.name} elsewhere`">
          <li v-for="profile in footerSocial" :key="profile">
            <a :href="profile" rel="noopener me" class="flex size-10 items-center justify-center text-on-dark hover:text-brand" :aria-label="profile.split('/')[2]">
              <span
                class="text-2xl"
                :class="{
                  'icon-[carbon--logo-facebook]': profile.includes('facebook'),
                  'icon-[carbon--logo-x]': profile.includes('twitter'),
                  'icon-[carbon--logo-youtube]': profile.includes('youtube'),
                  'icon-[carbon--logo-instagram]': profile.includes('instagram'),
                }"
                aria-hidden="true"
              />
            </a>
          </li>
        </ul>
      </div>

      <nav aria-labelledby="footer-getting-around">
        <h2 id="footer-getting-around" class="font-heading text-xl font-bold text-on-dark/75">
          Getting Around
        </h2>
        <ul class="mt-5 space-y-2.5">
          <li v-for="link in footerNav" :key="link.to">
            <NuxtLink :to="link.to" class="flex items-center gap-2.5 text-on-dark hover:text-brand">
              <span class="icon-[carbon--chevron-right] shrink-0 rounded-full border border-brand text-sm text-brand" aria-hidden="true" />
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="font-heading text-xl font-bold text-on-dark/75">
          Service Areas
        </h2>
        <ul class="mt-5 space-y-2.5 text-on-dark">
          <li v-for="area in serviceAreas" :key="area" class="flex items-center gap-2.5">
            <span class="icon-[carbon--chevron-right] shrink-0 rounded-full border border-brand text-sm text-brand" aria-hidden="true" />
            {{ area }}
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-on-dark/10">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-on-dark/70 sm:px-6">
        <p>Copyright © {{ business.shortName }} {{ year }}</p>
        <ul class="flex gap-4">
          <li>
            <NuxtLink to="/privacy-policy/" class="hover:text-on-dark hover:underline">
              Privacy
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/terms-conditions/" class="hover:text-on-dark hover:underline">
              Terms & Conditions
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
