<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      <TransitionGroup
        tag="div"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
        class="flex flex-col gap-3"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl border pointer-events-auto min-w-[260px]',
            typeStyles[toast.type] || typeStyles.info
          ]"
        >
          <span class="text-lg mt-0.5">{{ typeIcon[toast.type] || '💬' }}</span>
          <div>
            <p class="text-sm font-semibold leading-tight">{{ toast.title }}</p>
            <p v-if="toast.message" class="text-xs mt-0.5 opacity-75">{{ toast.message }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error:   'bg-red-50   border-red-200   text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info:    'bg-white    border-border    text-text-main',
}
const typeIcon = {
  success: '✅',
  error:   '❌',
  warning: '⚠️',
  info:    '💬',
}

function show({ title, message = '', type = 'info', duration = 3000 }) {
  const id = ++nextId
  toasts.value.push({ id, title, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, duration)
}

defineExpose({ show })
</script>
