<template>
  <section class="px-6 lg:px-20 -mt-20">
    <div class="bg-indigo-950 rounded-xl p-6 lg:p-12 bg-cover bg-no-repeat flex flex-col md:flex-row gap-4 
                bg-[url('./assets/bg-shorten-mobile.svg')] md:bg-[url('./assets/bg-shorten-desktop.svg')]">
      <input 
        type="text" 
        placeholder="Shorten a link here..." 
        class="flex-1 p-4 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
      />
      <button class="bg-cyan-400 text-white px-10 py-4 rounded-lg font-bold hover:bg-cyan-300 transition-colors">
        Shorten It!
      </button>
    </div>

    <div class="mt-6 space-y-4">
      <div v-for="link in links" :key="link.id" 
           class="bg-white rounded-lg flex flex-col md:flex-row md:items-center justify-between p-4 md:px-6 shadow-sm">
        <p class="text-gray-800 border-b md:border-none pb-3 md:pb-0">{{ link.original }}</p>
        <div class="flex flex-col md:flex-row md:items-center gap-3 mt-3 md:mt-0">
          <p class="text-cyan-400">{{ link.short }}</p>
          <button 
            @click="copyLink(link.id)"
            :class="link.copied ? 'bg-indigo-950' : 'bg-cyan-400 hover:opacity-70'"
            class="text-white px-8 py-2 rounded-md font-bold transition-colors w-full md:w-auto"
          >
            {{ link.copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const links = ref([
  { id: 1, original: 'https://frontendmentor.io', short: 'https://rel.ink/k4Iyk', copied: false },
  { id: 2, original: 'https://twitter.com/frontendmentor', short: 'https://rel.ink/gxOXp', copied: false }
])

const copyLink = (id) => {
  const link = links.value.find(l => l.id === id)
  link.copied = true
  setTimeout(() => link.copied = false, 2000)
}
</script>