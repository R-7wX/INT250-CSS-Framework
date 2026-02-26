<template>
  <nav class="flex items-center justify-between p-6 lg:px-20">
    <div class="flex items-center space-x-10">
      <img src="../assets/logo.svg" alt="Shortly Logo" />
      <div class="hidden lg:flex space-x-8 text-gray-400 font-bold">
        <a href="#" class="hover:text-black">Features</a>
        <a href="#" class="hover:text-black">Pricing</a>
        <a href="#" class="hover:text-black">Resources</a>
      </div>
    </div>

    <div class="hidden lg:flex items-center space-x-8 font-bold">
      <button class="text-gray-400 hover:text-black">Login</button>
      <button class="bg-cyan-400 text-white px-6 py-2 rounded-full hover:opacity-70">Sign Up</button>
    </div>

    <div class="lg:hidden">
      <button @click="isOpen = !isOpen" class="text-gray-400 focus:outline-none">
        <span v-if="!isOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>

    <div v-if="isOpen" class="absolute top-20 left-6 right-6 bg-indigo-950 p-8 rounded-xl lg:hidden text-center text-white font-bold space-y-6">
      <a href="#" class="block">Features</a>
      <a href="#" class="block">Pricing</a>
      <a href="#" class="block">Resources</a>
      <hr class="border-gray-600" />
      <button class="block w-full">Login</button>
      <button class="w-full bg-cyan-400 py-3 rounded-full">Sign Up</button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false) // State to toggle the hamburger menu [cite: 214]
</script>