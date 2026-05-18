<template>
  <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col">
    <!-- Top badges -->
    <div class="flex items-center justify-between mb-4">
      <span class="text-xs font-semibold px-3 py-1 rounded-full" style="background:#eef2ff; color:#5b4ef8;">
        {{ course.code }}
      </span>
      <span :class="['text-xs font-semibold px-3 py-1 rounded-full', course.statusColor]">
        {{ course.status }}
      </span>
    </div>

    <!-- Title & description -->
    <h3 class="text-lg font-bold text-gray-900 mb-2">{{ course.title }}</h3>
    <p class="text-sm text-gray-400 leading-relaxed mb-5 flex-1">{{ course.description }}</p>

    <!-- Progress -->
    <div class="mb-5">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-gray-400">Progress</span>
        <span class="font-semibold" :style="course.progress === 100 ? 'color:#16a34a' : 'color:#5b4ef8'">
          {{ course.progress }}%
        </span>
      </div>
      <div class="w-full h-2 rounded-full overflow-hidden" style="background:#eef2ff;">
        <div
          class="h-full rounded-full"
          :style="{
            width: course.progress + '%',
            background: course.progress === 100
              ? 'linear-gradient(90deg,#16a34a,#4ade80)'
              : '#5b4ef8'
          }"
        />
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-3">
      <button
        class="text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-90"
        style="background:#5b4ef8;"
        @click="$emit('view', course)"
      >
        {{ course.progress === 100 ? 'View Certificate' : 'View Course Details' }}
      </button>
      <button
        v-if="course.progress < 100"
        class="border text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 hover:border-indigo-500 hover:text-indigo-600"
        style="border-color:#d1d5db; color:#1a1a2e;"
        @click="$emit('submit', course)"
      >
        Submit Assignment
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ course: Object })
defineEmits(['view', 'submit'])
</script>
