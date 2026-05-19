<template>
  <!-- Trip Selector in sidebar -->
  <div class="trip-manager">
    <!-- Active trip header -->
    <div class="trip-header" @click="expanded = !expanded">
      <div class="trip-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      </div>
      <div class="trip-info">
        <p class="trip-name">{{ activeTrip?.name ?? lang === 'th' ? 'ยังไม่ได้เลือกทริป' : 'No trip selected' }}</p>
        <p class="trip-meta">{{ activeTrip ? activeTrip.baseCurrency : lang === 'th' ? 'เลือกทริป' : 'Select a trip' }}</p>
      </div>
      <svg class="trip-chevron" :class="{ open: expanded }"
           width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 9l6 6 6-6"/>
      </svg>
    </div>

    <!-- Dropdown -->
    <Transition name="slide-down">
      <div v-if="expanded" class="trip-dropdown">

        <!-- Trip list -->
        <div v-for="trip in trips" :key="trip.id"
             class="trip-item" :class="{ active: trip.id === activeTripId }"
             @click="selectTrip(trip.id)">
          <div class="trip-item-dot" :style="{ background: trip.id === activeTripId ? '#F59E0B' : 'var(--border)' }"/>
          <span class="trip-item-name">{{ trip.name }}</span>
          <span class="trip-item-cur">{{ trip.baseCurrency }}</span>
          <button class="trip-del-btn" @click.stop="confirmDelete(trip.id)" title="Delete trip">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div v-if="!trips.length" class="trip-empty">{{ lang === 'th' ? 'ยังไม่มีทริป' : 'No trips yet' }}</div>

        <!-- New trip -->
        <div v-if="!showForm" class="trip-add-btn" @click="showForm = true">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          New trip
        </div>

        <!-- Create form -->
        <div v-else class="trip-form">
          <input v-model="newName" @keyup.enter="handleCreate"
                 :placeholder="lang === 'th' ? 'ชื่อทริป…' : 'Trip name…'" class="trip-form-input" ref="nameInputRef" />
          <select v-model="newCurrency" class="trip-form-select">
            <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">
              {{ c.code }} — {{ c.name }}
            </option>
          </select>
          <div class="trip-form-actions">
            <button class="trip-form-cancel" @click="showForm = false">{{ lang === 'th' ? 'ยกเลิก' : 'Cancel' }}</button>
            <button class="trip-form-create" @click="handleCreate">{{ lang === 'th' ? 'สร้าง' : 'Create' }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Undo/Redo -->
    <div class="undo-row" v-if="activeTrip">
      <button class="undo-btn" :disabled="!canUndo" @click="undo" title="Undo (Ctrl+Z)">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
        </svg>
        Undo
      </button>
      <button class="undo-btn" :disabled="!canRedo" @click="redo" title="Redo">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-4.5"/>
        </svg>
        Redo
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useTrips } from '../composables/useExpenses.js'
import { lang } from '../composables/useExpenses.js'
import { CURRENCIES } from '../composables/useExpenses.js'

const { trips, activeTrip, activeTripId, createTrip, deleteTrip, setActiveTrip, undo, redo, canUndo, canRedo } = useTrips()

const expanded   = ref(false)
const showForm   = ref(false)
const newName    = ref('')
const newCurrency = ref('THB')
const nameInputRef = ref(null)

function selectTrip(id) {
  setActiveTrip(id)
  expanded.value = false
  showForm.value = false
}

function handleCreate() {
  if (!newName.value.trim()) return
  createTrip(newName.value, newCurrency.value)
  newName.value = ''
  newCurrency.value = 'THB'
  showForm.value = false
  expanded.value = false
}

function confirmDelete(id) {
  if (trips.value.length <= 1) {
    if (confirm('Delete this trip?')) deleteTrip(id)
    return
  }
  if (confirm('Delete this trip? This cannot be undone.')) deleteTrip(id)
}
</script>
