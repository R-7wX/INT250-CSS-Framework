<template>
  <div class="bg-gray-100 min-h-screen">
    <header class="bg-white border-b border-gray-200 px-8 py-6">
      <p class="text-xs font-semibold text-blue-500 tracking-widest uppercase mb-1">Tailwind CSS + Vue.js</p>
      <h1 class="text-2xl font-bold text-gray-800">UI Kit Page Listing</h1>
      <p class="text-sm text-gray-500 mt-1">This page demonstrates reusable UI patterns including buttons, badges, alerts, form controls, cards, and responsive layout sections.</p>
    </header>
    <main class="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <ButtonSection />
      <BadgeSection />
      <AlertSection />
      <FormSection />
      <CardSection />
      <LayoutSection />
    </main>
  </div>
</template>

<script setup>
import ButtonSection from './components/ButtonSection.vue'
import BadgeSection  from './components/BadgeSection.vue'
import AlertSection  from './components/AlertSection.vue'
import FormSection   from './components/FormSection.vue'
import CardSection   from './components/CardSection.vue'
import LayoutSection from './components/LayoutSection.vue'
</script>
