<script setup>
// Task #2 & #4: Define all required props including social links
const props = defineProps({
  profileimg: String,
  background: String,
  name: String,
  subheading: String,
  followers: String,
  following: String,
  projects: String,
  // New props for Task #4
  X: String,
  instagram: String,
  facebook: String
})
</script>

<template>
  <div class="bg-white shadow-lg rounded-2xl w-80 text-center overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl">
    
    <div class="relative h-32">
      <img :src="background" class="w-full h-full object-cover" alt="background">
      <div class="absolute inset-x-0 -bottom-10 flex justify-center">
        <img :src="profileimg" class="w-24 h-24 rounded-full border-4 border-white object-cover" alt="profile">
      </div>
    </div>

    <div class="mt-12 px-6 pb-4">
      <h2 class="text-xl font-bold text-gray-800">{{ name }}</h2>
      <p class="text-gray-500 text-sm">{{ subheading }}</p>

      <div class="flex justify-center gap-4 mt-4 mb-2">
        <a :href="X" target="_blank" class="text-black-600 hover:text-blue-800 font-medium text-sm">X</a>
        <a :href="instagram" target="_blank" class="text-pink-600 hover:text-pink-800 font-medium text-sm">Instagram</a>
        <a :href="facebook" target="_blank" class="text-blue-700 hover:text-blue-900 font-medium text-sm">Facebook</a>
      </div>
    </div>

    <div class="border-t border-gray-100 flex justify-around p-4">
      <div class="flex flex-col">
        <span class="text-gray-700 font-bold text-lg">{{ followers }}</span>
        <span class="text-gray-400 text-xs uppercase">Followers</span>
      </div>
      <div class="flex flex-col">
        <span class="text-gray-700 font-bold text-lg">{{ following }}</span>
        <span class="text-gray-400 text-xs uppercase">Following</span>
      </div>
      <div class="flex flex-col">
        <span class="text-gray-700 font-bold text-lg">{{ projects }}</span>
        <span class="text-gray-400 text-xs uppercase">Projects</span>
      </div>
    </div>
  </div>
</template>