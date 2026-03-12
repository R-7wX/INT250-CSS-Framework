<template>
  <Teleport to="body">
    <div class="fixed bottom-24 sm:bottom-6 right-4 z-[200] flex flex-col gap-2 items-end pointer-events-none">
      <TransitionGroup name="toast">
        <div
          v-for="toast in store.toasts" :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium max-w-xs
                 backdrop-blur-sm border"
          :class="{
            'bg-slate-900/90 border-slate-700 text-white':   toast.type === 'success',
            'bg-rose-900/90 border-rose-700 text-white':     toast.type === 'error',
            'bg-amber-800/90 border-amber-600 text-white':   toast.type === 'warning',
            'bg-slate-800/90 border-slate-600 text-white':   toast.type === 'info',
          }"
        >
          <!-- SVG icon by type -->
          <svg v-if="toast.type === 'success'" class="w-4 h-4 shrink-0 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
          </svg>
          <svg v-else-if="toast.type === 'info'" class="w-4 h-4 shrink-0 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
          </svg>
          <svg v-else-if="toast.type === 'warning'" class="w-4 h-4 shrink-0 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <svg v-else-if="toast.type === 'error'" class="w-4 h-4 shrink-0 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <span class="flex-1">{{ toast.msg }}</span>
          <button
            v-if="toast.undoFn"
            @click="() => { toast.undoFn(); store.dismissToast(toast.id) }"
            class="ml-1 px-2 py-1 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 transition-colors shrink-0"
          >{{ t('toast_undo') }}</button>
          <button @click="store.dismissToast(toast.id)" class="text-white/50 hover:text-white/90 transition-colors">
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