<template>
  <Teleport to="body">
    <Transition name="onboard">
      <div v-if="visible" class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="dismiss">
        <div class="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">

          <!-- Progress dots -->
          <div class="flex gap-1.5 justify-center pt-5 pb-2">
            <div v-for="i in steps.length" :key="i"
              class="h-1.5 rounded-full transition-all duration-300"
              :class="i-1 === current ? 'w-6 bg-teal-500' : 'w-2 bg-slate-200 dark:bg-slate-700'"
            />
          </div>

          <!-- Step content -->
          <div class="px-7 pt-4 pb-4 text-center">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-500 flex items-center justify-center" v-html="steps[current].svg"></div>
            </div>
            <h2 class="font-extrabold text-xl text-slate-800 dark:text-slate-100 mb-2">{{ t(steps[current].titleKey) }}</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ t(steps[current].descKey) }}</p>
          </div>

          <!-- Keyboard hint -->
          <div class="flex justify-center gap-4 pb-1 text-[10px] text-slate-300 dark:text-slate-600 font-mono select-none">
            <span>← → {{ t('ob_navigate') }}</span>
            <span>Enter → {{ current < steps.length - 1 ? t('ob_next') : t('ob_start') }}</span>
            <span>Esc → {{ t('ob_skip') }}</span>
          </div>

          <!-- Buttons -->
          <div class="px-6 pb-6 pt-3 flex gap-3">
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { useAppStore } from '../stores/useAppStore.js'

const { t } = useI18n()
const store = useAppStore()
const autoShow = ref(false)   // first-visit auto trigger
const current  = ref(0)

// v-if ผูกกับ computed นี้โดยตรง — ไม่ผ่าน watch
const visible = computed(() => autoShow.value || store.onboardingOpen)

const steps = [
  {
    svg: `<svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`,
    titleKey: 'ob_step1_title', descKey: 'ob_step1_desc'
  },
  {
    svg: `<svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>`,
    titleKey: 'ob_step2_title', descKey: 'ob_step2_desc'
  },
  {
    svg: `<svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
    titleKey: 'ob_step3_title', descKey: 'ob_step3_desc'
  },
]

const LS_KEY  = 'travelaroha_last_visit'
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

onMounted(() => {
  const last = localStorage.getItem(LS_KEY)
  const now  = Date.now()
  if (!last || (now - Number(last)) >= WEEK_MS) {
    setTimeout(() => { autoShow.value = true }, 600)
  }
  localStorage.setItem(LS_KEY, String(now))
  document.addEventListener('keydown', onKey)
  window.addEventListener('travelaroha:help', onHelpEvent)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  window.removeEventListener('travelaroha:help', onHelpEvent)
})

function onHelpEvent() { current.value = 0; autoShow.value = true }

// reset step เมื่อเปิดจาก ? button
watch(() => store.onboardingOpen, v => { if (v) current.value = 0 })

function onKey(e) {
  if (!visible.value) return
  if (e.key === 'Escape')     { dismiss(); return }
  if (e.key === 'Enter')      { e.preventDefault(); current.value < steps.length - 1 ? next() : dismiss() }
  if (e.key === 'ArrowRight') { next() }
  if (e.key === 'ArrowLeft' && current.value > 0) current.value--
}

function next()    { if (current.value < steps.length - 1) current.value++ }
function dismiss() { autoShow.value = false; current.value = 0; store.closeOnboarding() }
</script>

<style scoped>
.onboard-enter-active { transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.onboard-leave-active { transition: all 0.25s ease-in; }
.onboard-enter-from   { opacity: 0; transform: scale(0.85); }
.onboard-leave-to     { opacity: 0; transform: scale(0.9); }
</style>