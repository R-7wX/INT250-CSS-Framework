<template>
  <div class="relative" ref="rootEl">

    <!-- Trigger button -->
    <button
      type="button"
      @click="toggle"
      class="flex items-center gap-2 px-3 py-1.5 rounded-2xl text-sm font-semibold border transition-all duration-150
             border-slate-200 dark:border-slate-700
             bg-white/70 dark:bg-slate-800/70
             text-slate-700 dark:text-slate-200
             hover:border-teal-400 dark:hover:border-teal-500
             focus:outline-none focus:ring-2 focus:ring-teal-400"
      :class="open ? 'ring-2 ring-teal-400 border-teal-400 dark:border-teal-500' : ''"
    >
      <!-- Calendar icon -->
      <svg class="w-4 h-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="3"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
      <span :class="modelValue ? '' : 'text-slate-400 dark:text-slate-500'">
        {{ displayValue }}
      </span>
      <!-- Clear button -->
      <span
        v-if="modelValue"
        @click.stop="clearDate"
        class="ml-1 flex items-center justify-center w-4 h-4 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
        :title="t('dp_clear')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-3 h-3">
          <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </span>
    </button>

    <!-- Popup -->
    <Transition name="dp-pop">
      <div
        v-if="open"
        class="absolute z-50 mt-2 rounded-2xl shadow-2xl border
               bg-white dark:bg-slate-900
               border-slate-200 dark:border-slate-700
               w-72 p-4 select-none"
        style="left: 0; top: 100%;"
      >
        <!-- Month/Year header -->
        <div class="flex items-center justify-between mb-3">
          <button @click="prevMonth" class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button @click="showYearPicker = !showYearPicker" class="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-100 text-sm hover:text-teal-500 dark:hover:text-teal-400 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            {{ monthName }} {{ viewYear }}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-3.5 h-3.5 transition-transform" :class="showYearPicker ? 'rotate-180':''">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <button @click="nextMonth" class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <!-- Year picker overlay -->
        <div v-if="showYearPicker" class="grid grid-cols-4 gap-1 mb-3 max-h-40 overflow-y-auto">
          <button
            v-for="y in yearRange"
            :key="y"
            @click="selectYear(y)"
            class="py-1.5 rounded-xl text-xs font-semibold transition-colors"
            :class="y === viewYear
              ? 'bg-teal-500 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'"
          >{{ y }}</button>
        </div>

        <!-- Day-of-week headers -->
        <div v-if="!showYearPicker" class="grid grid-cols-7 mb-1">
          <span
            v-for="d in dayHeaders"
            :key="d"
            class="text-center text-[11px] font-bold text-slate-400 dark:text-slate-500 py-1"
          >{{ d }}</span>
        </div>

        <!-- Calendar grid -->
        <div v-if="!showYearPicker" class="grid grid-cols-7 gap-y-0.5">
          <button
            v-for="cell in calendarCells"
            :key="cell.key"
            @click="cell.inMonth && selectDate(cell.date)"
            :disabled="!cell.inMonth"
            class="aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-100"
            :class="cellClass(cell)"
          >{{ cell.day }}</button>
        </div>

        <!-- Footer: Today button -->
        <div v-if="!showYearPicker" class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button
            @click="selectToday"
            class="text-xs font-semibold text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors px-2 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20"
          >{{ t('dp_today') }}</button>
          <button
            v-if="modelValue"
            @click="clearDate"
            class="text-xs font-semibold text-slate-400 hover:text-rose-400 dark:hover:text-rose-400 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20"
          >{{ t('dp_clear') }}</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const props = defineProps({
  modelValue: { type: String, default: '' }, // YYYY-MM-DD
})
const emit = defineEmits(['update:modelValue'])

const { t, lang } = useI18n()
const rootEl = ref(null)
const open = ref(false)
const showYearPicker = ref(false)

// View state
const today = new Date()
const viewYear  = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-based

// Sync view to modelValue when it changes
watch(() => props.modelValue, (v) => {
  if (v) {
    const [y, m] = v.split('-').map(Number)
    viewYear.value  = y
    viewMonth.value = m - 1
  }
}, { immediate: true })

// Month name from i18n
const MONTH_KEYS = ['dp_mon_jan','dp_mon_feb','dp_mon_mar','dp_mon_apr','dp_mon_may','dp_mon_jun','dp_mon_jul','dp_mon_aug','dp_mon_sep','dp_mon_oct','dp_mon_nov','dp_mon_dec']
const DAY_KEYS   = ['dp_day_su','dp_day_mo','dp_day_tu','dp_day_we','dp_day_th','dp_day_fr','dp_day_sa']

const monthName  = computed(() => t(MONTH_KEYS[viewMonth.value]))
const dayHeaders = computed(() => DAY_KEYS.map(k => t(k)))

// Year range: 5 years back to 5 years ahead
const yearRange = computed(() => {
  const base = today.getFullYear()
  const years = []
  for (let y = base - 2; y <= base + 8; y++) years.push(y)
  return years
})

// Calendar grid
const calendarCells = computed(() => {
  const year  = viewYear.value
  const month = viewMonth.value
  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const cells = []

  // Prev month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i
    cells.push({ key: `prev-${d}`, day: d, inMonth: false, date: null })
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    cells.push({ key: `cur-${d}`, day: d, inMonth: true, date })
  }
  // Next month padding to fill 6 rows max
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ key: `next-${d}`, day: d, inMonth: false, date: null })
  }
  return cells
})

// Display value in trigger button
const displayValue = computed(() => {
  if (!props.modelValue) return t('dp_placeholder')
  const [y, m, d] = props.modelValue.split('-').map(Number)
  const monthStr = t(MONTH_KEYS[m - 1])
  // Short month for compact display
  const short = monthStr.length > 7 ? monthStr.slice(0,3) + '.' : monthStr
  return `${d} ${short} ${y}`
})

// Cell class
function cellClass(cell) {
  if (!cell.inMonth) return 'text-slate-300 dark:text-slate-700 cursor-default'
  const isSelected = cell.date === props.modelValue
  const isToday    = cell.date === todayStr()
  if (isSelected) return 'bg-teal-500 text-white font-bold shadow-sm scale-105'
  if (isToday)    return 'text-teal-500 dark:text-teal-400 font-bold ring-2 ring-teal-400/50 dark:ring-teal-500/50 hover:bg-teal-50 dark:hover:bg-teal-900/20'
  return 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function selectDate(date) {
  emit('update:modelValue', date)
  open.value = false
  showYearPicker.value = false
}
function selectToday() { selectDate(todayStr()) }
function clearDate() {
  emit('update:modelValue', '')
  open.value = false
}
function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
  showYearPicker.value = false
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
  showYearPicker.value = false
}
function selectYear(y) {
  viewYear.value = y
  showYearPicker.value = false
}
function toggle() {
  open.value = !open.value
  if (!open.value) showYearPicker.value = false
}

// Close on outside click
function onClickOutside(e) {
  if (rootEl.value && !rootEl.value.contains(e.target)) {
    open.value = false
    showYearPicker.value = false
  }
}
onMounted(()  => document.addEventListener('mousedown', onClickOutside))
onUnmounted(()=> document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
.dp-pop-enter-active { transition: opacity 0.15s ease, transform 0.15s cubic-bezier(0.34,1.56,0.64,1); }
.dp-pop-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.dp-pop-enter-from  { opacity: 0; transform: translateY(-6px) scale(0.97); }
.dp-pop-leave-to    { opacity: 0; transform: translateY(-4px) scale(0.97); }
</style>