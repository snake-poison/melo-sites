<script setup lang="ts">
interface Props {
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'currentColor',
})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 1152 1090" :fill="props.color">
    <path d="M1004.2 538.1 806.4 423.9l13.7-23.7 184.1 106.2z" />
    <path d="M650.5 666.6V282.1L605.3 256v718.2l45.2-26V721.6h-31.8zm93.2-168.7V173.8l-45.3-26.1v526.2l27.6 47.7h-27.6v198.9l45.3-26V545.8H716zm47.9-113.7v106.7l31.7 54.9h-31.7v320.8l45.3-26.2V409.8zM567.1 943.3 282.6 779.1V450.5l284.5-164.2v-31.7L255.2 434.7V795l311.9 180.1z" />
    <path d="m567.1 270.1-6.7-11.6-416 240.1.2 31.6 422.5-243.9z" />
  </svg>
</template>
