<template>
  <div
    draggable="true"
    class="sb-card bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700
           cursor-grab active:cursor-grabbing hover:-translate-y-0.5 transition-all overflow-hidden select-none"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="flex items-center p-3 gap-3">
      <img :src="placeData?.img" class="w-12 h-12 rounded-xl object-cover shrink-0 pointer-events-none" loading="lazy" />
      <div class="flex-1 min-w-0 pointer-events-none">
        <h4 class="font-bold text-sm truncate text-slate-800 dark:text-slate-200">{{ displayName }}</h4>
        <p class="text-xs text-slate-500 truncate">{{ placeData?.vibe }}</p>
      </div>

      <!-- Mobile add btn (sidebar only) -->
      <button
        v-if="!inBoard"
        @click.stop="$emit('add-to-day')"
        class="w-8 h-8 flex shrink-0 items-center justify-center rounded-full
               bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400
               hover:bg-teal-200 transition-colors"
        title="Add to day"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
        </svg>
      </button>

      <!-- Return btn (board only) -->
      <button
        v-if="inBoard"
        @click.stop="$emit('return-card')"
        class="w-7 h-7 flex shrink-0 items-center justify-center rounded-full
               bg-slate-100 dark:bg-slate-700 text-slate-500
               hover:bg-rose-100 hover:text-rose-500 transition-colors"
        title="Return to sidebar"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
        </svg>
      </button>
    </div>

    <!-- Time row (board only) -->
    <div v-if="inBoard" class="px-3 pb-3 -mt-1">
      <div class="flex items-center gap-1.5 flex-wrap border-t border-slate-100 dark:border-slate-600/50 pt-2">
        <svg class="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        <input
          type="time"
          :value="start"
          class="time-input"
          @mousedown.stop
          @touchstart.stop
          @change="e => onTimeChange(e.target.value, localEnd)"
        />
        <span class="text-xs text-slate-400">–</span>
        <input
          type="time"
          :value="end"
          class="time-input"
          @mousedown.stop
          @touchstart.stop
          @change="e => onTimeChange(localStart, e.target.value)"
        />
        <span class="text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
          {{ duration }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAppStore } from '../stores/useAppStore.js'
import { useI18n } from '../composables/useI18n.js'
import { PLACES, PLACE_NAMES } from '../data/places.js'

const props = defineProps({
  name: String,
  inBoard: Boolean,
  start: { type: String, default: '09:00' },
  end:   { type: String, default: '11:00' },
})

const emit = defineEmits(['add-to-day', 'return-card', 'update-time', 'drag-start'])

const { t, lang } = useI18n()

const localStart = ref(props.start)
const localEnd   = ref(props.end)

watch(() => props.start, v => localStart.value = v)
watch(() => props.end,   v => localEnd.value = v)

const placeData = computed(() => PLACES.find(p => p.name === props.name))

const displayName = computed(() => {
  const row = PLACE_NAMES[props.name]
  if (!row) return props.name
  return row[lang.value] || row['en'] || props.name
})

const duration = computed(() => {
  const s = localStart.value, e = localEnd.value
  const [sh, sm] = s.split(':').map(Number), [eh, em] = e.split(':').map(Number)
  const d = (eh * 60 + em) - (sh * 60 + sm)
  if (d <= 0) return '—'
  const h = Math.floor(d / 60), m = d % 60
  return h > 0 ? (m > 0 ? `${h}${t('dur_hr')} ${m}${t('dur_min')}` : `${h}${t('dur_hr')}`) : `${m}${t('dur_min')}`
})

function onTimeChange(s, e) {
  localStart.value = s
  localEnd.value = e
  emit('update-time', s, e)
}

function onDragStart(e) {
  emit('drag-start')
  setTimeout(() => e.target.classList.add('opacity-50', 'scale-95'), 0)
}

function onDragEnd(e) {
  e.target.classList.remove('opacity-50', 'scale-95')
}
</script>