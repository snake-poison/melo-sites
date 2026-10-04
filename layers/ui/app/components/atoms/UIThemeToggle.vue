<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-ink/6 focus-visible:outline-2 focus-visible:outline-accent-2 active:scale-95"
    aria-label="Toggle dark mode"
    @click="toggleDark"
  >
    <div
      class="icon-[carbon--sun] text-2xl dark:icon-[carbon--moon]"
    />
  </button>
</template>
