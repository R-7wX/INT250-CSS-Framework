<template>
  <section class="card-accent">
    <div class="flex items-center gap-2.5 mb-4">
      <div class="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <p class="section-label mb-0">Add Expense</p>
    </div>

    <div v-if="participants.length < 2"
         class="flex flex-col items-center py-6 gap-2 text-night-300">
      <div class="w-12 h-12 rounded-2xl bg-night-600 border border-night-500 flex items-center justify-center mb-1">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2c-.5.1-.7.7-.4 1.1l1.4 1.4c.3.3.8.4 1.2.3L9 8l-4 4H3l-1 1 3 2 2 3 1-1v-2l4-4-.9 4.9c-.1.4 0 .9.3 1.2l1.4 1.4c.4.3 1 .1 1.1-.4z"/>
        </svg>
      </div>
      <p class="text-sm font-medium text-night-200">{{ lang === 'th' ? 'กรุณาเพิ่มนักเดินทางอย่างน้อย 2 คนก่อน' : 'Add at least 2 travelers first' }}</p>
    </div>

    <template v-else>
      <!-- Description + Amount + Currency row -->
      <div class="grid grid-cols-[1fr_90px_80px] gap-2 mb-3">
        <div>
          <label class="field-label">{{ lang === 'th' ? 'รายการ' : 'Description' }}</label>
          <input v-model="form.description" :placeholder="lang === 'th' ? 'โรงแรม, อาหาร, แท็กซี่…' : 'Hotel, Dinner, Taxi…'" />
        </div>
        <div>
          <label class="field-label">{{ lang === 'th' ? 'จำนวน' : 'Amount' }}</label>
          <input v-model.number="form.amount" type="number" min="0" step="0.01" placeholder="0.00" />
        </div>
        <div>
          <label class="field-label">{{ lang === 'th' ? 'สกุลเงิน' : 'Currency' }}</label>
          <select v-model="form.currency">
            <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">{{ c.code }}</option>
          </select>
        </div>
      </div>

      <!-- Currency conversion hint -->
      <div v-if="form.currency !== baseCurrency && form.amount > 0"
           class="cur-hint mb-3">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        {{ fmt(form.amount, form.currency) }} ≈ {{ fmtBase(form.amount, form.currency) }} {{ baseCurrency }}
      </div>

      <!-- Category -->
      <div class="mb-3">
        <label class="field-label">{{ lang === 'th' ? 'หมวดหมู่' : 'Category' }}</label>
        <div class="cat-picker">
          <button v-for="cat in CATEGORIES" :key="cat.id"
                  class="cat-chip"
                  :class="{ 'cat-chip-active': form.category === cat.id }"
                  :style="form.category === cat.id ? { borderColor: cat.color, background: cat.color + '20', color: cat.color } : {}"
                  @click="form.category = cat.id">
            <span v-html="cat.svg" :style="{ color: form.category === cat.id ? cat.color : 'currentColor' }"></span>
            <span class="cat-chip-label">{{ cat.labelTh ?? cat.label }}</span>
          </button>
        </div>
      </div>

      <!-- Paid by -->
      <div class="mb-3">
        <label class="field-label">{{ lang === 'th' ? 'จ่ายโดย' : 'Paid by' }}</label>
        <select v-model="form.paidBy">
          <option value="" disabled>{{ lang === 'th' ? 'เลือกผู้จ่าย…' : 'Select who paid…' }}</option>
          <option v-for="p in participants" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>

      <!-- Split among -->
      <div class="mb-5">
        <div class="flex items-center justify-between mb-2">
          <label class="field-label" style="margin-bottom:0">{{ lang === 'th' ? 'หารกับ' : 'Split among' }}</label>
          <div class="flex gap-1.5">
            <button class="btn-ghost-sm" @click="selectAll">{{ lang === 'th' ? 'ทั้งหมด' : 'All' }}</button>
            <button class="btn-ghost-sm" @click="selectNone">{{ lang === 'th' ? 'ล้าง' : 'None' }}</button>
          </div>
        </div>
        <div class="flex flex-wrap gap-1.5 mb-2.5">
          <div v-for="p in participants" :key="p.id"
               class="tag-toggle"
               :class="{ active: form.splitAmong.includes(p.id) }"
               @click="toggleSplit(p.id)">
            <span class="font-bold mr-1 text-[11px]"
                  :style="{ color: form.splitAmong.includes(p.id) ? p.color : '#64748B' }">{{ initials(p.name) }}</span>
            {{ p.name }}
          </div>
        </div>
        <div v-if="form.splitAmong.length > 0 && form.amount > 0"
             class="flex items-center gap-2 text-xs text-amber-400/80 bg-amber-500/8 border border-amber-500/15 rounded-lg px-3 py-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ fmtBase(form.amount / form.splitAmong.length, form.currency) }} per person · {{ form.splitAmong.length }} {{ form.splitAmong.length === 1 ? 'person' : 'people' }} {{ lang === 'th' ? 'คน' : '' }}
        </div>
      </div>

      <div v-if="error"
           class="flex items-center gap-2 text-sm text-rose-300 mb-3 px-3.5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ error }}
      </div>

      <button class="btn-primary w-full justify-center py-3 text-base" @click="handleSubmit">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        {{ lang === 'th' ? 'เพิ่มรายจ่าย' : 'Add Expense' }}
      </button>
    </template>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useExpenses, CATEGORIES, CURRENCIES } from '../composables/useExpenses.js'
import { lang } from '../composables/useExpenses.js'
import { useTrips } from '../composables/useExpenses.js'

const { participants, addExpense, initials, fmt, toBase, baseCurrency } = useExpenses()
const { } = useTrips()

const form = ref({
  description: '',
  amount: '',
  paidBy: '',
  splitAmong: [],
  category: 'food',
  currency: baseCurrency.value,
})

watch(baseCurrency, (cur) => { form.value.currency = cur })
watch(participants, (list) => {
  form.value.splitAmong = list.map(p => p.id)
}, { immediate: true })

const error = ref('')

function fmtBase(amount, currency) {
  return fmt(toBase(amount, currency))
}

function toggleSplit(id) {
  const idx = form.value.splitAmong.indexOf(id)
  if (idx >= 0) form.value.splitAmong.splice(idx, 1)
  else form.value.splitAmong.push(id)
}
function selectAll()  { form.value.splitAmong = participants.value.map(p => p.id) }
function selectNone() { form.value.splitAmong = [] }

function handleSubmit() {
  error.value = ''
  if (!form.value.description.trim())               { error.value = 'Please enter a description.'; return }
  if (!form.value.amount || form.value.amount <= 0)  { error.value = 'Please enter a valid amount.'; return }
  if (!form.value.paidBy)                            { error.value = 'Please select who paid.'; return }
  if (form.value.splitAmong.length === 0)            { error.value = 'Select at least one person to split with.'; return }
  addExpense({ ...form.value })
  form.value.description = ''
  form.value.amount = ''
}
</script>
