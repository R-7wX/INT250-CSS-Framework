<template>
  <div>
    <NavBar :isDark="isDark" @toggle-theme="toggleTheme" />
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
    </main>
    <FooterSection />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ContactSection from './components/ContactSection.vue'
import FooterSection from './components/FooterSection.vue'

// Dark mode — default to dark
const isDark = ref(true)

// Apply dark class directly on <html> so body + all CSS vars work correctly
const applyTheme = (dark) => {
  document.documentElement.classList.toggle('dark', dark)
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

watch(isDark, (val) => applyTheme(val))

// Scroll-triggered animations
const initScrollAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.12 }
  )

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
}

onMounted(() => {
  // Restore theme preference
  const saved = localStorage.getItem('theme')
  if (saved) isDark.value = saved === 'dark'

  // Apply theme immediately on mount
  applyTheme(isDark.value)

  initScrollAnimations()

  // Re-run observer when DOM changes (for SPA route-like behavior)
  setTimeout(initScrollAnimations, 500)
})
</script>
