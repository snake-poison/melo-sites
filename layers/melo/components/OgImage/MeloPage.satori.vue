<script setup lang="ts">
import { business } from '#site'

// The share card for every page: kicker, title, the Melo logo, on navy. Satori cannot read CSS
// variables, so the colours are written out here.
const props = withDefaults(defineProps<{
  title?: string
  kicker?: string
}>(), {
  title: '',
  kicker: '',
})
// A page names itself; the site's name stands in for one that does not.
const cardTitle = props.title || business.name
const cardKicker = props.kicker || business.name

const navy = '#0a0a2e'
const navy2 = '#13154a'
const cyan = '#03bbfc'
const paper = '#ffffff'

const heading = 'Archivo Narrow'
const mono = 'IBM Plex Mono'

// Long titles step down so they stay inside the card.
const titleSize = cardTitle.length > 70 ? '62px' : cardTitle.length > 40 ? '74px' : '90px'
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
          {{ cardKicker.toUpperCase() }}
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
        {{ cardTitle }}
      </div>
    </div>

    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
      <img src="/images/brand/logo-dark.png" width="249" height="72" :style="{ width: '249px', height: '72px' }">
      <span :style="{ display: 'flex', fontFamily: mono, fontWeight: 500, fontSize: '20px', letterSpacing: '0.1em', color: paper }">
        24/7 · {{ business.phone }}
      </span>
    </div>
  </div>
</template>
