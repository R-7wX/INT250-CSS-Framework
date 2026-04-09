<template>
  <section class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-bold text-gray-800 mb-1">1. Buttons</h2>
    <p class="text-sm text-gray-500 mb-4">Reusable action styles for primary, secondary, outline, and disabled states.</p>
    <div class="flex flex-wrap gap-3">
      <button
        v-for="btn in buttons"
        :key="btn.label"
        :disabled="btn.disabled"
        :class="btn.class"
      >
        {{ btn.label }}
      </button>
    </div>
  </section>
</template>

<script setup>
const buttons = [
  {
    label: 'Primary Button',
    class: 'px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition cursor-pointer',
  },
  {
    label: 'Secondary Button',
    class: 'px-5 py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 transition cursor-pointer',
  },
  {
    label: 'Outline Button',
    class: 'px-5 py-2 rounded-lg border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 transition cursor-pointer',
  },
  {
    label: 'Disabled Button',
    disabled: true,
    class: 'px-5 py-2 rounded-lg bg-gray-200 text-gray-400 font-medium cursor-not-allowed',
  },
]
</script>
