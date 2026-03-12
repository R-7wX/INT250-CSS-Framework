<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{{ t('sb_title') }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('sb_sub') }}</p>
        <input
          v-model="store.tripName"
          :placeholder="t('sb_trip_name_placeholder')"
          class="mt-3 px-4 py-2 rounded-2xl text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-400 w-72 placeholder-slate-400 dark:placeholder-slate-500"
        />
        <div class="mt-2 flex items-center gap-2">
          <label class="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{{ t('sb_travel_date_label') }}</label>
          <DatePicker v-model="store.travelDate" />
        </div>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button @click="clearAll" class="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          {{ t('sb_clear') }}
        </button>
        <button @click="addDay" class="px-4 py-2 rounded-2xl text-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white shadow transition-colors">
          {{ t('sb_add_day') }}
        </button>
        <button
          @click="generateChecklist"
          class="relative overflow-hidden flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-bold text-white shadow-lg transition-all duration-200"
          :class="hasAnyPlace ? 'hover:scale-105 hover:shadow-xl opacity-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'"
          :style="hasAnyPlace ? 'background: linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #0ea5e9 100%); box-shadow: 0 4px 18px rgba(6,182,212,0.40);' : 'background: linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #0ea5e9 100%);'"
        >
          <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
          <span class="relative z-10">{{ t('sb_generate') }}</span>
          <span class="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl"></span>
        </button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Sidebar: Saved Vibes -->
      <aside class="w-full lg:w-80 shrink-0">
        <div class="glass-panel rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm lg:sticky lg:top-20">
          <h2 class="font-bold text-base mb-0.5 text-slate-700 dark:text-slate-300 flex items-center gap-2">
            {{ t('sb_saved_vibes') }}
            <span v-if="sidebarPlaces.length > 0" class="px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              {{ sidebarPlaces.length }}
            </span>
          </h2>
          <p class="text-xs text-slate-400 mb-2">{{ isTouchDevice ? t('sb_drag_hint_mob') : t('sb_drag_hint') }}</p>

          <!-- Search box -->
          <div v-if="sidebarPlaces.length > 0" class="relative mb-3">
            <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              v-model="sidebarSearch"
              type="text"
              class="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              :placeholder="t('sb_search_placeholder')"
            />
            <button v-if="sidebarSearch" @click="sidebarSearch = ''" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div
            id="sidebar-zone"
            class="min-h-[80px] rounded-2xl p-2 transition-colors"
            :class="[
              sidebarPlaces.length === 0 ? 'border-2 border-dashed border-slate-300 dark:border-slate-600' : '',
              sidebarPlaces.length > 0 ? 'max-h-[410px] overflow-y-auto overscroll-contain scrollbar-thin' : ''
            ]"
            @dragover.prevent
            @drop="onDropToSidebar"
          >
            <!-- Empty state -->
            <div v-if="sidebarPlaces.length === 0" class="flex flex-col items-center justify-center py-6 text-slate-400 gap-2">
              <svg class="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <p class="text-xs text-center">{{ t('sb_no_saved') }}</p>
              <RouterLink to="/" class="text-xs text-teal-500 font-semibold hover:underline">{{ t('sb_go_discover') }}</RouterLink>
            </div>

            <!-- No search results -->
            <div v-else-if="filteredSidebarPlaces.length === 0" class="py-6 text-center text-xs text-slate-400">
              {{ t('idx_empty_h') }}
            </div>

            <!-- Cards -->
            <SbCard
              v-for="name in filteredSidebarPlaces" :key="name"
              :name="name"
              :in-board="false"
              @add-to-day="openDayPicker(name)"
              @drag-start="draggedItem = name"
            />
          </div>
        </div>
      </aside>

      <!-- Day boards -->
      <div class="flex-1 space-y-4" id="boards-container">
        <div v-if="days.length === 0" class="text-center py-16 text-slate-400">
          <svg class="w-16 h-16 mb-3 mx-auto text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p>{{ t('sb_add_day') }}</p>
        </div>

        <div
          v-for="(day, dayIdx) in days" :key="day.id"
          class="glass-panel p-5 rounded-3xl shadow-md border border-slate-200/60 dark:border-slate-700/60"
        >
          <div class="flex justify-between items-start mb-3 gap-2">
            <h3 class="font-bold text-lg text-teal-600 dark:text-teal-400 flex items-baseline gap-2 flex-wrap">
              <span class="shrink-0">{{ t('sb_day') }} {{ dayIdx + 1 }}:</span>
              <input
                v-model="day.subtitle"
                :placeholder="t('sb_placeholder')"
                class="bg-transparent border-none outline-none text-teal-600 dark:text-teal-400 font-bold text-lg w-40 min-w-0"
              />
              <span class="text-xs font-normal text-slate-400">{{ daySummary(day) }}</span>
            </h3>
            <button @click="confirmRemoveDay(dayIdx)" class="shrink-0 text-rose-400 hover:text-rose-600 text-xs font-medium transition-colors mt-1 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20">
              {{ t('sb_del_day') }}
            </button>
            <button
              v-if="day.places.length > 0"
              @click="confirmClearDayPlaces(dayIdx)"
              class="shrink-0 flex items-center gap-1 text-slate-400 hover:text-amber-500 text-xs font-medium transition-colors mt-1 px-2 py-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              {{ t('sb_clear_day_btn') }}
            </button>
          </div>

          <!-- Drop zone -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-h-[100px] rounded-2xl p-3 transition-colors"
            :class="day.places.length === 0 ? 'border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30' : ''"
            @dragover.prevent
            @drop="onDropToDay(dayIdx, $event)"
          >
            <div v-if="day.places.length === 0" class="col-span-2 flex flex-col items-center justify-center text-slate-400 py-4 gap-1.5 pointer-events-none">
              <svg class="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <p class="text-sm text-center">
                <span v-if="isTouchDevice">{{ t('sb_drop_mob') }}</span>
                <span v-else>{{ t('sb_drop_hint') }}</span>
              </p>
              <p class="text-xs text-teal-400 flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
                </svg>
                {{ t('sb_drop_guide') }}
              </p>
            </div>

            <div
              v-for="(place, placeIdx) in day.places" :key="`${dayIdx}-${placeIdx}`"
              class="relative"
              :data-touch-card="true"
              :data-touch-day="dayIdx"
              :data-touch-place="placeIdx"
              @dragover.prevent="dragOverTarget = { dayIdx, placeIdx }"
              @dragleave="dragOverTarget = null"
            >
              <!-- Drop indicator line -->
              <div
                v-if="(dragOverTarget?.dayIdx === dayIdx && dragOverTarget?.placeIdx === placeIdx && draggedFrom?.dayIdx !== placeIdx) || (touchOver?.dayIdx === dayIdx && touchOver?.placeIdx === placeIdx)"
                class="absolute -top-1 left-2 right-2 h-0.5 rounded-full bg-teal-400 z-10"
              />
              <SbCard
                :name="place.name"
                :in-board="true"
                :start="place.start"
                :end="place.end"
                :class="[touchDrag?.dayIdx === dayIdx && touchDrag?.placeIdx === placeIdx ? 'opacity-40 scale-95' : '', overlapMap[`${dayIdx}-${placeIdx}`] ? 'ring-2 ring-amber-400/70' : '']"
                @update-time="(s, e) => updateTime(dayIdx, placeIdx, s, e)"
                @return-card="returnToSidebar(dayIdx, placeIdx)"
                @drag-start="draggedItem = place.name; draggedFrom = { type: 'board', dayIdx, placeIdx }"
                @touch-drag-start="onTouchDragStart(dayIdx, placeIdx, $event)"
              />
              <!-- Overlap warning -->
              <div v-if="overlapMap[`${dayIdx}-${placeIdx}`]" class="flex items-center gap-1 px-2 pt-1 pb-0.5 text-amber-400 text-[10px] font-medium">
                <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                {{ t('sb_time_overlap') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day Picker Modal -->
    <Transition name="modal">
      <div v-if="pickerOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="pickerOpen = false">
        <div class="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 flex flex-col max-h-[80vh]">
          <h3 class="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200 shrink-0">{{ t('sb_picker_title') }}</h3>
          <div class="space-y-2 overflow-y-auto overscroll-contain flex-1 pr-1">
            <button
              v-for="(day, idx) in days" :key="day.id"
              @click="addCardToDay(idx)"
              @touchend="$event.target.blur()"
              class="w-full text-left px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none active:bg-teal-50 dark:active:bg-teal-900/20 sm:hover:bg-teal-50 dark:sm:hover:bg-teal-900/20 sm:hover:border-teal-300 dark:sm:hover:border-teal-700 transition-colors font-medium text-sm text-slate-800 dark:text-slate-200"
            >
              {{ t('sb_day') }} {{ idx + 1 }}: {{ day.subtitle || t('sb_placeholder') }}
            </button>
          </div>
          <button @click="pickerOpen = false" class="mt-4 w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
            {{ t('sb_picker_cancel') }}
          </button>
        </div>
      </div>
    </Transition>

  <!-- Scroll to top button -->
  <Transition name="scroll-top">
    <button
      v-if="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-24 right-5 z-50 w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 bg-teal-500 hover:bg-teal-400 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
      aria-label="Scroll to top"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>
      </svg>
    </button>
  </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useAppStore } from '../stores/useAppStore.js'
import { useI18n } from '../composables/useI18n.js'
import { PLACE_NAMES } from '../data/places.js'
import SbCard from '../components/SbCard.vue'
import DatePicker from '../components/DatePicker.vue'

const store = useAppStore()
const { t, lang } = useI18n()
const router = useRouter()

const isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0

// Sidebar = saved places NOT yet in any board
const days = ref([])
let nextId = 1

const sidebarPlaces = computed(() => store.savedPlaces)

// Search
const sidebarSearch = ref('')
function getDisplayName(thaiName) {
  if (lang.value === 'th') return thaiName
  const row = PLACE_NAMES[thaiName]
  if (!row) return thaiName
  return row[lang.value] || row['en'] || thaiName
}
const filteredSidebarPlaces = computed(() => {
  const q = sidebarSearch.value.trim().toLowerCase()
  if (!q) return sidebarPlaces.value
  return sidebarPlaces.value.filter(name => {
    const display = getDisplayName(name).toLowerCase()
    const thai    = name.toLowerCase()
    return display.includes(q) || thai.includes(q)
  })
})

const draggedItem = ref(null)
const draggedFrom = ref(null)
const dragOverTarget = ref(null) // { dayIdx, placeIdx }

// Touch drag state
const touchDrag = ref(null)   // { dayIdx, placeIdx }
const touchOver = ref(null)   // { dayIdx, placeIdx }
let touchCloneEl = null

const pickerOpen = ref(false)
const pickerName = ref(null)

// ── Helpers ──
function calcDuration(s, e) {
  const [sh, sm] = s.split(':').map(Number)
  const [eh, em] = e.split(':').map(Number)
  const d = (eh * 60 + em) - (sh * 60 + sm)
  if (d <= 0) return '—'
  const h = Math.floor(d / 60), m = d % 60
  return h > 0 ? (m > 0 ? `${h}${t('dur_hr')} ${m}${t('dur_min')}` : `${h}${t('dur_hr')}`) : `${m}${t('dur_min')}`
}

function daySummary(day) {
  if (!day.places.length) return ''
  let mins = 0
  day.places.forEach(p => {
    const [sh, sm] = p.start.split(':').map(Number)
    const [eh, em] = p.end.split(':').map(Number)
    const diff = (eh * 60 + em) - (sh * 60 + sm)
    if (diff > 0) mins += diff
  })
  const h = Math.floor(mins / 60), m = mins % 60
  const dur = mins > 0 ? ` · ${h > 0 ? h + t('dur_hr') : ''}${m > 0 ? ' ' + m + t('dur_min') : ''}`.trimEnd() : ''
  return `${day.places.length} ${t('sb_places_unit')}${dur}`
}

function addDay() {
  days.value.push({ id: nextId++, subtitle: '', places: [] })
  saveBoard()
}

function confirmClearDayPlaces(idx) {
  store.showConfirm({
    title: t('sb_clear_day_title'),
    desc:  t('sb_clear_day_desc'),
    confirmLabel: t('sb_clear_day_btn'),
    cancelLabel:  t('modal_cancel'),
    danger: false,
    onConfirm: () => {
      days.value[idx].places = []
      saveBoard()
    }
  })
}

function confirmRemoveDay(idx) {
  store.showConfirm({
    title: t('sb_del_day_title'),
    desc:  t('sb_del_day_desc'),
    confirmLabel: t('sb_del_day_confirm_btn'),
    cancelLabel:  t('modal_cancel'),
    danger: true,
    onConfirm: () => removeDay(idx)
  })
}

function removeDay(idx) {
  days.value.splice(idx, 1)
  saveBoard()
}

function clearAll() {
  store.showConfirm({
    title: t('sb_clear_title'),
    desc:  t('sb_clear_desc'),
    confirmLabel: t('sb_clear_confirm_btn'),
    cancelLabel:  t('modal_cancel'),
    danger: true,
    onConfirm: () => {
      days.value = []
      days.value.push({ id: nextId++, subtitle: t('sb_arrival'), places: [] })
      store.tripName = ''
      store.travelDate = ''
      saveBoard()
    }
  })
}

function updateTime(dayIdx, placeIdx, s, e) {
  days.value[dayIdx].places[placeIdx].start = s
  days.value[dayIdx].places[placeIdx].end = e
  saveBoard()
}

function returnToSidebar(dayIdx, placeIdx) {
  const removed = days.value[dayIdx].places[placeIdx]
  const dayLabel = `Day ${dayIdx + 1}`
  days.value[dayIdx].places.splice(placeIdx, 1)
  saveBoard()
  store.showToast(`${t('toast_returned')} ${t('sb_day')} ${dayIdx + 1}`, {
    type: 'info',
    duration: 5000,
    undoFn: () => {
      days.value[dayIdx].places.splice(placeIdx, 0, removed)
      saveBoard()
    }
  })
}

function openDayPicker(name) {
  if (days.value.length === 0) {
    store.showToast(t('sb_add_day_alert'), { type: 'warning', duration: 3000 })
    return
  }
  pickerName.value = name
  pickerOpen.value = true
}

function addCardToDay(dayIdx) {
  if (pickerName.value) {
    const name = pickerName.value
    days.value[dayIdx].places.push({ name, start: '09:00', end: '11:00' })
    const displayName = getDisplayNameForToast(name)
    store.showToast(`${displayName} → ${t('sb_day')} ${dayIdx + 1}`, { type: 'success' })
  }
  pickerOpen.value = false
  pickerName.value = null
  saveBoard()
}

function getDisplayNameForToast(thaiName) {
  const row = PLACE_NAMES[thaiName]
  if (!row) return thaiName
  const l = store.lang
  if (l === 'th') return thaiName
  return row[l] || row['en'] || thaiName
}

// Drag and drop
function onDropToDay(dayIdx, e) {
  if (!draggedItem.value) return
  const name = draggedItem.value
  const toIdx = dragOverTarget.value?.dayIdx === dayIdx ? dragOverTarget.value.placeIdx : null

  if (draggedFrom.value?.type === 'board') {
    const { dayIdx: fromDay, placeIdx: fromPlace } = draggedFrom.value
    // Reorder within same day
    if (fromDay === dayIdx && toIdx !== null && toIdx !== fromPlace) {
      const places = days.value[dayIdx].places
      const [item] = places.splice(fromPlace, 1)
      const insertAt = toIdx > fromPlace ? toIdx - 1 : toIdx
      places.splice(insertAt, 0, item)
    } else if (fromDay !== dayIdx) {
      // Move to different day
      const place = days.value[fromDay].places.splice(fromPlace, 1)[0]
      if (toIdx !== null) {
        days.value[dayIdx].places.splice(toIdx, 0, place)
      } else {
        days.value[dayIdx].places.push(place)
      }
    }
  } else {
    // From sidebar → insert at position or push
    const newPlace = { name, start: '09:00', end: '11:00' }
    if (toIdx !== null) {
      days.value[dayIdx].places.splice(toIdx, 0, newPlace)
    } else {
      days.value[dayIdx].places.push(newPlace)
    }
  }
  draggedItem.value = null
  draggedFrom.value = null
  dragOverTarget.value = null
  saveBoard()
}

function onDropToSidebar(e) {
  if (!draggedItem.value) return
  // Only handle board → sidebar (remove from board; sidebar already has the place)
  if (draggedFrom.value?.type === 'board') {
    const { dayIdx, placeIdx } = draggedFrom.value
    days.value[dayIdx].places.splice(placeIdx, 1)
    saveBoard()
  }
  draggedItem.value = null
  draggedFrom.value = null
}

// Time overlap detection
function toMin(t) { const [h,m]=t.split(':').map(Number); return h*60+m }
const overlapMap = computed(() => {
  const result = {}
  days.value.forEach((day, di) => {
    const places = day.places
    for (let i = 0; i < places.length; i++) {
      for (let j = i + 1; j < places.length; j++) {
        const aS = toMin(places[i].start), aE = toMin(places[i].end)
        const bS = toMin(places[j].start), bE = toMin(places[j].end)
        if (aS < bE && bS < aE) {
          result[`${di}-${i}`] = true
          result[`${di}-${j}`] = true
        }
      }
    }
  })
  return result
})
function onTouchDragStart(dayIdx, placeIdx, e) {
  e.preventDefault()
  touchDrag.value = { dayIdx, placeIdx }
  touchOver.value = null

  // Create floating clone
  const cardEl = e.target.closest('.sb-card')
  if (cardEl) {
    const rect = cardEl.getBoundingClientRect()
    touchCloneEl = cardEl.cloneNode(true)
    touchCloneEl.style.cssText = `
      position:fixed; z-index:9999; pointer-events:none; opacity:0.85;
      width:${rect.width}px; left:${rect.left}px; top:${rect.top}px;
      transition:none; box-shadow:0 8px 30px rgba(0,0,0,0.25);
      border-radius:1rem; transform:scale(1.03);
    `
    document.body.appendChild(touchCloneEl)
  }

  document.addEventListener('touchmove', onTouchMove, { passive: false })
  document.addEventListener('touchend', onTouchEnd)
}

function onTouchMove(e) {
  e.preventDefault()
  if (!touchDrag.value || !touchCloneEl) return
  const t = e.touches[0]

  // Move clone
  touchCloneEl.style.left = `${t.clientX - touchCloneEl.offsetWidth / 2}px`
  touchCloneEl.style.top  = `${t.clientY - touchCloneEl.offsetHeight / 2}px`

  // Find card under finger (hide clone temporarily)
  touchCloneEl.style.display = 'none'
  const el = document.elementFromPoint(t.clientX, t.clientY)
  touchCloneEl.style.display = ''

  const cardWrapper = el?.closest('[data-touch-card]')
  if (cardWrapper) {
    touchOver.value = {
      dayIdx:   parseInt(cardWrapper.dataset.touchDay),
      placeIdx: parseInt(cardWrapper.dataset.touchPlace),
    }
  } else {
    touchOver.value = null
  }
}

function onTouchEnd() {
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)

  if (touchCloneEl) { touchCloneEl.remove(); touchCloneEl = null }

  if (touchDrag.value && touchOver.value) {
    const { dayIdx: fromDay, placeIdx: fromPlace } = touchDrag.value
    const { dayIdx: toDay, placeIdx: toPlace }     = touchOver.value

    if (!(fromDay === toDay && fromPlace === toPlace)) {
      const fromPlaces = days.value[fromDay].places
      const [item] = fromPlaces.splice(fromPlace, 1)
      const toPlaces = days.value[toDay].places
      const insertAt = (fromDay === toDay && toPlace > fromPlace) ? toPlace - 1 : toPlace
      toPlaces.splice(Math.max(0, insertAt), 0, item)
      saveBoard()
    }
  }

  touchDrag.value = null
  touchOver.value = null
}

