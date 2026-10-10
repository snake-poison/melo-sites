<script setup lang="ts">
import { practice, services } from '../data/practice'

useSeoMeta({ title: 'Property Insurance Appraisal & Expert Services in NC | Property Claims Consulting', description: 'Property insurance appraisal, umpire services, claims consulting, and expert witness support in North Carolina.' })
useHead({ link: [{ rel: 'canonical', href: `${practice.url}/` }] })

const trust = [
  { icon: 'person', title: 'Ramon Melo', text: 'Insurance adjusting & property-claims background' },
  { icon: 'shield', title: 'Conflicts reviewed first', text: 'Role and prior involvement checked before acceptance' },
  { icon: 'home', title: 'Residential & commercial', text: 'Property insurance matters' },
  { icon: 'pin', title: 'North Carolina', text: 'Location and inspection needs confirmed per matter' },
]
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <UIText variant="kicker" class="eyebrow">
            PROPERTY CLAIMS CONSULTING · NORTH CAROLINA
          </UIText><UIHeading :level="1">
            Property insurance appraisal.<br><span>Umpire & expert support.</span>
          </UIHeading><p class="lead">
            A careful look at the damage, repair scope, and valuation behind a disputed property claim—grounded in property-claims experience.
          </p><div class="hero-actions">
            <a class="button" href="#contact">Discuss your assignment <span aria-hidden="true">→</span></a><a class="button button-outline" :href="practice.phoneHref"><PracticeIcon kind="phone" />Call {{ practice.phone }}</a>
          </div><nav class="path-picker" aria-labelledby="path-picker-title">
            <p id="path-picker-title">
              Start with your situation
            </p><a v-for="service in services" :key="service.slug" :href="`/${service.slug}/`"><PracticeIcon :kind="service.icon" /><span>{{ service.prompt }}</span><span aria-hidden="true">→</span></a>
          </nav>
        </div>
        <div class="hero-visual">
          <img src="/images/property-review.jpg" width="1200" height="800" alt="An insurance professional inspecting a storm-damaged property"><div class="photo-label">
            <span>THE PROPERTY. THE SCOPE. THE EVIDENCE.</span><p>Good analysis starts<br>with the details.</p>
          </div><span class="image-caption">Illustrative property inspection</span>
        </div>
      </div>
    </section>
    <div class="trust-strip">
      <ul class="wrap">
        <li v-for="item in trust" :key="item.title">
          <PracticeIcon :kind="item.icon" /><span><strong>{{ item.title }}</strong>{{ item.text }}</span>
        </li>
      </ul>
    </div>
    <section id="services" class="section">
      <div class="wrap">
        <div class="section-heading scroll-reveal">
          <UIText variant="kicker" class="eyebrow">
            HOW WE CAN HELP
          </UIText><UIHeading :level="2">
            The right service for the question at hand.
          </UIHeading><p>A disputed loss amount, an appraisal-panel appointment, a claim file to review, or a matter headed toward litigation. Start with the work you need.</p>
        </div><div class="service-grid">
          <article v-for="service in services" :key="service.slug" class="service-card scroll-reveal">
            <span class="service-icon"><PracticeIcon :kind="service.icon" /></span><UIText variant="kicker" class="card-kicker">
              {{ service.short }}
            </UIText><UIHeading :level="3">
              <a :href="`/${service.slug}/`">{{ service.name }}</a>
            </UIHeading><p>{{ service.card }}</p><span class="service-link" aria-hidden="true">Explore {{ service.name.toLowerCase() }} <span>→</span></span>
          </article>
        </div><div class="choose-band scroll-reveal">
          <p><strong>Not sure which role fits?</strong> Describe the matter and choose “Help me choose.” We’ll discuss which service, if any, suits it.</p><a class="button button-outline" href="#contact">Help me choose <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
    <section id="ramon" class="section about-section">
      <div class="wrap about-grid">
        <div class="profile-panel scroll-reveal">
          <img class="profile-photo" src="/images/ramon-melo.jpg" width="720" height="897" alt="Ramon Melo" loading="lazy"><UIText variant="kicker" class="eyebrow">
            THE EXPERIENCE BEHIND THE WORK
          </UIText><UIHeading :level="2">
            Ramon Melo
          </UIHeading><p>Insurance adjusting & property claims</p><a href="#contact">Discuss your assignment <span aria-hidden="true">→</span></a>
        </div><div class="about-copy scroll-reveal">
          <UIText variant="kicker" class="eyebrow">
            ROOTED IN PROPERTY CLAIMS
          </UIText><UIHeading :level="2">
            Property-claims experience.<br>Personal attention.
          </UIHeading><p class="section-lead">
            Ramon Melo’s background includes insurance adjusting and residential and commercial property losses.
          </p><p>Property Claims Consulting brings that background to appraisal, umpire assignments, focused claim review, and expert support. The work starts with understanding the damage, the records, and the question that needs to be answered.</p><p>We focus on personal attention and plain explanations. You should understand what is being reviewed, what the findings support, and what the next step involves.</p><div class="role-note">
            <strong>Clearly defined roles.</strong><p>Public adjusting represents the policyholder. An umpire serves an impartial role. Appraisal, consulting, and expert work each have their own scope and requirements. Those distinctions are addressed before engagement.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap work-grid">
        <div>
          <UIText variant="kicker" class="eyebrow">
            WHAT WE EXAMINE
          </UIText><UIHeading :level="2">
            Beyond the estimate total.
          </UIHeading><p>A useful review connects the claimed damage to the repair scope and the information supporting the valuation.</p><ReviewGraphic />
        </div><div class="review-list scroll-reveal">
          <article>
            <UIHeading :level="3">
              Damage & documentation
            </UIHeading><p>Photographs, inspection findings, reports, and the available claim record.</p>
          </article><article>
            <UIHeading :level="3">
              Repair scope & valuation
            </UIHeading><p>Differences in quantities, repair assumptions, estimates, and the amount of loss.</p>
          </article><article>
            <UIHeading :level="3">
              The assignment’s purpose
            </UIHeading><p>The questions to be answered and the analysis or documentation the engagement requires.</p>
          </article>
        </div>
      </div>
    </section>
    <section class="process-band">
      <div class="wrap">
        <div class="section-heading scroll-reveal">
          <UIText variant="kicker" class="eyebrow">
            GETTING STARTED
          </UIText><UIHeading :level="2">
            A practical process from the first conversation.
          </UIHeading>
        </div><ol class="steps">
          <li class="scroll-reveal">
            <span>01</span><UIHeading :level="3">
              Tell us about the matter
            </UIHeading><p>Share the service, property location, parties, and the questions or disputed items.</p>
          </li><li class="scroll-reveal">
            <span>02</span><UIHeading :level="3">
              Define the engagement
            </UIHeading><p>Discuss availability, qualifications, potential conflicts, scope, timing, and fees.</p>
          </li><li class="scroll-reveal">
            <span>03</span><UIHeading :level="3">
              Review the evidence
            </UIHeading><p>Provide the requested records so the analysis can address the agreed questions.</p>
          </li>
        </ol><div class="process-cta">
          <a class="button button-light" href="#contact">Start with step one <span aria-hidden="true">→</span></a><span>An inquiry creates no obligation or engagement.</span>
        </div>
      </div>
    </section>
    <section id="questions" class="section">
      <div class="wrap faq-layout scroll-reveal">
        <div>
          <UIText variant="kicker" class="eyebrow">
            COMMON QUESTIONS
          </UIText><UIHeading :level="2">
            Know which role<br>you need.
          </UIHeading><p>Start here if you’re deciding between appraisal, consulting, or representation.</p>
        </div><div class="faqs">
          <details><summary>How do appraisal and umpire services differ?</summary><p>The parties select appraisers under the policy’s appraisal provision. An umpire considers differences the appraisers cannot resolve. The policy and applicable law establish the requirements and scope of each role.</p></details><details><summary>Is this the same as hiring a public adjuster?</summary><p>No. Public adjusting includes representing a policyholder in a claim. This practice offers appraisal, umpire, consulting, and expert services with a defined scope. For claim representation, visit <a :href="practice.firmUrl">Melo Property Claims</a>.</p></details><details><summary>Can attorneys inquire about expert witness support?</summary><p>Yes. Tell us the subject matter, parties, deadlines, and whether you need consulting analysis or a testifying expert. Suitability and relevant qualifications are discussed before engagement.</p></details><details><summary>Do you review residential and commercial matters?</summary><p>Yes. Include the property type, city and state, type of loss, and the service you need. Location, inspection requirements, and availability are confirmed for each assignment.</p></details><details><summary>What if you have already been involved in the claim?</summary><p>Disclose that involvement in the initial inquiry. Prior relationships and roles need to be considered before acceptance, especially for an impartial umpire appointment.</p></details>
        </div>
      </div>
    </section>
    <PracticeContact />
  </div>
</template>
