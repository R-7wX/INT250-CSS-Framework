<template>
  <section class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-bold text-gray-800 mb-1">2. Badges</h2>
    <p class="text-sm text-gray-500 mb-4">Small reusable labels for category, state, or status indication.</p>
    <div class="flex flex-wrap gap-3">
      <span
        v-for="badge in badges"
        :key="badge.label"
        :class="['px-3 py-1 rounded-full text-sm font-medium', badge.class]"
      >
        {{ badge.label }}
      </span>
    </div>
  </section>
</template>

<script setup>
const badges = [
  { label: 'Success', class: 'bg-green-100 text-green-700' },
  { label: 'Warning', class: 'bg-yellow-100 text-yellow-700' },
  { label: 'Error',   class: 'bg-red-100 text-red-600' },
  { label: 'Neutral', class: 'bg-gray-100 text-gray-600' },
]
</script>
