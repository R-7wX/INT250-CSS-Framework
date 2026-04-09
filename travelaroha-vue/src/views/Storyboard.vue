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
      </div>
      <div class="flex gap-2 flex-wrap">
        <button @click="clearAll" class="px-4 py-2 rounded-2xl text-sm font-semibold border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
          {{ t('sb_clear') }}
        </button>
        <button @click="addDay" class="px-4 py-2 rounded-2xl text-sm font-semibold bg-teal-500 hover:bg-teal-600 text-white shadow transition-colors">
          {{ t('sb_add_day') }}
        </button>
        <button
          @click="generateChecklist"
          class="relative overflow-hidden flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-bold text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
          style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #0d9488 100%); box-shadow: 0 4px 18px rgba(99,102,241,0.45);"
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
      <aside class="w-full lg:w-64 shrink-0">
        <div class="glass-panel rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm">
          <h2 class="font-bold text-base mb-0.5 text-slate-700 dark:text-slate-300 flex items-center gap-2">
            {{ t('sb_saved_vibes') }}
            <span v-if="sidebarPlaces.length > 0" class="px-1.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400">
              {{ sidebarPlaces.length }}
            </span>
          </h2>
          <p class="text-xs text-slate-400 mb-3">{{ t('sb_drag_hint') }}</p>

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

            <!-- Cards -->
            <SbCard
              v-for="name in sidebarPlaces" :key="name"
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
              <span class="shrink-0">Day {{ dayIdx + 1 }}:</span>
              <input
                v-model="day.subtitle"
                :placeholder="t('sb_placeholder')"
                class="bg-transparent border-none outline-none text-teal-600 dark:text-teal-400 font-bold text-lg w-40 min-w-0"
              />
              <span class="text-xs font-normal text-slate-400">{{ daySummary(day) }}</span>
            </h3>
            <button @click="removeDay(dayIdx)" class="shrink-0 text-rose-400 hover:text-rose-600 text-xs font-medium transition-colors mt-1 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20">
              {{ t('sb_del_day') }}
            </button>
          </div>

          <!-- Drop zone -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-h-[100px] rounded-2xl p-3 transition-colors"
            :class="day.places.length === 0 ? 'border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30' : ''"
            @dragover.prevent
            @drop="onDropToDay(dayIdx, $event)"
          >
            <div v-if="day.places.length === 0" class="col-span-2 flex flex-col items-center justify-center text-slate-400 py-4 gap-2 pointer-events-none">
              <svg class="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <p class="text-sm">{{ t('sb_drop_hint') }} <span class="md:hidden">{{ t('sb_drop_mob') }}</span></p>
            </div>

            <SbCard
              v-for="(place, placeIdx) in day.places" :key="place.name + placeIdx"
              :name="place.name"
              :in-board="true"
              :start="place.start"
              :end="place.end"
              @update-time="(s, e) => updateTime(dayIdx, placeIdx, s, e)"
              @return-card="returnToSidebar(dayIdx, placeIdx)"
              @drag-start="draggedItem = place.name; draggedFrom = { type: 'board', dayIdx, placeIdx }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Day Picker Modal -->
    <Transition name="modal">
      <div v-if="pickerOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="pickerOpen = false">
        <div class="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6">
          <h3 class="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">{{ t('sb_picker_title') }}</h3>
          <div class="space-y-2">
            <button
              v-for="(day, idx) in days" :key="day.id"
              @click="addCardToDay(idx)"
              class="w-full text-left px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-300 dark:hover:border-teal-700 transition-colors font-medium text-sm text-slate-800 dark:text-slate-200"
            >
              Day {{ idx + 1 }}: {{ day.subtitle || t('sb_placeholder') }}
            </button>
          </div>
          <button @click="pickerOpen = false" class="mt-4 w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            {{ t('sb_picker_cancel') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useAppStore } from '../stores/useAppStore.js'
import { useI18n } from '../composables/useI18n.js'
import SbCard from '../components/SbCard.vue'

const store = useAppStore()
const { t } = useI18n()
const router = useRouter()

// Sidebar = saved places NOT yet in any board
const days = ref([])
let nextId = 1

const sidebarPlaces = computed(() => {
  const boardNames = days.value.flatMap(d => d.places.map(p => p.name))
  return store.savedPlaces.filter(n => !boardNames.includes(n))
})

const draggedItem = ref(null)
const draggedFrom = ref(null)

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

function removeDay(idx) {
  days.value.splice(idx, 1)
  saveBoard()
}

function clearAll() {
  if (!confirm(t('sb_clear_confirm'))) return
  days.value = []
  days.value.push({ id: nextId++, subtitle: t('sb_arrival'), places: [] })
  saveBoard()
}

function updateTime(dayIdx, placeIdx, s, e) {
  days.value[dayIdx].places[placeIdx].start = s
  days.value[dayIdx].places[placeIdx].end = e
  saveBoard()
}

function returnToSidebar(dayIdx, placeIdx) {
  days.value[dayIdx].places.splice(placeIdx, 1)
  saveBoard()
}

function openDayPicker(name) {
  if (days.value.length === 0) { alert(t('sb_add_day_alert')); return }
  pickerName.value = name
  pickerOpen.value = true
}

function addCardToDay(dayIdx) {
  if (pickerName.value) {
    days.value[dayIdx].places.push({ name: pickerName.value, start: '09:00', end: '11:00' })
  }
  pickerOpen.value = false
  pickerName.value = null
  saveBoard()
}

// Drag and drop
function onDropToDay(dayIdx, e) {
  if (!draggedItem.value) return
  const name = draggedItem.value
  // Remove from source
  if (draggedFrom.value?.type === 'board') {
    const { dayIdx: fromDay, placeIdx: fromPlace } = draggedFrom.value
    days.value[fromDay].places.splice(fromPlace, 1)
  }
  days.value[dayIdx].places.push({ name, start: '09:00', end: '11:00' })
  draggedItem.value = null
  draggedFrom.value = null
  saveBoard()
}

function onDropToSidebar(e) {
  if (!draggedItem.value) return
  if (draggedFrom.value?.type === 'board') {
    const { dayIdx, placeIdx } = draggedFrom.value
    days.value[dayIdx].places.splice(placeIdx, 1)
    saveBoard()
  }
  draggedItem.value = null
  draggedFrom.value = null
}

function saveBoard() {
  store.saveBoard({
    days: days.value.map(d => ({
      subtitle: d.subtitle,
      places: d.places
    }))
  })
}

function generateChecklist() {
  const exportDays = days.value.map((d, i) => ({
    dayNum: i + 1,
    subtitle: d.subtitle,
    places: d.places
  }))
  store.setExport({ days: exportDays, exportedAt: new Date().toISOString() })
  router.push('/checklist')
}

// Init
onMounted(() => {
  const saved = store.boardData
  if (saved && saved.days) {
    days.value = saved.days.map(d => ({ id: nextId++, subtitle: d.subtitle || '', places: d.places || [] }))
    if (days.value.length === 0) days.value.push({ id: nextId++, subtitle: t('sb_arrival'), places: [] })
  } else {
    days.value.push({ id: nextId++, subtitle: t('sb_arrival'), places: [] })
  }
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>