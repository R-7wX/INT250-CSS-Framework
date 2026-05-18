<template>
  <header
    class="w-full py-6 px-6 md:px-12 lg:px-20
           bg-white dark:bg-fylo-dark-blue
           transition-colors duration-300"
    role="banner"
  >
    <nav class="max-w-6xl mx-auto flex items-center justify-between" aria-label="Main navigation">
      <a href="#" aria-label="Fylo home">
        <img src="/images/logo-light-mode.svg" alt="Fylo" class="h-8 dark:hidden" />
        <img src="/images/logo-dark-mode.svg"  alt="Fylo" class="h-8 hidden dark:block" />
      </a>

      <ul class="hidden md:flex items-center gap-8 list-none">
        <li><a href="#features"      class="nav-link text-gray-600 dark:text-gray-300">Features</a></li>
        <li><a href="#faq"           class="nav-link text-gray-600 dark:text-gray-300">FAQs</a></li>
        <li><a href="#testimonials"  class="nav-link text-gray-600 dark:text-gray-300">Testimonials</a></li>
        <li>
          <button
            @click="$emit('toggle-dark')"
            class="w-9 h-9 rounded-full flex items-center justify-center
                   bg-gray-100 dark:bg-fylo-dark-blue-3 text-gray-600 dark:text-fylo-cyan
                   hover:ring-2 hover:ring-fylo-cyan transition-all duration-200"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </button>
        </li>
      </ul>

      <div class="flex md:hidden items-center gap-4">
        <button
          @click="$emit('toggle-dark')"
          class="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-fylo-cyan"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        </button>
        <div class="flex flex-col gap-1 cursor-pointer" role="button" tabindex="0" aria-label="Open menu">
          <span class="block w-5 h-0.5 bg-gray-700 dark:bg-white"></span>
          <span class="block w-5 h-0.5 bg-gray-700 dark:bg-white"></span>
          <span class="block w-5 h-0.5 bg-gray-700 dark:bg-white"></span>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
defineProps({ isDark: Boolean })
defineEmits(['toggle-dark'])
</script>
