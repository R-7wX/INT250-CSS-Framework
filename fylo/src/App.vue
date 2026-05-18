<template>
  <div :class="{ dark: isDark }" class="min-h-screen">
    <div class="bg-white dark:bg-fylo-dark-blue transition-colors duration-300 min-h-screen">
      <NavBar        :is-dark="isDark" @toggle-dark="toggleDark" />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ProductiveSection />
        <FaqSection />
        <TestimonialsSection />
        <EarlyAccessSection />
      </main>
      <FooterSection />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, provide } from 'vue'
import NavBar              from './components/NavBar.vue'
import HeroSection         from './components/HeroSection.vue'
import FeaturesSection     from './components/FeaturesSection.vue'
import ProductiveSection   from './components/ProductiveSection.vue'
import FaqSection          from './components/FaqSection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import EarlyAccessSection  from './components/EarlyAccessSection.vue'
import FooterSection       from './components/FooterSection.vue'

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const stored      = localStorage.getItem('fylo-dark-mode')
const isDark      = ref(stored !== null ? stored === 'true' : prefersDark)

provide('isDark', isDark)

function toggleDark() {
  isDark.value = !isDark.value
}

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark', val)
  localStorage.setItem('fylo-dark-mode', String(val))
}, { immediate: true })

onMounted(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>
