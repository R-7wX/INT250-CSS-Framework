<template>
  <section class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-bold text-gray-800 mb-1">5. Cards</h2>
    <p class="text-sm text-gray-500 mb-4">Responsive card layout for reusable content blocks such as event, profile, or product cards.</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="card in cards"
        :key="card.title"
        class="border border-gray-200 rounded-xl p-4 flex flex-col gap-3"
      >
        <div class="flex justify-between items-center">
          <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium">{{ card.tag }}</span>
          <span class="text-xs text-gray-400">Reusable</span>
        </div>
        <div>
          <h3 class="font-bold text-gray-800 text-sm">{{ card.title }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ card.description }}</p>
        </div>
        <button class="mt-auto self-start text-xs border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition cursor-pointer">
          View Details
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
const cards = [
  {
    tag: 'New',
    title: 'Basic Card',
    description: 'A simple reusable card for general content blocks in a dashboard or landing page.',
  },
  {
    tag: 'Profile',
    title: 'Student Profile Card',
    description: 'A profile summary card showing student status, program, and quick information.',
  },
  {
    tag: 'Event',
    title: 'Event Card',
    description: 'A reusable event component for workshops, seminars, or hackathon activities.',
  },
]
</script>
