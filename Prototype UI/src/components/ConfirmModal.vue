<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div v-if="store.confirmModal.open"
        class="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="cancel"
      >
        <div class="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">

          <!-- Icon -->
          <div class="flex justify-center pt-7 pb-3">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center"
              :class="store.confirmModal.danger
                ? 'bg-rose-100 dark:bg-rose-900/30'
                : 'bg-amber-100 dark:bg-amber-900/30'"
            >
              <svg v-if="store.confirmModal.danger" class="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <svg v-else class="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
          </div>

          <!-- Text -->
          <div class="px-7 pb-2 text-center">
            <h2 class="font-extrabold text-lg text-slate-800 dark:text-slate-100 mb-1.5">
              {{ store.confirmModal.title }}
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ store.confirmModal.desc }}
            </p>
          </div>

          <!-- Keyboard hint -->
          <div class="flex justify-center gap-4 pb-1 text-[10px] text-slate-300 dark:text-slate-600 font-mono select-none">
            <span>Enter → {{ store.confirmModal.confirmLabel }}</span>
            <span>Esc → {{ store.confirmModal.cancelLabel }}</span>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 px-6 py-4">
            <button @click="cancel"
              class="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >{{ store.confirmModal.cancelLabel }}</button>
            <button @click="confirm"
              class="flex-1 py-2.5 rounded-2xl text-white text-sm font-bold transition-colors"
              :class="store.confirmModal.danger
                ? 'bg-rose-500 hover:bg-rose-600'
                : 'bg-amber-500 hover:bg-amber-600'"
            >{{ store.confirmModal.confirmLabel }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/useAppStore.js'
const store = useAppStore()

function confirm() {
  store.confirmModal.onConfirm?.()
  store.closeConfirm()
}
function cancel() {
  store.closeConfirm()
}

function onKey(e) {
  if (!store.confirmModal.open) return
  if (e.key === 'Enter')  { e.preventDefault(); confirm() }
  if (e.key === 'Escape') { cancel() }
}
onMounted(()   => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<style scoped>
.confirm-enter-active { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
.confirm-leave-active { transition: all 0.2s ease-in; }
.confirm-enter-from, .confirm-leave-to { opacity: 0; transform: scale(0.88); }
</style>