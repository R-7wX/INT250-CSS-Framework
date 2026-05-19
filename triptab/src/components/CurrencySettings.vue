<template>
  <section class="card" v-if="activeTrip">
    <div class="flex items-center gap-2.5 mb-4">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center"
           style="background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.25)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.5">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <p class="section-label mb-0">{{ lang === 'th' ? 'การตั้งค่าสกุลเงิน' : 'Currency Settings' }}</p>
    </div>

    <!-- Base currency -->
    <div class="cur-row mb-4">
      <span class="cur-label">{{ lang === 'th' ? 'สกุลเงินหลัก' : 'Base currency' }}</span>
      <span class="cur-badge" :style="{ background: '#38BDF820', color: '#38BDF8', border: '1px solid #38BDF830' }">
        {{ baseCurrency }}
      </span>
    </div>

    <!-- Rate editor -->
    <p class="text-[10px] font-semibold text-night-300 uppercase tracking-widest mb-2">Exchange rates → {{ baseCurrency }}</p>
    <div class="cur-rates">
      <div v-for="cur in otherCurrencies" :key="cur.code" class="cur-rate-row">
        <span class="cur-code" :style="{ color: '#38BDF8' }">{{ cur.code }}</span>
        <span class="cur-name">{{ cur.name }}</span>
        <div class="cur-input-wrap">
          <span class="cur-sym">{{ baseSym }}</span>
          <input
            type="number"
            step="0.001"
            min="0"
            class="cur-input"
            :value="getRate(cur.code).toFixed(cur.code === 'KRW' || cur.code === 'JPY' ? 3 : 3)"
            @change="e => updateRate(cur.code, e.target.value)"
          />
        </div>
      </div>
    </div>

    <p class="text-[10px] text-night-400 mt-3">{{ lang === 'th' ? 'อัตราแลกเปลี่ยนสำหรับแปลงค่าใช้จ่ายทั้งหมดเป็น' : 'Rates convert all expenses to' }} {{ baseCurrency }} {{ lang === 'th' ? 'เพื่อคำนวณการชำระที่ยุติธรรม' : 'for fair settlement calculation.' }}</p>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useTrips }   from '../composables/useExpenses.js'
import { lang } from '../composables/useExpenses.js'
import { CURRENCIES } from '../composables/useExpenses.js'

const { activeTrip, baseCurrency, getRate, updateRate } = useTrips()

const baseSym = computed(() => CURRENCIES.find(c => c.code === baseCurrency.value)?.symbol ?? baseCurrency.value)
const otherCurrencies = computed(() => CURRENCIES.filter(c => c.code !== baseCurrency.value))
</script>
