<template>
  <nav class="bg-white border-b sticky top-0 z-50" style="border-color:#ebebf5;">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style="background:#5b4ef8;">
          LS
        </div>
        <div>
          <p class="text-sm font-bold leading-none" style="color:#1a1a2e;">LearnSpace</p>
          <p class="text-xs" style="color:#888;">Student Dashboard</p>
        </div>
      </div>

      <!-- Nav Links -->
      <div class="hidden md:flex gap-8">
        <a
          v-for="link in navLinks"
          :key="link.label"
          href="#"
          class="text-sm font-medium transition-colors"
          :style="link.active ? 'color:#5b4ef8;' : 'color:#888;'"
        >{{ link.label }}</a>
      </div>

      <!-- User Dropdown -->
      <UserDropdown />
    </div>
  </nav>
</template>

<script setup>
import UserDropdown from './UserDropdown.vue'

const navLinks = [
  { label: 'Dashboard',   active: true  },
  { label: 'Courses',     active: false },
  { label: 'Assignments', active: false },
  { label: 'Progress',    active: false },
]
</script>
