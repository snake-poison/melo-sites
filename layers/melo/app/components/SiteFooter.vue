<script setup lang="ts">
import { addressLine, business, claimTypes, footerNav, footerSocial, licenses, promise, serviceAreas } from '#site'

// Navy in both modes. Name, address and phone are written the same way on every page: local
// search reads them as one business.
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-navy-2 text-on-dark">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
      <div>
        <NuxtLink to="/" :aria-label="`${business.name} home`" class="inline-block">
          <SiteLogo :height="44" on-dark />
        </NuxtLink>
        <p class="mt-4 max-w-xs text-sm/relaxed text-on-dark/70">
          {{ promise }}
        </p>
        <h2 class="mt-6 font-heading text-base font-bold">
          {{ business.name }}
        </h2>
        <address class="mt-3 space-y-2.5 text-[0.9375rem] text-on-dark/85 not-italic">
          <a :href="business.mapUrl" rel="noopener" class="flex gap-2 hover:text-on-dark">
            <span class="mt-1 icon-[carbon--location] shrink-0 text-brand" aria-hidden="true" />
            {{ addressLine }}
          </a>
          <a :href="business.phoneHref" class="flex gap-2 font-semibold text-on-dark hover:underline">
            <span class="mt-1 icon-[carbon--phone] shrink-0 text-brand" aria-hidden="true" />
            {{ business.phone }}
          </a>
          <a :href="`mailto:${business.email}`" class="flex gap-2 break-all hover:text-on-dark">
            <span class="mt-1 icon-[carbon--email] shrink-0 text-brand" aria-hidden="true" />
            {{ business.email }}
          </a>
          <span class="flex gap-2">
            <span class="mt-1 icon-[carbon--time] shrink-0 text-brand" aria-hidden="true" />
            {{ business.hours }}
          </span>
        </address>
        <ul class="mt-4 space-y-1 text-sm text-on-dark/70">
          <li v-for="license in licenses" :key="license" class="flex gap-2">
            <span class="mt-0.5 icon-[carbon--certificate-check] shrink-0 text-brand" aria-hidden="true" />
            {{ license }}
          </li>
        </ul>
        <ul class="mt-5 flex gap-2" :aria-label="`${business.name} elsewhere`">
          <li v-for="profile in footerSocial" :key="profile">
            <a :href="profile" rel="noopener me" class="flex size-10 items-center justify-center rounded-full bg-on-dark/8 text-on-dark hover:bg-brand hover:text-charcoal" :aria-label="profile.split('/')[2]">
              <span
                class="text-xl"
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

      <nav aria-labelledby="footer-claim-types">
        <h2 id="footer-claim-types" class="font-heading text-base font-bold">
          Claim Types
        </h2>
        <ul class="mt-4 space-y-2.5 text-[0.9375rem]">
          <li v-for="type in claimTypes" :key="type.to">
            <NuxtLink :to="type.to" class="text-on-dark/80 hover:text-brand">
              {{ type.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <nav aria-labelledby="footer-getting-around">
        <h2 id="footer-getting-around" class="font-heading text-base font-bold">
          Getting Around
        </h2>
        <ul class="mt-4 space-y-2.5 text-[0.9375rem]">
          <li v-for="link in footerNav" :key="link.to">
            <NuxtLink :to="link.to" class="text-on-dark/80 hover:text-brand">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="font-heading text-base font-bold">
          Service Areas
        </h2>
        <ul class="mt-4 flex flex-wrap gap-2 text-sm">
          <li v-for="area in serviceAreas" :key="area" class="rounded-full px-3 py-1 text-on-dark/85 ring-1 ring-on-dark/20">
            {{ area }}
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-on-dark/10">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-on-dark/65 sm:px-6">
        <p>Copyright © {{ business.shortName }} {{ year }}</p>
        <ul class="flex gap-4">
          <li>
            <button type="button" data-measurement-settings hidden class="hover:text-on-dark hover:underline">
              Measurement settings
            </button>
          </li>
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