function saveBoard() {
  store.saveBoard({
    days: days.value.map(d => ({
      subtitle: d.subtitle,
      places: d.places
    }))
  })
}

const hasAnyPlace = computed(() => days.value.some(d => d.places.length > 0))

function generateChecklist() {
  if (!hasAnyPlace.value) {
    store.showToast(t('sb_no_places_warn'), { type: 'warning', duration: 3000 })
    return
  }
  const exportDays = days.value.map((d, i) => ({
    dayNum: i + 1,
    subtitle: d.subtitle,
    places: d.places
  }))
  store.setExport({ days: exportDays, exportedAt: new Date().toISOString() })
  router.push('/checklist')
}

// Scroll to top
const showScrollTop = ref(false)
function onScroll() { showScrollTop.value = window.scrollY > 320 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

// Init
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  const saved = store.boardData
  if (saved && saved.days) {
    days.value = saved.days.map(d => ({ id: nextId++, subtitle: d.subtitle || '', places: d.places || [] }))
    if (days.value.length === 0) days.value.push({ id: nextId++, subtitle: t('sb_arrival'), places: [] })
  } else {
    days.value.push({ id: nextId++, subtitle: t('sb_arrival'), places: [] })
  }
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.scroll-top-enter-active, .scroll-top-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.scroll-top-enter-from, .scroll-top-leave-to { opacity: 0; transform: translateY(12px) scale(0.9); }
</style>