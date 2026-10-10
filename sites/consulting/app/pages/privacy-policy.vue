<script setup lang="ts">
import { practice } from '../data/practice'

useSeoMeta({ title: 'Inquiry privacy | Property Claims Consulting', description: 'How Property Claims Consulting uses information submitted through its inquiry forms.' })
useHead({ link: [{ rel: 'canonical', href: `${practice.url}/privacy-policy/` }] })
</script>

<template>
  <section class="section">
    <div class="wrap response-copy">
      <UIText variant="kicker" class="eyebrow">
        YOUR INQUIRY
      </UIText><UIHeading :level="1">
        Inquiry privacy
      </UIHeading><p>Our inquiry forms collect your name, phone number, selected service, and any email address, property location, description, parties, or timing details you choose to provide. We use this information to review your request, consider potential conflicts, contact you, and discuss the proposed assignment.</p><UIHeading :level="2">
        Form processing
      </UIHeading><p>Cloudflare hosts and processes the form and provides the Turnstile spam check. Inquiries are sent to Pipedrive, our customer relationship management provider, for team follow-up. The submission includes the website source and available landing-page information. Advertising identifiers and earlier browsing touches are collected only when measurement consent is granted through the website’s consent controls.</p><UIHeading :level="2">
        Keep the first inquiry brief
      </UIHeading><p>Do not send sensitive documents, financial account details, or confidential claim records through the initial inquiry form. Wait for document-submission instructions. Submitting an inquiry does not establish an engagement.</p><UIHeading :level="2">
        Questions about your information
      </UIHeading><p>Contact <a :href="`mailto:${practice.email}`">{{ practice.email }}</a> to ask about information you submitted or request a correction or deletion. Records may need to be retained for an existing engagement or applicable obligations.</p><p>Provider information: <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare privacy policy</a> and <a href="https://www.pipedrive.com/en/privacy">Pipedrive privacy policy</a>.</p>
    </div>
  </section>
</template>
