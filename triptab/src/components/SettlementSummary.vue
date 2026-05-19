<template>
  <section class="card-settlement">
    <!-- Header -->
    <div class="flex items-center gap-2.5 mb-4">
      <div class="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2.5">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <p class="section-label mb-0">Settlement</p>
    </div>

    <!-- Empty state -->
    <div v-if="participants.length < 2 || expenses.length === 0"
         class="flex flex-col items-center py-8 gap-2 text-night-300">
      <div class="w-12 h-12 rounded-2xl bg-night-600 border border-night-500 flex items-center justify-center mb-1">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2"/>
          <rect x="8" y="6" width="8" height="3" rx="0.5" fill="#34D399" stroke="none"/>
          <circle cx="8" cy="13" r="1" fill="#34D399" stroke="none"/>
          <circle cx="12" cy="13" r="1" fill="#34D399" stroke="none"/>
          <circle cx="16" cy="13" r="1" fill="#34D399" stroke="none"/>
          <circle cx="8" cy="17" r="1" fill="#34D399" stroke="none"/>
          <circle cx="12" cy="17" r="1" fill="#34D399" stroke="none"/>
          <circle cx="16" cy="17" r="1" fill="#34D399" stroke="none"/>
        </svg>
      </div>
      <p class="text-sm font-medium text-night-200">{{ lang === 'th' ? 'ยังไม่มีรายการ' : 'Nothing to settle yet' }}</p>
      <p class="text-xs text-night-300">{{ lang === 'th' ? 'เพิ่มรายจ่ายเพื่อดูการชำระ' : 'Add expenses to see who owes what' }}</p>
    </div>

    <template v-else>

      <!-- ── Net Balances ── -->
      <div class="mb-6">
        <p class="text-[10px] font-semibold text-night-300 uppercase tracking-widest mb-3">Net balances</p>
        <div class="flex flex-col gap-3">
          <div
            v-for="p in participants"
            :key="p.id"
            class="flex items-center gap-3"
          >
            <div class="badge-sm" :style="{ background: p.color + '28', color: p.color }">
              {{ initials(p.name) }}
            </div>
            <span class="text-sm text-night-100 flex-1 min-w-0 truncate">{{ p.name }}</span>

            <!-- Track + fill -->
            <div class="bar-track flex-shrink-0">
              <div
                class="h-full rounded-full transition-all duration-700"
                :style="{
                  width:       pct(p.id),
                  background:  getBalance(p.id) >= 0
                    ? 'linear-gradient(90deg, #34D399, #10B981)'
                    : 'linear-gradient(90deg, #F43F5E, #FB7185)',
                  marginLeft:  getBalance(p.id) < 0 ? 'auto' : '0',
                }"
              />
            </div>

            <span
              class="text-[13px] font-bold min-w-[70px] text-right flex-shrink-0"
              :class="getBalance(p.id) >= 0 ? 'text-emerald-400' : 'text-rose-400'"
            >
              {{ getBalance(p.id) >= 0 ? '+' : '' }}{{ fmt(getBalance(p.id)) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider" />

      <!-- ── Minimum Transactions ── -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <p class="text-[10px] font-semibold text-night-300 uppercase tracking-widest">Who pays whom</p>
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                :class="settlements.length === 0
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'bg-violet-500/15 text-violet-300 border border-violet-500/25'">
            {{ settlements.length === 0 ? (lang === 'th' ? 'เคลียร์หมดแล้ว ✓' : 'All settled ✓') : (lang === 'th' ? `${settlements.length} รายการ` : `${settlements.length} payment${settlements.length > 1 ? 's' : ''}`) }}
          </span>
        </div>

        <!-- All settled -->
        <div v-if="settlements.length === 0"
             class="flex items-center justify-center gap-2.5 py-4 bg-emerald-500/8 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-semibold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ lang === 'th' ? 'ทุกคนเคลียร์กันหมดแล้ว!' : 'Everyone is settled up!' }}
        </div>

        <!-- Settlement rows -->
        <div v-else class="flex flex-col gap-2">
          <div
            v-for="s in settlements"
            :key="s.from + '-' + s.to"
            class="settle-row fade-in"
          >
            <!-- From -->
            <div class="badge-sm"
                 :style="{ background: getParticipant(s.from)?.color + '28', color: getParticipant(s.from)?.color }">
              {{ initials(getParticipant(s.from)?.name ?? '') }}
            </div>
            <span class="font-semibold text-night-100 text-sm">{{ getParticipant(s.from)?.name }}</span>

            <!-- Arrow + amount -->
            <div class="flex-1 flex flex-col items-center">
              <span class="text-base font-black text-amber-400">{{ fmt(s.amount) }}</span>
              <div class="flex items-center gap-1 text-night-400">
                <div class="h-px w-6 bg-night-500" />
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </div>

            <!-- To -->
            <span class="font-semibold text-night-100 text-sm text-right">{{ getParticipant(s.to)?.name }}</span>
            <div class="badge-sm"
                 :style="{ background: getParticipant(s.to)?.color + '28', color: getParticipant(s.to)?.color }">
              {{ initials(getParticipant(s.to)?.name ?? '') }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { useExpenses } from '../composables/useExpenses.js'
import { lang } from '../composables/useExpenses.js'

const {
  participants, expenses, settlements, maxAbsBalance,
  getParticipant, getBalance, initials, fmt,
} = useExpenses()

function pct(id) {
  const abs = Math.abs(getBalance(id))
  return (abs / maxAbsBalance.value * 100).toFixed(1) + '%'
}
</script>
