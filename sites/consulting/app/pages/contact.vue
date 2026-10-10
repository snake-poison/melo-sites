<script setup lang="ts">
import { practice } from '../data/practice'

useSeoMeta({ title: 'Assignment inquiries | Property Claims Consulting', description: 'Inquire about property insurance appraisal, umpire services, claims consulting, or expert witness support.' })
useHead({ link: [{ rel: 'canonical', href: `${practice.url}/contact/` }] })
</script>

<template>
  <div id="claim-review">
    <section class="service-hero">
      <div class="wrap">
        <UIText variant="kicker" class="eyebrow">
          LET’S DISCUSS THE WORK
        </UIText><UIHeading :level="1">
          Assignment inquiries
        </UIHeading><p class="lead">
          Start with the service you need and the question to be answered.
        </p>
      </div>
    </section><PracticeContact />
  </div>
</template>
