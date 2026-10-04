<script setup lang="ts">
import { business, claimForm, featuredReview } from '#site'

withDefaults(defineProps<{ testimonial?: boolean }>(), { testimonial: true })
</script>

<template>
  <section id="claim-review" class="claim-intake" :class="{ 'claim-intake--contact': !testimonial }" aria-labelledby="claim-review-heading">
    <div class="claim-intake__layout">
      <aside v-if="testimonial" class="claim-intake__intro">
        <p class="claim-intake__eyebrow">
          A team on your side
        </p>
        <h2>You don’t have to navigate your claim alone.</h2>
        <p class="claim-intake__lead">
          Tell us about your property damage. We’ll help you understand the next steps.
        </p>
        <div class="claim-intake__steps">
          <p><span>01</span> Share a few details about your loss.</p>
          <p><span>02</span> Our team reviews your request.</p>
          <p><span>03</span> We contact you to discuss your options.</p>
        </div>
        <figure v-if="featuredReview" class="claim-intake__quote">
          <p class="claim-intake__stars" role="img" aria-label="Five stars">
            ★★★★★
          </p>
          <blockquote>“{{ featuredReview.quote }}”</blockquote>
          <figcaption>{{ featuredReview.name }} <span>· Client review</span></figcaption>
        </figure>
        <a class="claim-intake__call" :href="business.phoneHref">
          <span class="icon-[carbon--phone]" aria-hidden="true" />
          Prefer to talk? {{ business.phone }}
        </a>
      </aside>

      <div class="claim-intake__card">
        <header class="claim-intake__header">
          <p class="claim-intake__eyebrow">
            Free claim review
          </p>
          <h2 id="claim-review-heading">
            Let’s review your claim.
          </h2>
          <p>Have your policy and claim number handy. Our team will review the details and contact you.</p>
        </header>

        <form :action="claimForm.action" method="post" class="claim-intake__form">
          <input v-for="(value, name) in claimForm.hidden" :key="name" type="hidden" :name="name" :value="value">
          <div hidden aria-hidden="true">
            <label>Leave this field empty<input type="text" name="Website" tabindex="-1" autocomplete="off"></label>
          </div>

          <fieldset class="claim-intake__group">
            <legend>Policyholder</legend>
            <div class="claim-intake__grid">
              <label>Legal first name<input type="text" name="First name" autocomplete="given-name" maxlength="200" required></label>
              <label>Legal last name<input type="text" name="Last name" autocomplete="family-name" maxlength="200" required></label>
              <label>Phone<input type="tel" name="Phone" autocomplete="tel" maxlength="200" required></label>
              <label>Email<input type="email" name="Email" autocomplete="email" maxlength="200" required></label>
            </div>
          </fieldset>
          <fieldset class="claim-intake__group">
            <legend>Insured property</legend>
            <label>Street address, apartment or unit<input type="text" name="Street address" autocomplete="address-line1" maxlength="200" required></label>
            <div class="claim-intake__location">
              <label>City<input type="text" name="City" autocomplete="address-level2" maxlength="200" required></label>
              <label>State<input type="text" name="State" autocomplete="address-level1" :value="business.address.region" pattern="[A-Z]{2}" maxlength="2" required></label>
              <label>ZIP<input type="text" name="ZIP code" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{5}(-[0-9]{4})?" maxlength="10" required></label>
            </div>
          </fieldset>
          <fieldset class="claim-intake__group">
            <legend>Insurance &amp; loss</legend>
            <div class="claim-intake__grid">
              <label>Insurance company<input type="text" name="Insurance Company" maxlength="200" placeholder="e.g. Foremost Insurance" required></label>
              <label>Date of loss<input type="date" name="Date of Loss" required></label>
              <label>Policy number<input type="text" name="Policy Number" maxlength="200" required></label>
              <label>Claim number<input type="text" name="Claim Number" maxlength="200" required></label>
              <label class="claim-intake__wide">Cause of loss<input type="text" name="Cause of Loss" maxlength="200" placeholder="e.g. Fallen tree, burst pipe or fire" required></label>
            </div>
            <details class="claim-intake__optional">
              <summary>Add more about your claim <span>Optional</span></summary>
              <label>What else should we know?<textarea name="Where they are with the loss" rows="2" maxlength="3000" /></label>
            </details>
          </fieldset>

          <footer class="claim-intake__submit">
            <div data-claim-captcha />
            <button type="submit">
              Request my free review <span class="icon-[carbon--arrow-right]" aria-hidden="true" />
            </button>
            <p>By submitting, you ask {{ business.name }} to contact you about your claim. <a href="/privacy-policy/">Privacy policy</a>.</p>
          </footer>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.claim-intake {
  scroll-margin-top: 8rem;
  padding: clamp(3rem, 6vw, 6rem) 1.5rem;
  background: var(--machine-paper);
  color: var(--machine-ink);
}

