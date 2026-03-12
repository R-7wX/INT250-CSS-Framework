<template>
  <div
    draggable="true"
    class="sb-card bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700
           cursor-grab active:cursor-grabbing hover:-translate-y-0.5 transition-all overflow-hidden select-none"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="flex items-center p-3 gap-3">
      <!-- Touch drag handle (board only) -->
      <div
        v-if="inBoard"
        class="touch-handle shrink-0 flex flex-col gap-[3px] px-1 py-2 cursor-grab text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500"
        @touchstart.stop="$emit('touch-drag-start', $event)"
        @dragstart.stop.prevent
      >
        <span class="block w-4 h-0.5 rounded-full bg-current"></span>
        <span class="block w-4 h-0.5 rounded-full bg-current"></span>
        <span class="block w-4 h-0.5 rounded-full bg-current"></span>
      </div>

      <img :src="placeData?.img" class="w-12 h-12 rounded-xl object-cover shrink-0 pointer-events-none" loading="lazy" />
      <div class="flex-1 min-w-0 pointer-events-none">
        <h4 class="font-bold text-sm truncate text-slate-800 dark:text-slate-200">{{ displayName }}</h4>
        <p class="text-xs text-slate-500 truncate">{{ displayVibe }}</p>
      </div>

      <!-- Sidebar add btn -->
      <button
        v-if="!inBoard"
        @click.stop="$emit('add-to-day')"
        @dragstart.prevent
        class="w-8 h-8 flex shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 hover:bg-teal-200 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
      </button>

      <!-- Board return btn -->
      <button
        v-if="inBoard"
        @click.stop="$emit('return-card')"
        @dragstart.prevent
        class="w-7 h-7 flex shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-rose-100 hover:text-rose-500 transition-colors"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
      </button>
    </div>

    <!-- Time stepper (board only) -->
    <div v-if="inBoard" class="px-3 pb-3 border-t border-slate-100 dark:border-slate-600/50 pt-2.5">
      <div class="flex items-center gap-1.5">
        <!-- Clock icon = toggle 12/24h -->
        <button
          @click.stop="use12 = !use12"
          @dragstart.prevent
          :title="use12 ? 'Switch to 24h' : 'Switch to AM/PM'"
          class="shrink-0 transition-colors"
          :class="use12 ? 'text-teal-400' : 'text-slate-400 hover:text-teal-400'"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>

        <TimeStepper :value="localStart" :use12="use12" @change="v => onTimeChange(v, localEnd)" />
        <span class="text-xs text-slate-400">–</span>
        <TimeStepper :value="localEnd" :use12="use12" @change="v => onTimeChange(localStart, v)" />

        <span class="ml-auto text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full whitespace-nowrap">
          {{ duration }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { PLACES, PLACE_NAMES } from '../data/places.js'
import TimeStepper from './TimeStepper.vue'

const VIBE_I18N_KEY = {
  'Urban Adventure': 'idx_vibe_urban',
  'Slow Living':     'idx_vibe_slow',
  'Nature Retreat':  'idx_vibe_nature',
  'Foodie Tour':     'idx_vibe_foodie',
  'Beach Getaway':   'idx_vibe_beach',
}
const VIBE_ICONS = {
  'Urban Adventure': '🏙️',
  'Slow Living':     '☕',
  'Nature Retreat':  '🌲',
  'Foodie Tour':     '🍣',
  'Beach Getaway':   '🏖️',
}

const props = defineProps({
  name:    String,
  inBoard: Boolean,
  start:   { type: String, default: '09:00' },
  end:     { type: String, default: '11:00' },
})

const emit = defineEmits(['add-to-day', 'return-card', 'update-time', 'drag-start', 'touch-drag-start'])

const { t, lang } = useI18n()
const use12 = ref(false)
const localStart = ref(props.start)
const localEnd   = ref(props.end)
watch(() => props.start, v => localStart.value = v)
watch(() => props.end,   v => localEnd.value   = v)

const placeData   = computed(() => PLACES.find(p => p.name === props.name))
const displayName = computed(() => {
  if (lang.value === 'th') return props.name
  const row = PLACE_NAMES[props.name]
  return row?.[lang.value] || row?.en || props.name
})
const displayVibe = computed(() => {
  const vibe = placeData.value?.vibe
  if (!vibe) return ''
  const key  = VIBE_I18N_KEY[vibe]
  const icon = VIBE_ICONS[vibe] || ''
  return key ? `${icon} ${t(key)}` : vibe
})
const duration = computed(() => {
  const [sh, sm] = localStart.value.split(':').map(Number)
  const [eh, em] = localEnd.value.split(':').map(Number)
  const d = (eh * 60 + em) - (sh * 60 + sm)
  if (d <= 0) return '—'
  const h = Math.floor(d / 60), m = d % 60
  return h > 0 ? (m > 0 ? `${h}${t('dur_hr')} ${m}${t('dur_min')}` : `${h}${t('dur_hr')}`) : `${m}${t('dur_min')}`
})

function onTimeChange(s, e) {
  // Ensure end is always after start (min 15 min gap)
  const toMin = t => { const [h,m] = t.split(':').map(Number); return h*60+m }
  const fromMin = t => { const h=Math.floor(t/60), m=t%60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}` }
  let sMin = toMin(s), eMin = toMin(e)
  if (eMin <= sMin) eMin = Math.min(sMin + 15, 23*60+45)
  localStart.value = s
  localEnd.value   = fromMin(eMin)
  emit('update-time', s, fromMin(eMin))
}
function onDragStart(e) {
  // Don't drag if clicking a button or input
  if (e.target.closest('button, input')) {
    e.preventDefault()
    return
  }
  emit('drag-start')
  setTimeout(() => e.target.classList.add('opacity-50', 'scale-95'), 0)
}
function onDragEnd(e) {
  e.target.classList.remove('opacity-50', 'scale-95')
}
</script>