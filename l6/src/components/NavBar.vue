<template>
  <!-- Hero Section -->
  <section
    class="bg-[url('@/assets/mobile/image-hero.jpg')] md:bg-[url('@/assets/desktop/image-hero.jpg')]
           bg-no-repeat bg-cover bg-center min-h-[650px] relative"
  >
    <!-- ── Mobile overlay menu ───────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="menuOpen"
        class="fixed inset-0 bg-black z-50 flex flex-col p-8"
      >
        <!-- top bar -->
        <div class="flex justify-between items-center">
          <img src="@/assets/logo.svg" alt="loopstudios" class="h-6" />
          <button @click="menuOpen = false" aria-label="Close menu">
            <img src="@/assets/icon-close.svg" alt="close" class="h-5 w-5 invert" />
          </button>
        </div>

        <!-- links -->
        <nav class="flex flex-col gap-6 font-['Josefin_Sans'] uppercase text-white text-2xl tracking-widest mt-16">
          <a v-for="item in navItems" :key="item" href="#"
             class="hover:underline underline-offset-8">{{ item }}</a>
        </nav>
      </div>
    </Transition>

    <!-- ── Page container ────────────────────────────────── -->
    <div class="container max-w-6xl mx-auto px-6 py-12">

      <!-- Nav bar -->
      <nav class="flex justify-between items-center font-bold text-white">
        <img src="@/assets/logo.svg" alt="loopstudios" class="h-6 md:h-8" />

        <!-- Hamburger — mobile only -->
        <button class="md:hidden" @click="menuOpen = true" aria-label="Open menu">
          <img src="@/assets/icon-hamburger.svg" alt="menu" class="h-5 w-5 invert" />
        </button>

        <!-- Desktop links — hidden on mobile -->
        <div class="hidden h-10 font-['Alata'] md:flex md:items-center md:gap-8">
          <div v-for="item in navItems" :key="item" class="group cursor-pointer">
            <a href="#" class="text-sm font-normal tracking-wide text-white">{{ item }}</a>
            <div class="h-[2px] mt-1 bg-white scale-x-0 transition-transform duration-200 group-hover:scale-x-100 origin-center"></div>
          </div>
        </div>
      </nav>

      <!-- Hero headline box -->
      <div class="mt-24 md:mt-28 max-w-xl border-2 border-white px-8 py-6 md:px-10 md:py-8 mx-2">
        <h1 class="font-['Josefin_Sans'] text-white uppercase text-4xl md:text-6xl leading-tight tracking-widest font-light">
          Impressive<br />Experiences<br />That Deliver
        </h1>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const navItems = ['About', 'Careers', 'Events', 'Products', 'Support']
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to    { opacity: 0; }
</style>
