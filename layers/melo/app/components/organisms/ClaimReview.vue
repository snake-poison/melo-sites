<script setup lang="ts">
import { business, claimForm, featuredReview } from '#site'

/**
 * The free claims review, as on the old site's service pages: a band the page's width, a
 * client's word over a dark photo beside the form on cyan. Without the testimonial (the contact
 * page) it is the cyan form alone.
 * The pages ship no script, so this is a plain HTML form the browser checks and posts by itself,
 * to the form service in claimForm.action. Until one is set, it offers the phone and email.
 */
const props = withDefaults(defineProps<{
  testimonial?: boolean
}>(), {
  testimonial: true,
})

const field = 'mt-1.5 block w-full border border-rule bg-paper-2 px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-2 focus:outline-ink/40'
const label = 'block text-sm font-semibold text-ink'
</script>

<template>
  <ClaimIntake v-if="claimForm.action === '/api/claim-review'" :testimonial="props.testimonial" />
  <section
    v-else
    id="claim-review"
    aria-labelledby="claim-review-heading"
    class="relative isolate scroll-mt-32"
    :class="props.testimonial ? 'bg-charcoal-2' : 'mx-auto mb-16 max-w-3xl px-4 sm:mb-20 sm:px-6'"
  >
    <template v-if="props.testimonial">
      <NuxtPicture
        src="/wp-content/uploads/2020/02/Header-6.jpg"
        sizes="xs:100vw lg:1600px"
        width="1600"
        height="900"
        class="absolute inset-0 -z-10"
        :img-attrs="{ alt: '', class: 'size-full object-cover', loading: 'lazy', decoding: 'async' }"
      />
      <div class="absolute inset-0 -z-10 bg-charcoal-2/70" aria-hidden="true" />
    </template>

    <div class="mx-auto max-w-6xl" :class="props.testimonial ? 'grid lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)]' : ''">
      <div v-if="props.testimonial" class="flex flex-col items-center justify-center px-4 py-16 text-center text-on-dark sm:px-6 lg:py-20 lg:pr-14">
        <span class="icon-[carbon--chat] text-5xl" aria-hidden="true" />
        <h2 class="mt-2 font-heading text-4xl font-bold sm:text-5xl">
          Testimonials
        </h2>
        <p class="mt-3 text-lg">
          See what our customers have to say:
        </p>
        <p class="mt-4 text-4xl tracking-[0.15em] text-star" role="img" aria-label="Five stars">
          ★★★★★
        </p>
        <NuxtImg
          src="/wp-content/uploads/2020/05/trust-badges-Facebook-Google.png"
          alt="Trusted Brand, and 5-Star Rated on Google and Facebook"
          width="389"
          height="73"
          loading="lazy"
          class="mt-6 h-auto max-w-full"
        />
        <figure class="mt-8 max-w-2xl">
          <blockquote class="text-xl/relaxed italic sm:text-2xl/relaxed">
            “{{ featuredReview.quote }}”
          </blockquote>
          <figcaption class="mt-4 text-lg">
            — {{ featuredReview.name }}
          </figcaption>
        </figure>
      </div>

      <div class="on-brand px-6 py-12 sm:px-10 lg:py-16">
        <h2 id="claim-review-heading" class="font-heading text-3xl font-bold text-ink">
          Start Your FREE Claims Review
        </h2>

        <form v-if="claimForm.action" :action="claimForm.action" method="post" class="mt-6 space-y-6">
          <input v-for="(value, name) in claimForm.hidden" :key="name" type="hidden" :name="name" :value="value">

          <div v-if="claimForm.action === '/api/claim-review'" class="hidden" aria-hidden="true">
            <label>Leave this field empty<input type="text" name="Website" tabindex="-1" autocomplete="off"></label>
          </div>

          <fieldset>
            <legend :class="label">
              What is your loss?
            </legend>
            <div class="mt-2 flex flex-wrap gap-2">
              <label v-for="type in claimForm.lossTypes" :key="type" class="flex cursor-pointer items-center gap-2 border border-rule bg-paper-2 px-3 py-1.5 text-sm text-ink has-checked:border-ink">
                <input type="checkbox" name="Loss type" :value="type" class="accent-charcoal">
                {{ type }}
              </label>
            </div>
          </fieldset>

          <fieldset class="grid gap-4 sm:grid-cols-6">
            <legend :class="label" class="mb-1 sm:col-span-6">
              Loss location
            </legend>
            <label class="text-xs font-medium text-ink sm:col-span-6">Street address
              <input type="text" name="Street address" autocomplete="address-line1" required :class="field">
            </label>
            <label class="text-xs font-medium text-ink sm:col-span-6">Address line 2
              <input type="text" name="Address line 2" autocomplete="address-line2" :class="field">
            </label>
            <label class="text-xs font-medium text-ink sm:col-span-3">City
              <input type="text" name="City" autocomplete="address-level2" required :class="field">
            </label>
            <label class="text-xs font-medium text-ink sm:col-span-1">State
              <input type="text" name="State" autocomplete="address-level1" value="NC" required :class="field">
            </label>
            <label class="text-xs font-medium text-ink sm:col-span-2">ZIP code
              <input type="text" name="ZIP code" autocomplete="postal-code" inputmode="numeric" required :class="field">
            </label>
          </fieldset>

          <label :class="label">Where are you at with your loss?
            <textarea name="Where they are with the loss" rows="3" required placeholder="For example: we filed a claim last week and the insurer's offer seems low." :class="field" />
          </label>

          <div class="grid gap-4 sm:grid-cols-2">
            <label :class="label">First name
              <input type="text" name="First name" autocomplete="given-name" required :class="field">
            </label>
            <label :class="label">Last name
              <input type="text" name="Last name" autocomplete="family-name" required :class="field">
            </label>
            <label :class="label">Phone
              <input type="tel" name="Phone" autocomplete="tel" required :class="field">
            </label>
            <label :class="label">Email
              <input type="email" name="Email" autocomplete="email" required :class="field">
            </label>
          </div>

          <template v-if="claimForm.action === '/api/claim-review'">
            <p class="text-sm text-ink">
              By submitting, you ask Melo Public Adjusters Charlotte to contact you about your claim. <a href="/privacy-policy/" class="underline">Privacy policy</a>.
            </p>
            <div data-claim-captcha />
          </template>

          <button type="submit" class="inline-flex w-full cursor-pointer items-center justify-center bg-charcoal px-8 py-3.5 text-sm font-bold tracking-[0.08em] text-on-dark uppercase transition-colors hover:bg-charcoal-2 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink sm:w-auto">
            Get my free claims review
          </button>
        </form>

        <div v-else class="mt-6 space-y-4">
          <p class="text-ink">
            Tell us about your loss and a licensed public adjuster will review your claim for free.
          </p>
          <div class="flex flex-wrap gap-3">
            <PageCta kind="call" :label="`Call ${business.phone}`" />
            <a :href="`mailto:${business.email}?subject=Free%20claims%20review`" class="inline-flex items-center gap-2 bg-paper-2 px-6 py-3.5 text-sm font-bold tracking-[0.08em] text-ink uppercase hover:bg-on-dark">
              <span class="icon-[carbon--email]" aria-hidden="true" />
              Email us
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
