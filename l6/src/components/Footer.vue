<template>
  <footer class="bg-black text-white py-10">
    <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:justify-between md:items-center gap-8">

      <!-- Left: Logo + nav links -->
      <div class="flex flex-col items-center md:items-start gap-5">
        <img src="@/assets/logo.svg" alt="loopstudios" class="h-6" />
        <nav class="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-6">
          <div v-for="item in footerLinks" :key="item" class="group cursor-pointer">
            <a href="#" class="font-['Alata'] text-sm text-gray-400 hover:text-white transition-colors duration-200">{{ item }}</a>
          </div>
        </nav>
      </div>

      <!-- Right: Social icons + copyright -->
      <div class="flex flex-col items-center md:items-end gap-4">
        <div class="flex items-center gap-4">
          <a href="#" aria-label="Facebook" class="opacity-60 hover:opacity-100 transition-opacity">
            <img src="@/assets/icon-facebook.svg"  alt="Facebook"  class="h-5 invert" />
          </a>
          <a href="#" aria-label="Twitter" class="opacity-60 hover:opacity-100 transition-opacity">
            <img src="@/assets/icon-twitter.svg"   alt="Twitter"   class="h-5 invert" />
          </a>
          <a href="#" aria-label="Pinterest" class="opacity-60 hover:opacity-100 transition-opacity">
            <img src="@/assets/icon-pinterest.svg" alt="Pinterest" class="h-5 invert" />
          </a>
          <a href="#" aria-label="Instagram" class="opacity-60 hover:opacity-100 transition-opacity">
            <img src="@/assets/icon-instagram.svg" alt="Instagram" class="h-5 invert" />
          </a>
        </div>
        <p class="font-['Alata'] text-sm text-gray-500">© 2022 Loopstudios. All Rights Reserved</p>
      </div>

    </div>
  </footer>
</template>

<script setup>
const footerLinks = ['About', 'Careers', 'Events', 'Products', 'Support']
</script>
