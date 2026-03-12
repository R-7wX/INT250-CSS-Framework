<template>
  <Teleport to="body">
    <div class="fixed bottom-24 sm:bottom-6 right-4 z-[200] flex flex-col gap-2 items-end pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in store.toasts" :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium max-w-xs
                 backdrop-blur-sm border"
          :class="[
            toast.type === 'success'  ? 'bg-white/95 border-slate-200 text-slate-800 dark:bg-slate-900/95 dark:border-slate-700 dark:text-white'       : '',
            toast.type === 'error'    ? 'bg-rose-50/95 border-rose-200 text-rose-800 dark:bg-rose-900/90 dark:border-rose-700 dark:text-white'           : '',
            toast.type === 'warning'  ? 'bg-amber-50/95 border-amber-200 text-amber-800 dark:bg-amber-900/90 dark:border-amber-700 dark:text-white'      : '',
            toast.type === 'info'     ? 'bg-white/95 border-slate-200 text-slate-700 dark:bg-slate-800/95 dark:border-slate-600 dark:text-white'         : '',
            toast.type === 'saved'    ? 'bg-pink-50/95 border-pink-200 text-pink-800 dark:bg-pink-900/90 dark:border-pink-700 dark:text-white'           : '',
            toast.type === 'unsaved'  ? 'bg-white/95 border-slate-200 text-slate-700 dark:bg-slate-800/95 dark:border-slate-600 dark:text-white'         : '',
          ]"
        >
          <!-- SVG icon by type -->
          <svg v-if="toast.type === 'success'" class="w-4 h-4 shrink-0 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <!-- Saved: solid pink heart -->
          <svg v-else-if="toast.type === 'saved'" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#ec4899">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <!-- Unsaved: broken heart -->
          <svg v-else-if="toast.type === 'unsaved'" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.5 4.5C5.46 4.5 3 6.96 3 10c0 3.5 3.13 6.37 7.87 10.73L12 21.85l1.13-1.12C17.87 16.37 21 13.5 21 10c0-3.04-2.46-5.5-5.5-5.5-1.5 0-2.93.64-3.92 1.67L12 5.7"/>
            <path d="M12 5.7l-1.5 2.8 2.5 1.5-2 3.5"/>
          </svg>
          <svg v-else-if="toast.type === 'info'" class="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
          </svg>
          <svg v-else-if="toast.type === 'warning'" class="w-4 h-4 shrink-0 text-amber-500 dark:text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <span class="flex-1">{{ toast.msg }}</span>
          <button
            v-if="toast.undoFn"
            @click="() => { toast.undoFn(); store.dismissToast(toast.id) }"
            class="ml-1 px-2 py-1 rounded-lg text-xs font-bold bg-black/10 hover:bg-black/20 dark:bg-white/20 dark:hover:bg-white/30 transition-colors shrink-0"
          >{{ t('toast_undo') }}</button>
          <button @click="store.dismissToast(toast.id)" class="text-black/30 hover:text-black/60 dark:text-white/50 dark:hover:text-white/90 transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useAppStore } from '../stores/useAppStore.js'
import { useI18n } from '../composables/useI18n.js'
const store = useAppStore()
const { t } = useI18n()
</script>

<style scoped>
.toast-enter-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-leave-active { transition: all 0.25s ease-in; }
.toast-enter-from   { opacity: 0; transform: translateX(60px) scale(0.9); }
.toast-leave-to     { opacity: 0; transform: translateX(60px) scale(0.9); }
</style>