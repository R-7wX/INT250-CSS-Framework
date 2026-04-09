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

const store = useAppStore()

// Sync RTL direction on lang change
watch(() => store.lang, lang => {
  document.documentElement.dir = LANGS[lang]?.dir || 'ltr'
}, { immediate: true })
</script>