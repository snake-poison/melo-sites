<script setup lang="ts">
import { practice, services } from '../data/practice'

const route = useRoute()
const service = services.find(item => item.slug === route.params.service)
if (!service)
  throw createError({ statusCode: 404, statusMessage: 'Service not found' })
useSeoMeta({ title: `${service.name} | Property Claims Consulting | North Carolina`, description: service.description })
useHead({ link: [{ rel: 'canonical', href: `${practice.url}/${service.slug}/` }] })

const otherServices = services.filter(item => item.slug !== service.slug)
const prep = ['The property location and type', 'The parties and professionals involved', 'The disputed items or your questions', 'Any deadlines or timing']
</script>

<template>
  <div v-if="service">
    <section class="service-hero">
      <div class="wrap service-hero-grid">
        <div>
          <a class="breadcrumb" href="/#services">← All services</a><UIText variant="kicker" class="eyebrow">
            {{ service.audience }}
          </UIText><UIHeading :level="1">
            {{ service.title }}
          </UIHeading><p class="lead">
            {{ service.intro }}
          </p><div class="hero-actions">
            <a class="button" href="#contact">Discuss {{ service.name.toLowerCase() }} <span aria-hidden="true">→</span></a><a class="button button-outline" :href="practice.phoneHref"><PracticeIcon kind="phone" />Call {{ practice.phone }}</a>
          </div>
        </div><aside class="inquiry-prep" aria-labelledby="inquiry-prep-title">
          <span class="service-icon"><PracticeIcon :kind="service.icon" /></span><p id="inquiry-prep-title" class="prep-title">
            Have these ready when you inquire
          </p><ul>
            <li v-for="item in prep" :key="item">
              <PracticeIcon kind="check" />{{ item }}
            </li>
          </ul><p class="prep-note">
            No documents are needed yet. We’ll tell you what to send, and how, after the initial review.
          </p>
        </aside>
      </div>
    </section>
    <section class="section">
      <div class="wrap">
        <div class="section-heading">
          <UIText variant="kicker" class="eyebrow">
            THE WORK INVOLVED
          </UIText><UIHeading :level="2">
            A review with a defined purpose.
          </UIHeading>
        </div><div class="detail-grid">
          <article v-for="(item, index) in service.work" :key="item.title" class="detail-card">
            <span class="step-number">0{{ index + 1 }}</span><UIHeading :level="3">
              {{ item.title }}
            </UIHeading><p>{{ item.text }}</p>
          </article>
        </div><div class="role-note">
          <strong>The scope of this service</strong><p>{{ service.scope }}</p>
        </div>
      </div>
    </section>
    <section class="section about-section">
      <div class="wrap faq-layout">
        <div>
          <UIText variant="kicker" class="eyebrow">
            BEFORE YOU INQUIRE
          </UIText><UIHeading :level="2">
            Useful questions,<br>clear answers.
          </UIHeading>
        </div><div class="faqs">
          <details v-for="faq in service.questions" :key="faq.question">
            <summary>{{ faq.question }}</summary><p>{{ faq.answer }}</p>
          </details><details><summary>How are fees and availability confirmed?</summary><p>The proposed assignment is reviewed before acceptance. Scope, timing, travel requirements, and fees are discussed before engagement; sending an inquiry does not create an appointment.</p></details>
        </div>
      </div>
    </section>
    <section class="section other-services">
      <div class="wrap">
        <UIText variant="kicker" class="eyebrow">
          LOOKING FOR A DIFFERENT ROLE?
        </UIText><div class="other-grid">
          <a v-for="item in otherServices" :key="item.slug" :href="`/${item.slug}/`"><span class="service-icon"><PracticeIcon :kind="item.icon" /></span><span><strong>{{ item.name }}</strong>{{ item.short }}</span><span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
    <PracticeContact :service="service.name" />
  </div>
</template>