.claim-intake__layout {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  align-items: start;
  gap: clamp(2.5rem, 6vw, 6rem);
  max-width: 72rem;
  margin: 0 auto;
}

.claim-intake__intro {
  padding-top: 2.5rem;
}
.claim-intake__eyebrow {
  margin: 0 0 0.875rem;
  color: var(--machine-accent);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.claim-intake__intro h2 {
  max-width: 12ch;
  margin: 0;
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 700;
  line-height: 1.13;
  letter-spacing: -0.035em;
}
.claim-intake__lead {
  max-width: 35ch;
  margin-top: 1.5rem;
  color: var(--machine-ink-soft);
  font-size: 1rem;
  line-height: 1.7;
}
.claim-intake__steps {
  display: grid;
  gap: 1.125rem;
  margin: 2.25rem 0 3rem;
}
.claim-intake__steps p {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin: 0;
  font-size: 0.875rem;
}
.claim-intake__steps span {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  flex: none;
  border: 1px solid var(--machine-rule-soft);
  border-radius: 50%;
  background: var(--machine-paper-2);
  color: var(--machine-accent);
  font-size: 0.65rem;
  font-weight: 700;
}
.claim-intake__quote {
  margin: 0;
  padding-top: 2rem;
  border-top: 1px solid var(--machine-rule);
}
.claim-intake__stars {
  margin: 0 0 1rem;
  color: var(--machine-accent);
  font-size: 0.9rem;
  letter-spacing: 0.18em;
}
.claim-intake__quote blockquote {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.7;
}
.claim-intake__quote figcaption {
  margin-top: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}
.claim-intake__quote figcaption span {
  color: var(--machine-ink-faint);
  font-weight: 400;
}
.claim-intake__call {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
  color: var(--machine-ink-soft);
  font-size: 0.8rem;
  text-decoration: none;
}
.claim-intake__call:hover {
  color: var(--machine-accent);
}
.claim-intake__card {
  overflow: hidden;
  padding: clamp(1.25rem, 2vw, 1.75rem);
  border: 1px solid var(--machine-rule-soft);
  border-radius: 1.5rem;
  background: var(--machine-paper-2);
  box-shadow: 0 12px 40px rgb(0 0 0 / 4%);
}
.claim-intake__header h2 {
  margin: 0;
  font-size: clamp(1.75rem, 2.7vw, 2.125rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.035em;
}
.claim-intake__header > p:last-child {
  max-width: 43ch;
  margin: 0.75rem 0 0;
  color: var(--machine-ink-soft);
  font-size: 0.875rem;
  line-height: 1.65;
}
.claim-intake__form {
  margin-top: 1.25rem;
}
.claim-intake__group {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.claim-intake__group + .claim-intake__group {
  margin-top: 1.125rem;
}
.claim-intake__group legend {
  width: 100%;
  margin-bottom: 0.625rem;
  font-size: 0.875rem;
  font-weight: 650;
}
.claim-intake__group legend > span {
  margin-right: 0.5rem;
  color: var(--machine-ink-faint);
  font-size: 0.65rem;
  font-weight: 500;
}
.claim-intake__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
}
.claim-intake__wide {
  grid-column: 1 / -1;
}
.claim-intake__group label {
  display: block;
  min-width: 0;
  font-size: 0.75rem;
  font-weight: 500;
}
.claim-intake__group input:not([type='checkbox']),
.claim-intake__group textarea {
  display: block;
  width: 100%;
  margin-top: 0.375rem;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--machine-rule);
  border-radius: 0.5rem;
  background: var(--machine-paper-2);
  color: var(--machine-ink);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
  transition:
    border-color 150ms,
    box-shadow 150ms;
}
.claim-intake__group textarea {
  resize: vertical;
  min-height: 6rem;
}
.claim-intake__group input::placeholder,
.claim-intake__group textarea::placeholder {
  color: var(--machine-ink-faint);
  font-size: 0.8125rem;
}
.claim-intake__group input:focus,
.claim-intake__group textarea:focus {
  border-color: var(--machine-accent);
  outline: none;
  box-shadow: 0 0 0 3px var(--machine-accent-soft);
}
.claim-intake__hint {
  margin: -0.5rem 0 0.75rem;
  color: var(--machine-ink-faint);
  font-size: 0.75rem;
}
.claim-intake__damage {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}
.claim-intake__damage label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--machine-rule);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 400;
  transition:
    background 150ms,
    border-color 150ms;
}
.claim-intake__damage label:hover {
  border-color: var(--machine-accent);
}
.claim-intake__damage label:has(:checked) {
  border-color: var(--machine-accent);
  background: var(--machine-accent-soft);
}
.claim-intake__damage input {
  width: 1rem;
  height: 1rem;
  flex: none;
  margin: 0;
  accent-color: var(--machine-accent);
}
.claim-intake__description {
  margin-top: 0.625rem;
}
.claim-intake__optional {
  margin-top: 0.75rem;
}
.claim-intake__optional summary {
  width: fit-content;
  color: var(--machine-accent);
  font-size: 0.75rem;
  cursor: pointer;
}
.claim-intake__optional summary span {
  margin-left: 0.25rem;
  color: var(--machine-ink-faint);
  font-size: 0.65rem;
}
.claim-intake__optional label {
  margin-top: 0.75rem;
}
.claim-intake__location {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 0.75rem;
  margin-top: 0.625rem;
}
.claim-intake__submit {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--machine-rule-soft);
}
.claim-intake__submit button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 3.25rem;
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: 0.625rem;
  background: var(--machine-accent);
  color: var(--machine-paper-2);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    filter 150ms,
    transform 150ms;
}
.claim-intake__submit button:hover {
  filter: brightness(0.92);
  transform: translateY(-1px);
}
.claim-intake__submit button:focus-visible,
.claim-intake__call:focus-visible,
.claim-intake__optional summary:focus-visible {
  outline: 2px solid var(--machine-accent);
  outline-offset: 4px;
}
.claim-intake__submit > p {
  margin: 0.875rem 0 0;
  color: var(--machine-ink-faint);
  font-size: 0.6875rem;
  line-height: 1.65;
}
.claim-intake__submit > p a {
  text-decoration: underline;
  text-underline-offset: 2px;
}
.claim-intake--contact {
  padding-top: 0;
}
.claim-intake--contact .claim-intake__layout {
  display: block;
  max-width: 48rem;
}

