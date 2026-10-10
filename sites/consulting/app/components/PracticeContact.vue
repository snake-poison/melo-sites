<script setup lang="ts">
import { practice, services } from '../data/practice'

withDefaults(defineProps<{ service?: string }>(), { service: 'Assignment' })
</script>

<template>
  <section id="contact" class="section contact-section">
    <div class="wrap contact-grid">
      <div>
        <UIText variant="kicker" class="eyebrow">
          DISCUSS YOUR ASSIGNMENT
        </UIText>
        <UIHeading :level="2">
          Tell us what needs a closer look.
        </UIHeading>
        <p>Start with the service you need, the property location, and a brief description of the matter. Our team will review your inquiry and discuss the next step.</p>
        <ol class="next-steps">
          <li><strong>We review your inquiry</strong>Including the parties involved, for an initial conflict check.</li>
          <li><strong>We discuss the engagement</strong>Role, scope, timing, and fees—before any work begins.</li>
          <li><strong>You decide</strong>An inquiry creates no obligation and no engagement.</li>
        </ol>
        <div class="direct-contact">
          <a class="direct-phone" :href="practice.phoneHref"><PracticeIcon kind="phone" /><span>Prefer to talk it through?<strong>{{ practice.phone }}</strong></span></a>
          <p>Or email <a class="email-link" :href="`mailto:${practice.email}`">{{ practice.email }}</a></p>
        </div>
        <p class="inquiry-note">
          Please wait for document-submission instructions before sending sensitive claim material. Availability, conflicts, scope, and fees are addressed before engagement.
        </p>
      </div>
      <form action="/api/claim-review" method="post" class="inquiry-card assignment-form" aria-label="Assignment inquiry">
        <div class="form-heading">
          <strong>Assignment inquiry</strong><span>Only the service, your name, and a phone number are required.</span>
        </div>
        <div hidden aria-hidden="true">
          <label>Leave this empty<input name="Website" type="text" tabindex="-1" autocomplete="off"></label>
        </div>
        <label>Service requested<select name="Requested service" required><option value="" :selected="service === 'Assignment'" disabled>Select a service</option><option v-for="item in services" :key="item.slug" :value="item.name" :selected="service === item.name">{{ item.name }}</option><option>Help me choose</option></select></label>
        <label>Your name<input name="Name" autocomplete="name" maxlength="200" required></label>
        <div class="assignment-fields">
          <label>Phone number<input type="tel" name="Phone" autocomplete="tel" maxlength="200" required></label><label>Email <span>Optional</span><input type="email" name="Email" autocomplete="email" maxlength="200"></label>
        </div>
        <div class="assignment-fields">
          <label>Property city <span>Optional</span><input name="City" maxlength="200"></label><label>Property state <span>Optional</span><input name="State" placeholder="NC" pattern="[A-Za-z]{2}" maxlength="2"></label>
        </div>
        <label>What needs to be reviewed?<textarea name="Where they are with the loss" rows="3" maxlength="3000" placeholder="Briefly describe the matter and your questions." /></label>
        <details><summary>Add parties and timing <span>Optional</span></summary><label>Parties and professionals involved<input name="Parties involved" maxlength="1000" placeholder="For the initial conflict review"></label><label>Deadlines or timing<input name="Timing" maxlength="1000"></label></details>
        <div data-claim-captcha />
        <button class="button" type="submit">
          Send assignment inquiry <span aria-hidden="true">→</span>
        </button>
        <p>By submitting, you ask Property Claims Consulting to contact you about this assignment. <a href="/privacy-policy/">Privacy policy</a>. Sending an inquiry does not create an engagement.</p>
      </form>
    </div>
  </section>
</template>
