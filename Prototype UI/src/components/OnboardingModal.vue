<template>
  <Teleport to="body">
    <Transition name="onboard">
      <div v-if="visible" class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">

          <!-- Progress dots -->
          <div class="flex gap-1.5 justify-center pt-5 pb-2">
            <div v-for="i in steps.length" :key="i"
              class="h-1.5 rounded-full transition-all duration-300"
              :class="i-1 === current ? 'w-6 bg-teal-500' : 'w-2 bg-slate-200 dark:bg-slate-700'"
            />
          </div>

          <!-- Step content -->
          <div class="px-7 pt-4 pb-6 text-center">
            <div class="text-5xl mb-4 leading-none">{{ steps[current].emoji }}</div>
            <h2 class="font-extrabold text-xl text-slate-800 dark:text-slate-100 mb-2">{{ t(steps[current].titleKey) }}</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ t(steps[current].descKey) }}</p>
          </div>

          <!-- Buttons -->
          <div class="px-6 pb-6 flex gap-3">
            <button
              v-if="current < steps.length - 1"
              @click="dismiss"
              class="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >{{ t('ob_skip') }}</button>

            <button
              v-if="current < steps.length - 1"
              @click="next"
              class="flex-1 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold transition-colors"
            >{{ t('ob_next') }}</button>

            <button
              v-if="current === steps.length - 1"
              @click="dismiss"
              class="w-full py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold transition-colors"
            >{{ t('ob_start') }} 🎉</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()
const visible = ref(false)
const current = ref(0)

const steps = [
  { emoji: '🔍', titleKey: 'ob_step1_title', descKey: 'ob_step1_desc' },
  { emoji: '❤️', titleKey: 'ob_step2_title', descKey: 'ob_step2_desc' },
  { emoji: '🗓️', titleKey: 'ob_step3_title', descKey: 'ob_step3_desc' },
]

const LS_KEY = 'travelaroha_last_visit'
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

onMounted(() => {
  const last = localStorage.getItem(LS_KEY)
  const now = Date.now()
  const shouldShow = !last || (now - Number(last)) >= WEEK_MS
  if (shouldShow) {
    setTimeout(() => { visible.value = true }, 600)
  }
  // Update last visit every time page loads
  localStorage.setItem(LS_KEY, String(now))
})

function next() {
  current.value++
}
function dismiss() {
  visible.value = false
  current.value = 0
}
</script>

<style scoped>
.onboard-enter-active { transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.onboard-leave-active { transition: all 0.25s ease-in; }
.onboard-enter-from   { opacity: 0; transform: scale(0.85); }
.onboard-leave-to     { opacity: 0; transform: scale(0.9); }
</style>