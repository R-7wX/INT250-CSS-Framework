<template>
  <section class="card">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <p class="section-label mb-0">{{ lang === 'th' ? 'นักเดินทาง' : 'Travelers' }}</p>
      <span v-if="participants.length > 0"
            class="text-[11px] font-medium text-night-300 bg-night-600 border border-night-500 px-2.5 py-0.5 rounded-full">
        {{ participants.length }} added
      </span>
    </div>

    <!-- Input -->
    <div class="flex gap-2 mb-5">
      <input
        v-model="newName"
        @keyup.enter="handleAdd"
        :placeholder="lang === 'th' ? 'ชื่อนักเดินทาง…' : 'Enter traveler\'s name…'"
        class="flex-1"
      />
      <button class="btn-primary" @click="handleAdd">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Add
      </button>
    </div>

    <!-- Empty -->
    <div v-if="participants.length === 0"
         class="flex flex-col items-center py-6 gap-2 text-night-300">
      <div class="w-12 h-12 rounded-2xl bg-night-600 border border-night-500 flex items-center justify-center mb-1">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      </div>
      <p class="text-sm font-medium text-night-200">{{ lang === 'th' ? 'เพิ่มเพื่อนร่วมทริป' : 'Add your travel companions' }}</p>
      <p class="text-xs text-night-300">{{ lang === 'th' ? 'ต้องการอย่างน้อย 2 คนเพื่อหารค่าใช้จ่าย' : 'You\'ll need at least 2 people to split expenses' }}</p>
    </div>

    <!-- Participant chips -->
    <div v-else class="flex flex-wrap gap-2">
      <div
        v-for="p in participants"
        :key="p.id"
        class="chip fade-in"
      >
        <div class="badge"
             :style="{ background: p.color + '28', color: p.color, width:'28px', height:'28px', fontSize:'11px' }">
          {{ initials(p.name) }}
        </div>
        <span class="text-sm text-night-100">{{ p.name }}</span>
        <button
          @click="removeParticipant(p.id)"
          class="ml-0.5 text-night-400 hover:text-rose-400 transition-colors"
          title="Remove"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useExpenses } from '../composables/useExpenses.js'
import { lang } from '../composables/useExpenses.js'

const { participants, addParticipant, removeParticipant, initials } = useExpenses()

const newName = ref('')

function handleAdd() {
  addParticipant(newName.value)
  newName.value = ''
}
</script>
