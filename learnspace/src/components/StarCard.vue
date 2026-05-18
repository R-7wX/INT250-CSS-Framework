<template>
  <div class="bg-white rounded-2xl p-6 border hover:shadow-md transition-shadow duration-200" style="border-color:#ebebf5;">
    <p class="text-sm mb-1" style="color:#888;">{{ stat.label }}</p>
    <p class="text-3xl font-bold" style="color:#1a1a2e;">{{ stat.value }}</p>
  </div>
</template>

<script setup>
defineProps({ stat: Object })
</script>
