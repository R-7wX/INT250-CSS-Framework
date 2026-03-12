<template>
  <div class="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-700/60 rounded-xl px-1 py-0.5 select-none">

    <!-- Hour block -->
    <div class="flex flex-col items-center">
      <button @click.stop="adjustHour(1)" @mousedown.stop @touchstart.stop class="step-btn">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/></svg>
      </button>
      <input v-if="editingHour" ref="hourInputRef" type="number" min="0" :max="use12 ? 12 : 23" :value="displayHour"
        class="w-6 text-xs font-bold text-center bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100
               rounded border border-teal-400 outline-none leading-none py-0.5 [appearance:textfield]
               [&::-webkit-inner-spin-button]:appearance-none"
        @mousedown.stop @touchstart.stop
        @blur="commitHour" @keydown.enter.stop="commitHour" @keydown.escape.stop="editingHour = false"
      />
      <span v-else @click.stop="startEditHour" @mousedown.stop @touchstart.stop
        class="text-xs font-bold text-slate-700 dark:text-slate-200 w-6 text-center leading-none py-0.5 cursor-text hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
        {{ displayHour }}
      </span>
      <button @click.stop="adjustHour(-1)" @mousedown.stop @touchstart.stop class="step-btn">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
      </button>
    </div>

    <span class="text-xs font-bold text-slate-400 dark:text-slate-500">:</span>

    <!-- Minute block -->
    <div class="flex flex-col items-center">
      <button @click.stop="adjustMin(15)" @mousedown.stop @touchstart.stop class="step-btn">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/></svg>
      </button>
      <input v-if="editingMin" ref="minInputRef" type="number" min="0" max="59" :value="parseInt(mm)"
        class="w-6 text-xs font-bold text-center bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100
               rounded border border-teal-400 outline-none leading-none py-0.5 [appearance:textfield]
               [&::-webkit-inner-spin-button]:appearance-none"
        @mousedown.stop @touchstart.stop
        @blur="commitMin" @keydown.enter.stop="commitMin" @keydown.escape.stop="editingMin = false"
      />
      <span v-else @click.stop="startEditMin" @mousedown.stop @touchstart.stop
        class="text-xs font-bold text-slate-700 dark:text-slate-200 w-6 text-center leading-none py-0.5 cursor-text hover:text-teal-500 dark:hover:text-teal-400 transition-colors">
        {{ mm }}
      </span>
      <button @click.stop="adjustMin(-15)" @mousedown.stop @touchstart.stop class="step-btn">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
      </button>
    </div>

    <!-- AM/PM toggle (12h mode only) -->
    <div v-if="use12" class="flex flex-col items-center ml-0.5">
      <button @click.stop="toggleAmPm" @mousedown.stop @touchstart.stop
        class="step-btn text-[9px] font-bold px-0.5 h-auto py-1 leading-none">
        {{ isPm ? 'PM' : 'AM' }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  value: { type: String, default: '09:00' },
  use12: { type: Boolean, default: false },
})
const emit  = defineEmits(['change'])

const editingHour = ref(false)
const editingMin  = ref(false)
const hourInputRef = ref(null)
const minInputRef  = ref(null)

const hh = computed(() => props.value.split(':')[0])
const mm = computed(() => props.value.split(':')[1])

function toTotal() {
  const [h, m] = props.value.split(':').map(Number)
  return h * 60 + m
}
function fromTotal(t) {
  const total = ((t % 1440) + 1440) % 1440
  return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`
}

// 12h helpers
const isPm = computed(() => parseInt(hh.value) >= 12)
const displayHour = computed(() => {
  if (!props.use12) return hh.value
  const h = parseInt(hh.value)
  const h12 = h % 12 || 12
  return String(h12).padStart(2, '0')
})

function adjustHour(delta) { emit('change', fromTotal(toTotal() + delta * 60)) }
function adjustMin(delta)  { emit('change', fromTotal(toTotal() + delta)) }

function toggleAmPm() {
  const total = toTotal()
  emit('change', fromTotal(isPm.value ? total - 720 : total + 720))
}

// Hour edit
async function startEditHour() {
  editingHour.value = true
  await nextTick()
  hourInputRef.value?.select()
}
function commitHour() {
  const raw = parseInt(hourInputRef.value?.value ?? hh.value)
  let h = isNaN(raw) ? 0 : raw
  if (props.use12) {
    h = Math.min(12, Math.max(1, h))
    // keep same am/pm
    if (isPm.value && h !== 12) h += 12
    if (!isPm.value && h === 12) h = 0
  } else {
    h = Math.min(23, Math.max(0, h))
  }
  const m = parseInt(mm.value)
  emit('change', `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`)
  editingHour.value = false
}

// Minute edit
async function startEditMin() {
  editingMin.value = true
  await nextTick()
  minInputRef.value?.select()
}
function commitMin() {
  const raw = parseInt(minInputRef.value?.value ?? mm.value)
  const m = Math.min(59, Math.max(0, isNaN(raw) ? 0 : raw))
  const h = parseInt(hh.value)
  emit('change', `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`)
  editingMin.value = false
}
</script>

<style scoped>
.step-btn {
  @apply w-5 h-5 flex items-center justify-center rounded-lg
         text-slate-400 dark:text-slate-500
         hover:bg-white dark:hover:bg-slate-600
         hover:text-teal-500 dark:hover:text-teal-400
         active:scale-90 transition-all;
}
</style>