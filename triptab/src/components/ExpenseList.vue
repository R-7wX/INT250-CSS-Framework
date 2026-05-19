<template>
  <section v-if="expenses.length > 0" class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <p class="section-label mb-0">{{ lang === 'th' ? 'รายจ่าย' : 'Expenses' }}</p>
        <span class="text-[11px] font-medium text-night-300 bg-night-600 border border-night-500 px-2 py-0.5 rounded-full">{{ expenses.length }}</span>
      </div>
      <!-- Filter by category -->
      <div class="flex gap-1 flex-wrap justify-end">
        <button class="filter-chip" :class="{ 'filter-active': !activeFilter }" @click="activeFilter = null">{{ lang === 'th' ? 'ทั้งหมด' : 'All' }}</button>
        <button v-for="cat in usedCategories" :key="cat.id"
                class="filter-chip" :class="{ 'filter-active': activeFilter === cat.id }"
                :style="activeFilter === cat.id ? { borderColor: cat.color, color: cat.color } : {}"
                @click="activeFilter = activeFilter === cat.id ? null : cat.id">
          <span v-html="cat.svg" :style="{ color: 'currentColor' }"></span>
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div v-for="exp in filtered" :key="exp.id" class="expense-row fade-in group">
        <!-- Category emoji + Avatar -->
        <div class="exp-cat-badge" v-html="getCat(exp.category)?.svg" :style="{ color: getCat(exp.category)?.color ?? '#94A3B8' }"></div>
        <div class="badge"
             :style="{ background: getParticipant(exp.paidBy)?.color + '28', color: getParticipant(exp.paidBy)?.color }">
          {{ initials(getParticipant(exp.paidBy)?.name ?? '') }}
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-night-50 truncate">{{ exp.description }}</p>
          <p class="text-xs text-night-300 mt-0.5">
            <span :style="{ color: getParticipant(exp.paidBy)?.color }">{{ getParticipant(exp.paidBy)?.name }}</span>
            paid · split {{ exp.splitAmong.length === participants.length ? lang === 'th' ? 'เท่ากัน' : 'evenly' : (lang === 'th' ? `หาร ${exp.splitAmong.length} คน` : `among ${exp.splitAmong.length}`) }}
            <span v-if="exp.currency && exp.currency !== baseCurrency" class="text-night-400"> · {{ exp.currency }}</span>
          </p>
        </div>

        <div class="text-right flex-shrink-0">
          <p class="text-base font-bold" :style="{ color: getCat(exp.category)?.color ?? '#F1F5F9' }">
            {{ exp.currency !== baseCurrency ? fmt(exp.amount, exp.currency) : fmt(exp.amount) }}
          </p>
          <p v-if="exp.currency && exp.currency !== baseCurrency" class="text-[10px] text-night-400">
            ≈ {{ fmt(exp.amountBase) }}
          </p>
          <button @click="removeExpense(exp.id)"
                  class="text-[11px] text-night-400 hover:text-rose-400 transition-colors mt-0.5 font-medium">
            remove
          </button>
        </div>
      </div>
    </div>

    <div v-if="filtered.length === 0" class="text-center text-night-400 text-sm py-4">
      {{ lang === 'th' ? 'ไม่มีรายจ่ายในหมวดนี้' : 'No expenses in this category' }}
    </div>

    <!-- Total row -->
    <div class="flex items-center justify-between mt-4 pt-3 border-t border-night-600">
      <span class="text-xs text-night-400 uppercase tracking-widest">{{ lang === 'th' ? 'รวม' : 'Total' }}</span>
      <span class="text-sm font-bold text-gradient-amber">{{ fmt(totalSpent) }}</span>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useExpenses, CATEGORIES } from '../composables/useExpenses.js'
import { lang } from '../composables/useExpenses.js'

const { participants, expenses, totalSpent, removeExpense, getParticipant, initials, fmt, baseCurrency } = useExpenses()

const activeFilter = ref(null)

const filtered = computed(() =>
  activeFilter.value
    ? expenses.value.filter(e => e.category === activeFilter.value)
    : expenses.value
)

const usedCategories = computed(() =>
  CATEGORIES.filter(c => expenses.value.some(e => e.category === c.id))
)

function getCat(id) {
  return CATEGORIES.find(c => c.id === id)
}
</script>
