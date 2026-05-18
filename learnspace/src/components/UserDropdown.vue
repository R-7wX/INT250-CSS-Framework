<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggle"
      class="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <div class="w-8 h-8 rounded-full bg-primary-light border-2 border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
        ST
      </div>
      <span class="text-sm font-medium hidden sm:block">Student</span>
      <span class="text-text-muted text-xs">▼</span>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-border shadow-xl z-50 overflow-hidden"
      >
        <div class="px-4 py-3 border-b border-border">
          <p class="text-sm font-semibold text-text-main">Student</p>
          <p class="text-xs text-text-muted">student@kmutt.ac.th</p>
        </div>
        <ul>
          <li v-for="item in menuItems" :key="item.label">
            <a
              href="#"
              class="flex items-center gap-2 px-4 py-2.5 text-sm text-text-main hover:bg-primary-muted hover:text-primary transition-colors"
            >
              <span class="text-base">{{ item.icon }}</span>
              {{ item.label }}
            </a>
          </li>
        </ul>
        <div class="border-t border-border">
          <a href="#" class="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
            <span class="text-base">🚪</span> Sign Out
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const open = ref(false)
const dropdownRef = ref(null)

const menuItems = [
  { icon: '👤', label: 'My Profile' },
  { icon: '⚙️', label: 'Settings' },
  { icon: '🔔', label: 'Notifications' },
]

function toggle() {
  open.value = !open.value
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
