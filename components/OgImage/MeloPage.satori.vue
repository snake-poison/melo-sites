<script setup lang="ts">
// The share card for every page: kicker, title, the Melo logo, on the site's navy. Satori cannot
// read CSS variables, so the colours repeat app/assets/css/brand.css; keep them in step.
const props = withDefaults(defineProps<{
  title?: string
  kicker?: string
}>(), {
  title: 'Melo Public Adjusters Charlotte',
  kicker: 'Melo Public Adjusters Charlotte',
})

const navy = '#0a0a2e'
const navy2 = '#13154a'
const cyan = '#03bbfc'
const paper = '#ffffff'

const heading = 'Archivo Narrow'
const mono = 'IBM Plex Mono'

// Long titles step down so they stay inside the card.
const titleSize = props.title.length > 70 ? '62px' : props.title.length > 40 ? '74px' : '90px'
</script>

<template>
  <div
    :style="{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '60px 72px 52px',
      color: paper,
      fontFamily: heading,
      backgroundColor: navy,
      backgroundImage: `radial-gradient(circle at 92% -6%, rgba(3,187,252,0.32), transparent 46%), linear-gradient(160deg, ${navy2}, ${navy})`,
    }"
  >
    <div :style="{ display: 'flex', flexDirection: 'column' }">
      <div :style="{ display: 'flex', alignItems: 'center', gap: '14px' }">
        <span :style="{ display: 'flex', width: '12px', height: '12px', borderRadius: '6px', backgroundColor: cyan }" />
        <span :style="{ display: 'flex', fontFamily: mono, fontWeight: 600, fontSize: '19px', letterSpacing: '0.18em', color: cyan }">
          {{ props.kicker.toUpperCase() }}
        </span>
      </div>
      <div
        :style="{
          display: 'flex',
          marginTop: '30px',
          width: '1040px',
          fontFamily: heading,
          fontWeight: 700,
          fontSize: titleSize,
          lineHeight: 1.02,
          letterSpacing: '-0.01em',
        }"
      >
        {{ props.title }}
      </div>
    </div>

    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
      <img src="/images/brand/logo-dark.png" width="249" height="72" :style="{ width: '249px', height: '72px' }">
      <span :style="{ display: 'flex', fontFamily: mono, fontWeight: 500, fontSize: '20px', letterSpacing: '0.1em', color: paper }">
        24/7 · (704) 286-0707
      </span>
    </div>
  </div>
</template>
