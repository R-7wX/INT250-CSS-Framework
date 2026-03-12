<template>
  <header class="glass-panel sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-700/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 shrink-0">
        <img src="/favicon.png" class="w-7 h-7 sm:w-8 sm:h-8" alt="logo" />
        <span class="font-extrabold text-base sm:text-lg bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
          Travelaroha
        </span>
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="hidden sm:flex items-center gap-1">
        <RouterLink
          v-for="item in navItems" :key="item.to"
          :to="item.to"
          class="px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all
                 text-slate-500 dark:text-slate-400
                 hover:text-teal-600 dark:hover:text-teal-400"
          active-class="!text-teal-600 dark:!text-teal-400 bg-teal-50 dark:bg-teal-900/30"
        >
          {{ t(item.labelKey) }}
        </RouterLink>
      </nav>

      <!-- Right: lang + theme toggle -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Version badge -->
        <span class="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 select-none tracking-wide">
          v0.2.0a
        </span>

        <!-- Theme toggle -->
        <button
          @click="store.dark = !store.dark"
          class="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          :title="t('mob_theme')"
        >
          <svg v-if="store.dark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>

        <!-- Lang switcher -->
        <div class="relative" ref="langRef">
          <button
            @click="open = !open"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold
                   border border-slate-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200
                   hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span>{{ currentLang.flag }}</span>
            <span>{{ currentLang.label }}</span>
            <svg class="w-3.5 h-3.5 opacity-50 transition-transform" :class="open && 'rotate-180'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <Transition name="dropdown">
            <div v-if="open"
              class="absolute right-0 mt-2 w-36 rounded-2xl shadow-xl border
                     bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 overflow-hidden z-50"
            >
              <button
                v-for="(meta, code) in LANGS" :key="code"
                @click="setLang(code)"
                class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium
                       hover:bg-teal-50 dark:hover:bg-teal-900/30
                       text-slate-700 dark:text-slate-200 transition-colors"
                :class="store.lang === code && 'text-teal-600 dark:text-teal-400 font-bold bg-teal-50/50 dark:bg-teal-900/20'"
              >
                <span>{{ meta.flag }}</span>
                <span>{{ meta.label }}</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile bottom nav -->
  <nav class="fixed bottom-0 left-0 right-0 z-50 sm:hidden glass-panel border-t border-slate-200/60 dark:border-slate-700/60 flex justify-around items-center py-2 px-2">
    <RouterLink
      v-for="item in mobileNavItems" :key="item.to"
      :to="item.to"
      class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl text-slate-400 min-w-[56px] transition-colors"
      active-class="!text-teal-600 dark:!text-teal-400"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath"/>
      </svg>
      <span class="text-[10px] font-medium">{{ t(item.labelKey) }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppStore } from '../stores/useAppStore.js'
import { useI18n } from '../composables/useI18n.js'
import { LANGS } from '../data/i18n.js'

const store = useAppStore()
const { t } = useI18n()

const open = ref(false)
const langRef = ref(null)

const currentLang = computed(() => LANGS[store.lang])

function setLang(code) {
  store.lang = code
  document.documentElement.dir = LANGS[code].dir
  open.value = false
}

function onClickOutside(e) {
  if (langRef.value && !langRef.value.contains(e.target)) open.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))

const navItems = [
  { to: '/',           labelKey: 'nav_discovery' },
  { to: '/storyboard', labelKey: 'nav_storyboard' },
  { to: '/dashboard',  labelKey: 'nav_dashboard' },
]

const mobileNavItems = [
  {
    to: '/',
    labelKey: 'mob_discover',
    iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    to: '/storyboard',
    labelKey: 'mob_storyboard',
    iconPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  },
  {
    to: '/dashboard',
    labelKey: 'mob_dashboard',
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
]
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }
</style>