<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'py-3 backdrop-blur-md border-b border-theme' : 'py-5'"
    :style="scrolled ? 'background-color: rgba(var(--bg-primary-rgb), 0.85)' : ''"
  >
    <div class="max-w-6xl mx-auto px-6 flex items-center justify-between">
      <!-- Logo -->
      <a href="#hero" class="font-mono text-sm font-medium accent hover:opacity-70 transition-opacity">
        <span class="opacity-50">~/</span>atcharayu
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="font-mono text-xs uppercase tracking-wider text-secondary hover:text-primary transition-colors duration-200 hover:accent"
        >
          {{ link.label }}
        </a>
      </div>

      <!-- Right controls -->
      <div class="flex items-center gap-4">
        <!-- Theme toggle -->
        <button
          @click="$emit('toggle-theme')"
          class="w-9 h-9 rounded-full flex items-center justify-center border border-theme hover:border-accent transition-all duration-200 text-secondary hover:text-primary"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="isDark" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
          </svg>
        </button>

        <!-- Mobile menu button -->
        <button
          class="md:hidden w-9 h-9 flex items-center justify-center text-secondary"
          @click="menuOpen = !menuOpen"
          aria-label="Toggle menu"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!menuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="menuOpen"
      class="md:hidden border-t border-theme px-6 py-4 flex flex-col gap-4"
      style="background-color: var(--bg-secondary)"
    >
      <a
        v-for="link in navLinks"
        :key="link.href"
        :href="link.href"
        @click="menuOpen = false"
        class="font-mono text-sm text-secondary hover:accent transition-colors"
      >
        {{ link.label }}
      </a>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({ isDark: Boolean })
defineEmits(['toggle-theme'])

const scrolled = ref(false)
const menuOpen = ref(false)

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

const handleScroll = () => { scrolled.value = window.scrollY > 40 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>
