<script setup lang="ts">
import { practice, services } from '../data/practice'

const route = useRoute()
const isConfirmation = computed(() => route.path.startsWith('/thank-you-page'))
const showMobileCta = computed(() => !route.path.startsWith('/contact') && !route.path.startsWith('/thank-you-page'))
const mobileCtaHref = computed(() => route.path.startsWith('/privacy-policy') ? '/contact/' : '#contact')
</script>

<template>
  <div class="consulting-site">
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="wrap header-inner">
        <PracticeLogo />
        <nav class="desktop-nav" aria-label="Main navigation">
          <a href="/#services">Our services</a><a href="/#ramon">Ramon Melo</a><a href="/#questions">FAQs</a>
        </nav>
        <div class="header-actions">
          <a class="header-phone" :href="practice.phoneHref"><PracticeIcon kind="phone" />{{ practice.phone }}</a><a v-if="!isConfirmation" class="button header-cta" href="/contact/">Discuss an assignment</a>
        </div>
        <details class="mobile-menu">
          <summary aria-label="Open navigation">
            Menu <span aria-hidden="true">☰</span>
          </summary><nav aria-label="Mobile navigation">
            <a href="/#services">Our services</a><a v-for="service in services" :key="service.slug" :href="`/${service.slug}/`">{{ service.name }}</a><a href="/#ramon">Ramon Melo</a><a href="/contact/">Contact</a><a :href="practice.phoneHref">Call {{ practice.phone }}</a>
          </nav>
        </details>
      </div>
    </header>
    <main id="main">
      <slot />
    </main>
    <footer class="site-footer" :class="{ 'confirmation-footer': isConfirmation }">
      <div v-if="!isConfirmation" class="wrap footer-grid">
        <div><PracticeLogo /><p>Property insurance appraisal, umpire services, claims consulting, and expert witness support.</p><a :href="practice.phoneHref">{{ practice.phone }}</a><a :href="`mailto:${practice.email}`">{{ practice.email }}</a></div>
        <nav aria-label="Services">
          <UIHeading :level="2">
            Our services
          </UIHeading><a v-for="service in services" :key="service.slug" :href="`/${service.slug}/`">{{ service.name }}</a>
        </nav>
        <div>
          <UIHeading :level="2">
            Assignment inquiries
          </UIHeading><a href="/contact/">Discuss an assignment <span aria-hidden="true">→</span></a><p class="footer-note">
            Each engagement has its own role, scope, and conflict review.
          </p>
        </div>
      </div><div class="wrap footer-bottom">
        <span>© {{ new Date().getFullYear() }} Property Claims Consulting</span><a href="/privacy-policy/">Privacy policy</a><button type="button" data-measurement-settings hidden>
          Cookie settings
        </button><a v-if="!isConfirmation" href="#main">Back to top ↑</a>
      </div>
    </footer>
    <div v-if="showMobileCta" class="mobile-cta">
      <a class="button button-light" :href="practice.phoneHref"><PracticeIcon kind="phone" />Call</a><a class="button" :href="mobileCtaHref">Discuss an assignment <span aria-hidden="true">→</span></a>
    </div>
  </div>
</template>