@media (max-width: 800px) {
  .claim-intake {
    padding: 2.5rem 1rem;
  }
  .claim-intake__layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
    max-width: 48rem;
  }
  .claim-intake__intro {
    padding: 0 0.5rem;
  }
  .claim-intake__intro h2 {
    max-width: 20ch;
    font-size: 2rem;
  }
  .claim-intake__steps {
    margin: 1.5rem 0 0;
    gap: 0.875rem;
  }
  .claim-intake__quote {
    margin-top: 1.75rem;
    padding-top: 1.5rem;
  }
  .claim-intake__quote blockquote {
    font-size: 1rem;
  }
  .claim-intake__call {
    margin-top: 1.25rem;
  }
  .claim-intake__card {
    padding: 1.5rem;
    border-radius: 1.125rem;
  }
  .claim-intake--contact {
    padding-top: 0;
  }
}

@media (max-width: 420px) {
  .claim-intake__grid {
    column-gap: 0.75rem;
  }
  .claim-intake__grid label:nth-child(n + 3) {
    grid-column: 1 / -1;
  }
  .claim-intake__damage {
    grid-template-columns: minmax(0, 1fr);
  }
  .claim-intake__location {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .claim-intake__location label:first-child {
    grid-column: 1 / -1;
  }
}
</style>
