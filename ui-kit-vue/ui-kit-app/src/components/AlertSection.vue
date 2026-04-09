<template>
  <section class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-bold text-gray-800 mb-1">3. Alerts</h2>
    <p class="text-sm text-gray-500 mb-4">Reusable feedback messages for success, warning, and error states.</p>
    <div class="space-y-3">
      <div
        v-for="alert in alerts"
        :key="alert.title"
        :class="['rounded-lg border px-4 py-3', alert.wrapClass]"
      >
        <p :class="['text-sm font-semibold', alert.titleClass]">{{ alert.title }}</p>
        <p :class="['text-sm', alert.msgClass]">{{ alert.message }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const alerts = [
  {
    title: 'Success Alert',
    message: 'Your profile has been updated successfully.',
    wrapClass:  'border-green-200 bg-green-50',
    titleClass: 'text-green-700',
    msgClass:   'text-green-600',
  },
  {
    title: 'Warning Alert',
    message: 'Please review the form before submitting.',
    wrapClass:  'border-yellow-200 bg-yellow-50',
    titleClass: 'text-yellow-700',
    msgClass:   'text-yellow-600',
  },
  {
    title: 'Error Alert',
    message: 'Something went wrong. Please try again later.',
    wrapClass:  'border-red-200 bg-red-50',
    titleClass: 'text-red-600',
    msgClass:   'text-red-500',
  },
]
</script>
