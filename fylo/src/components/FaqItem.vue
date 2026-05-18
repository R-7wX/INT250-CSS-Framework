<template>
  <div class="faq-item">
    <button
      class="faq-question"
      :aria-expanded="isOpen.toString()"
      :aria-controls="`faq-answer-${faq.id}`"
      @click="toggle"
      @keydown.enter.prevent="toggle"
      @keydown.space.prevent="toggle"
    >
      <span>{{ faq.question }}</span>
      <svg
        class="w-4 h-4 shrink-0 transition-transform duration-300 text-fylo-cyan"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </button>

    <div
      :id="`faq-answer-${faq.id}`"
      class="overflow-hidden transition-all duration-300"
      :class="isOpen ? 'max-h-96 mt-3' : 'max-h-0'"
      role="region"
    >
      <p class="text-gray-500 dark:text-gray-300 text-sm leading-relaxed pb-2">
        {{ faq.answer }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ faq: { type: Object, required: true } })

const isOpen = ref(false)
const toggle = () => { isOpen.value = !isOpen.value }
</script>
