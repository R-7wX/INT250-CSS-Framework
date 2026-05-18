<template>
  <section class="relative overflow-hidden bg-white dark:bg-fylo-dark-blue transition-colors duration-300">
    <!-- curvy background wave -->
    <div
      class="absolute inset-x-0 bottom-0 h-40 md:h-56 bg-cover bg-bottom"
      :class="isDark ? 'bg-[url(/images/bg-curvy-dark-mode.svg)]' : 'bg-[url(/images/bg-curvy-light-mode.svg)]'"
      aria-hidden="true"
    ></div>

    <div class="relative z-10 max-w-3xl mx-auto px-6 pt-10 pb-36 text-center">
      <img
        src="/images/illustration-intro.png"
        alt="People accessing files from multiple devices"
        class="w-full max-w-lg mx-auto mb-8"
      />

      <h1 class="font-heading font-bold text-2xl md:text-4xl lg:text-5xl
                 text-gray-900 dark:text-white mb-5 leading-tight">
        All your files in one secure location,<br class="hidden md:inline" />
        accessible anywhere.
      </h1>

      <p class="text-gray-500 dark:text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-8">
        Fylo stores all your most important files in one secure location.
        Access them wherever you need, share and collaborate with friends,
        family, and co-workers.
      </p>

      <a href="#" class="btn-primary">Get Started</a>
    </div>
  </section>
</template>

<script setup>
import { inject } from 'vue'
const isDark = inject('isDark')
</script>
