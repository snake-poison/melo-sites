<script setup lang="ts">
import { business, claimForm } from '#site'

/**
 * The free claim review form, a card in the hero of every page that has one (claimForm in its
 * frontmatter). The pages ship no script, so it is a plain HTML form the browser checks and
 * posts by itself to claimForm.action: the Pages worker (public/_worker.js), which reads these
 * fields by name, puts Turnstile in [data-claim-captcha] and saves the intake in Pipedrive.
 * Only the name and phone are required; the rest folds away. Its styles are in
 * assets/css/claim-intake.css: in the hero, it is on most pages, and a component's own styles
 * shared by several pages become a stylesheet of their own, which the pages would have to load.
 */
</script>

<template>
  <section id="claim-review" class="claim-intake" aria-labelledby="claim-review-heading">
    <header class="claim-intake__header">
      <p class="claim-intake__eyebrow">
        Free claim review
      </p>
      <h2 id="claim-review-heading">
        Let’s review your claim.
      </h2>
      <p>Just your name and phone to start. We’ll contact you to talk through your options.</p>
    </header>

    <form :action="claimForm.action" method="post" class="claim-intake__form">
      <input v-for="(value, name) in claimForm.hidden" :key="name" type="hidden" :name="name" :value="value">
      <div hidden aria-hidden="true">
        <label>Leave this field empty<input type="text" name="Website" tabindex="-1" autocomplete="off"></label>
      </div>

      <fieldset class="claim-intake__group">
        <legend class="sr-only">
          Your contact details
        </legend>
        <label>Your name<input type="text" name="Name" autocomplete="name" maxlength="200" required></label>
        <div class="claim-intake__grid claim-intake__contact">
          <label>Phone number<input type="tel" name="Phone" autocomplete="tel" maxlength="200" required></label>
          <label>Email <span class="claim-intake__optional-label">Optional</span><input type="email" name="Email" autocomplete="email" maxlength="200"></label>
        </div>
        <label class="claim-intake__description">What happened? <span class="claim-intake__optional-label">Optional</span>
          <textarea name="Where they are with the loss" rows="2" maxlength="3000" placeholder="A sentence or two about your property damage." />
        </label>
      </fieldset>

      <details class="claim-intake__extra">
        <summary>Add details if you have them <span>Optional</span></summary>
        <p class="claim-intake__extra-hint">
          Skip anything you don’t know. We can collect these details when we talk.
        </p>
        <fieldset class="claim-intake__group">
          <legend>Property address</legend>
          <label>Street address, apartment or unit<input type="text" name="Street address" autocomplete="address-line1" maxlength="200"></label>
          <div class="claim-intake__location">
            <label>City<input type="text" name="City" autocomplete="address-level2" maxlength="200"></label>
            <label>State<input type="text" name="State" autocomplete="address-level1" :placeholder="claimForm.statePlaceholder" pattern="[A-Za-z]{2}" maxlength="2"></label>
            <label>ZIP<input type="text" name="ZIP code" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{5}(-[0-9]{4})?" maxlength="10"></label>
          </div>
        </fieldset>
        <fieldset class="claim-intake__group">
          <legend>Insurance &amp; loss</legend>
          <div class="claim-intake__grid">
            <label>Insurance company<input type="text" name="Insurance Company" maxlength="200"></label>
            <label>Date of loss<input type="date" name="Date of Loss"></label>
            <label>Policy number<input type="text" name="Policy Number" maxlength="200"></label>
            <label>Claim number<input type="text" name="Claim Number" maxlength="200"></label>
            <label class="claim-intake__wide">Cause of loss<input type="text" name="Cause of Loss" maxlength="200" placeholder="e.g. Fallen tree, burst pipe or fire"></label>
          </div>
        </fieldset>
      </details>

      <footer class="claim-intake__submit">
        <div data-claim-captcha />
        <button type="submit">
          Get my free claim review <span class="icon-[carbon--arrow-right]" aria-hidden="true" />
        </button>
        <p>By submitting, you ask {{ business.name }} to contact you about your claim. <a href="/privacy-policy/">Privacy policy</a>.</p>
      </footer>
    </form>
  </section>
</template>
