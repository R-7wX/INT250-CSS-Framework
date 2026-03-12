<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
    <NavBar />
    <main class="pb-20 sm:pb-0">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import { RouterView } from 'vue-router'
import { useAppStore } from './stores/useAppStore.js'
import { LANGS } from './data/i18n.js'
import { watch, onMounted } from 'vue'

// ── One-time reset ──────────────────────────────────────────
// เปลี่ยน CACHE_VERSION เมื่อต้องการ reset ผู้ใช้ทุกคนอีกครั้ง
const CACHE_VERSION = 'v2'
const VERSION_KEY   = 'travelaroha_version'
if (localStorage.getItem(VERSION_KEY) !== CACHE_VERSION) {
  Object.keys(localStorage)
    .filter(k => k.startsWith('travelaroha') && k !== VERSION_KEY)
    .forEach(k => localStorage.removeItem(k))
  localStorage.setItem(VERSION_KEY, CACHE_VERSION)
}
// ────────────────────────────────────────────────────────────

const store = useAppStore()

// Sync RTL direction on lang change
watch(() => store.lang, lang => {
  document.documentElement.dir = LANGS[lang]?.dir || 'ltr'
}, { immediate: true })
</script>