<script setup lang="ts">
const props = defineProps<{
  items: Array<{ question: string, answer: string }>
}>()
</script>

<template>
  <section aria-labelledby="faq-heading">
    <UIHeading id="faq-heading" :level="2" size="lg">
      Common questions
    </UIHeading>
    <dl class="mt-6 divide-y divide-rule-soft border-y border-rule-soft">
      <div v-for="item in props.items" :key="item.question" class="py-5">
        <dt>
          <UIText variant="title" as="span" class="text-base">
            {{ item.question }}
          </UIText>
        </dt>
        <dd class="mt-2">
          <UIText as="span" class="block">
            {{ item.answer }}
          </UIText>
        </dd>
      </div>
    </dl>
  </section>
</template>
