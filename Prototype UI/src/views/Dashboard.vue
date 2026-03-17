<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">{{ t('db_title') }}</h1>

    <!-- Country selector + hero -->
    <div class="relative rounded-3xl overflow-hidden mb-6 shadow-lg">
      <div class="relative w-full h-48 sm:h-60">
        <Transition name="img-fade">
          <img :key="current.img" :src="current.img" class="absolute inset-0 w-full h-full object-cover" />
        </Transition>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div class="text-2xl font-extrabold">{{ current.icon }} {{ currentI18n?.name || current.name }}</div>
            <div class="flex items-center gap-2 text-sm text-white/70 mt-0.5 min-h-[1.4rem]">
              <template v-if="weatherLoading">
                <span class="inline-block w-20 h-4 bg-white/20 rounded-full animate-pulse"></span>
              </template>
              <template v-else-if="weatherData">
                <span class="font-bold text-white/90">{{ weatherData.temp }}°C {{ weatherData.emoji }}</span>
                <span>·</span>
                <span>{{ weatherData.desc }}</span>
              </template>
              <template v-else-if="weatherError">
                <button
                  @click="fetchWeather"
                  class="flex items-center gap-1.5 text-amber-300/90 hover:text-amber-200 transition-colors text-xs font-medium"
                  :title="t('db_weather_err')"
                >
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  </svg>
                  <span>{{ t('db_weather_err') }}</span>
                </button>
              </template>
              <template v-else>
                <span>{{ current.temp }} · {{ currentI18n?.desc || current.desc }}</span>
              </template>
            </div>
          </div>
          <!-- Country dropdown — bottom-right -->
          <div class="relative">
            <button
              ref="countryBtnRef"
              @click.stop="toggleCountryDrop"
              class="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[140px] justify-between"
            >
              <span>{{ current.badge }}</span>
              <svg class="w-4 h-4 opacity-70 transition-transform" :class="countryDropOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <Teleport to="body">
              <Transition name="drop-fade">
                <div
                  v-if="countryDropOpen"
                  :style="countryDropStyle"
                  class="fixed w-52 max-h-72 overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 z-[9999] py-1"
                >
                  <button
                    v-for="(_, k) in countryData" :key="k"
                    @click.stop="selectedKey = k; countryDropOpen = false"
                    class="w-full text-left px-3 py-2 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 text-slate-800 dark:text-slate-200 transition-colors"
                    :class="selectedKey === k ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold' : ''"
                  >{{ countryData[k].badge }}</button>
                </div>
              </Transition>
            </Teleport>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- Local Time card -->
      <div class="glass-panel rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm">
        <h2 class="font-bold text-base mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <svg class="w-5 h-5 text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          {{ t('db_local_time') }}
        </h2>
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="text-4xl font-extrabold tabular-nums tracking-tight text-slate-800 dark:text-slate-100">
              {{ localTime }}
            </div>
            <div class="mt-1 text-xs text-slate-400 dark:text-slate-500">{{ localDate }}</div>
          </div>
          <div class="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 64 64" class="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" class="text-slate-200 dark:text-slate-700" stroke-width="4"/>
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" class="text-teal-500" stroke-width="4"
                :stroke-dasharray="`${clockSecFrac * 175.93} 175.93`" stroke-linecap="round"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-teal-500 dark:text-teal-400">
              {{ localSeconds }}s
            </div>
          </div>
        </div>
        <div class="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>{{ currentI18n?.name || current.name }}</span>
          <span class="text-slate-300 dark:text-slate-600">·</span>
          <span>{{ localTZ }}</span>
        </div>
      </div>

      <!-- Exchange Rate card -->
      <div class="glass-panel rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm">
        <h2 class="font-bold text-base mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <!-- Currency exchange icon -->
          <svg class="w-5 h-5 text-teal-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
            <path d="M8 12h8M14 9l3 3-3 3"/>
            <path d="M16 12H8M10 15l-3-3 3-3"/>
          </svg>
          {{ t('db_exchange') }}
        </h2>
        <div class="flex gap-2 mb-3">
          <input
            v-model.number="rateAmount"
            type="number" min="1"
            class="w-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <span class="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300">{{ current.currency }}</span>
          <span class="py-2 text-slate-400 text-sm">→</span>
          <div class="relative flex-1">
            <button
              ref="currencyBtnRef"
              @click.stop="toggleCurrencyDrop"
              class="w-full flex items-center justify-between gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <span>{{ targetCurrency }}</span>
              <svg class="w-4 h-4 opacity-50 transition-transform shrink-0" :class="currencyDropOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <Teleport to="body">
              <Transition name="drop-fade">
                <div
                  v-if="currencyDropOpen"
                  :style="currencyDropStyle"
                  class="fixed w-36 max-h-64 overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 z-[9999] py-1"
                >
                  <button
                    v-for="cur in currencies" :key="cur"
                    @click.stop="targetCurrency = cur; currencyDropOpen = false"
                    class="w-full text-left px-3 py-2 text-sm font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 text-slate-800 dark:text-slate-200 transition-colors"
                    :class="targetCurrency === cur ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold' : ''"
                  >{{ cur }}</button>
                </div>
              </Transition>
            </Teleport>
          </div>
        </div>

        <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-4 mb-2">
          <div v-if="rateLoading" class="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse w-32"></div>
          <div v-else-if="rateError" class="text-rose-500 text-sm">{{ t('db_rate_error') }}</div>
          <div v-else class="text-3xl font-extrabold text-teal-700 dark:text-teal-300">
            {{ fmt(rateResult) }} <span class="text-xl text-slate-500 dark:text-slate-400 font-medium">{{ targetCurrency }}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs text-slate-400">{{ rateAmount }} {{ current.currency }} =</span>
            <span v-if="isOfflineRate && !rateLoading" class="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
              <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              {{ t('db_rate_offline') }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button @click="fetchRate" class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-200 transition-colors">
            <svg class="w-3.5 h-3.5" :class="rateLoading && 'animate-spin'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ t('db_refresh') }}
          </button>
          <span class="text-xs text-slate-400">{{ rateUpdated }}</span>
        </div>
      </div>

      <!-- Trip Summary -->
      <div class="glass-panel rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm md:col-span-2">
        <h2 class="font-bold text-base mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <!-- Map/compass icon -->
          <svg class="w-5 h-5 text-teal-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 7 9 4 15 7 21 4 21 17 15 20 9 17 3 20"/>
            <line x1="9" y1="4" x2="9" y2="17"/>
            <line x1="15" y1="7" x2="15" y2="20"/>
          </svg>
          {{ t('db_trip_summary') }}
        </h2>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3">
            <div class="text-xs text-slate-400">{{ t('db_rec_days') }}</div>
            <div class="font-extrabold text-lg text-teal-600 dark:text-teal-400">{{ currentI18n?.season || current.season }}</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3">
            <div class="text-xs text-slate-400">{{ t('db_budget') }}</div>
            <div class="font-extrabold text-lg text-teal-600 dark:text-teal-400">{{ calcCurrSign }}{{ fmtBudgetRange(current.budgetLow, current.budgetHigh) }}</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3">
            <div class="text-xs text-slate-400">{{ t('db_lang_label') }}</div>
            <div class="font-bold text-sm text-slate-700 dark:text-slate-300">{{ currentI18n?.lang || current.lang }}</div>
          </div>
          <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3 col-span-2">
            <div class="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              {{ t('db_flight') }}
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <div class="relative flex-1 min-w-[140px]">
                <button
                  ref="flightBtnRef"
                  @click.stop="toggleFlightDrop"
                  class="w-full flex items-center justify-between gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <span>{{ flightOriginLabel }}</span>
                  <svg class="w-3.5 h-3.5 opacity-60 transition-transform shrink-0" :class="flightDropOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <Teleport to="body">
                  <Transition name="drop-fade">
                    <div
                      v-if="flightDropOpen"
                      :style="flightDropStyle"
                      class="fixed w-52 max-h-64 overflow-y-auto rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 z-[9999] py-1"
                    >
                      <button
                        v-for="o in FLIGHT_OPTIONS" :key="o.value"
                        @click.stop="flightOrigin = o.value; flightDropOpen = false"
                        class="w-full text-left px-3 py-2 text-xs font-medium hover:bg-teal-50 dark:hover:bg-teal-900/30 text-slate-800 dark:text-slate-200 transition-colors"
                        :class="flightOrigin === o.value ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-semibold' : ''"
                      >{{ o.label }}</button>
                    </div>
                  </Transition>
                </Teleport>
              </div>
              <span class="text-slate-400 text-xs">→</span>
              <span class="font-extrabold text-sm text-teal-600 dark:text-teal-400">{{ flightTime }}</span>
            </div>
          </div>
        </div>
        <div class="text-xs text-slate-400 mb-1 font-semibold flex items-center gap-1.5">
          <!-- Star icon -->
          <svg class="w-3.5 h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {{ t('db_highlights') }}
        </div>
        <div class="grid grid-cols-2 gap-x-4 gap-y-0.5">
          <div
            v-for="(h, i) in (currentI18n?.highlights || current.highlights)"
            :key="h"
            class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
          >
            <span class="text-teal-500 mt-0.5 shrink-0">•</span> {{ h }}
          </div>
        </div>
      </div>

      <!-- Cost Calculator -->
      <div class="glass-panel rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm md:col-span-2">
        <h2 class="font-bold text-base mb-4 text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <!-- Calculator icon -->
          <svg class="w-5 h-5 text-teal-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="8" y1="10" x2="8" y2="10" stroke-width="3"/><line x1="12" y1="10" x2="12" y2="10" stroke-width="3"/><line x1="16" y1="10" x2="16" y2="10" stroke-width="3"/>
            <line x1="8" y1="14" x2="8" y2="14" stroke-width="3"/><line x1="12" y1="14" x2="12" y2="14" stroke-width="3"/><line x1="16" y1="14" x2="16" y2="14" stroke-width="3"/>
            <line x1="8" y1="18" x2="8" y2="18" stroke-width="3"/><line x1="12" y1="18" x2="12" y2="18" stroke-width="3"/><line x1="16" y1="18" x2="16" y2="18" stroke-width="3"/>
          </svg>
          {{ t('db_calc_title') }}
        </h2>
        <div class="flex flex-wrap gap-6 items-start">
          <!-- People -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-400 font-semibold">{{ t('db_people') }}</label>
            <div class="flex items-center gap-2">
              <button @click="adjustPeople(-1)" class="counter-btn">−</button>
              <span class="w-8 text-center font-extrabold text-lg text-teal-600 dark:text-teal-400">{{ people }}</span>
              <button @click="adjustPeople(1)" class="counter-btn">+</button>
            </div>
          </div>
          <!-- Days -->
          <div class="flex flex-col gap-1">
            <label class="text-xs text-slate-400 font-semibold">{{ t('db_days') }}</label>
            <div class="flex items-center gap-2">
              <button @click="adjustDays(-1)" class="counter-btn">−</button>
              <span class="w-8 text-center font-extrabold text-lg text-teal-600 dark:text-teal-400">{{ calcDays }}</span>
              <button @click="adjustDays(1)" class="counter-btn">+</button>
            </div>
          </div>
          <!-- Result -->
          <div class="flex-1 min-w-[200px] bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/40 rounded-2xl p-4">
            <div class="text-xs text-teal-600 dark:text-teal-400 font-semibold mb-1">{{ t('db_est_cost') }}</div>
            <div class="text-2xl font-extrabold text-teal-700 dark:text-teal-300">{{ calcResult }}</div>
            <div class="text-xs text-slate-400 mt-1">{{ people }} {{ t('db_people') }} × {{ calcDays }} {{ t('db_days') }}</div>
          </div>
        </div>

        <!-- Breakdown -->
        <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div v-for="item in costBreakdown" :key="item.key" class="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-100 dark:border-slate-700 text-center">
            <svg class="w-5 h-5 mx-auto mb-1.5 text-teal-500 dark:text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" v-html="item.icon"></svg>
            <div class="text-sm font-semibold text-slate-700 dark:text-slate-300">{{ t(item.key) }}</div>
            <div class="text-xs text-teal-600 dark:text-teal-400 font-bold mt-0.5">{{ item.amount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

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
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { DB_COUNTRIES } from '../data/countries.js'

const { t, lang } = useI18n()

// ─── Country data (dashboard-specific with budget tiers) ─────────────────────
const countryData = {
  Japan:       { lat:35.6762,  lon:139.6503, name:'โตเกียว, ญี่ปุ่น',     temp:'15°C ⛅', desc:'อากาศเย็นสบาย', img:'https://images.unsplash.com/photo-1741851374582-79f4ac123442?q=90&w=1000&auto=format&fit=crop', currency:'JPY', rateUnit:100, rateLabel:'100 JPY', badge:'🇯🇵 Japan', days:'7',  budget:'35k–70k',    budgetLow:35000,  budgetHigh:70000,  lang:'Japanese',   season:'Mar–May', visa:'✅ Visa-free 30d', flight:'~7 hrs',   icon:'⛩️',  highlights:['Cherry blossoms at Ueno','Shibuya Crossing','Ramen','Tokyo Skytree','Senso-ji Temple','Akihabara electronics','Tsukiji fish market','Mt. Fuji day trip','Onsen in Hakone','Osaka street food','Arashiyama bamboo grove','Nara deer park','Hiroshima Peace Memorial','Shinkansen bullet train','Teamlab digital art'] },
  France:      { lat:48.8566,  lon:2.3522,   name:'ปารีส, ฝรั่งเศส',      temp:'12°C 🌥️', desc:'มีเมฆ โรแมนติก',  img:'https://images.unsplash.com/photo-1553455427-c38fa28dc586?q=90&w=1000&auto=format&fit=crop', currency:'EUR', rateUnit:1,   rateLabel:'1 EUR',   badge:'🇫🇷 France', days:'6',  budget:'60k–120k',   budgetLow:60000,  budgetHigh:120000, lang:'French',     season:'Apr–Jun', visa:'🛂 Schengen', flight:'~11 hrs',  icon:'🗼',  highlights:['Eiffel Tower at night','Seine river cruise','The Louvre','Croissant','Versailles gardens','Montmartre street art','Nice Riviera beach','Bordeaux wine tasting','Mont Saint-Michel','Sainte-Chapelle glass','Musée d\'Orsay','Lyon gastronomy','Pont du Gard aqueduct','Dordogne châteaux','Alsace wine route'] },
  Thailand:    { lat:13.7563,  lon:100.5018, name:'กรุงเทพฯ, ไทย',        temp:'33°C ☀️', desc:'ร้อน แดดแรง',      img:'https://images.unsplash.com/photo-1673449239841-06fb264eef2b?q=90&w=1000&auto=format&fit=crop', currency:'THB', rateUnit:1,   rateLabel:'1 THB',   badge:'🇹🇭 Thailand', days:'5', budget:'8k–20k',     budgetLow:8000,   budgetHigh:20000,  lang:'Thai',       season:'Nov–Feb', visa:'✅ No visa',   flight:'Domestic', icon:'🛕',  highlights:['Wat Phra Kaew','Mango sticky rice','Chatuchak Market','Chao Phraya boat','Floating market','Elephant sanctuary','Phi Phi Islands','Grand Palace tour','Yaowarat street food','Muay Thai match','Chiang Mai night bazaar','Krabi rock climbing','Pai valley road trip','Koh Lanta beach','Ayutthaya ruins'] },
  SouthKorea:  { lat:37.5665,  lon:126.9780, name:'โซล, เกาหลีใต้',       temp:'8°C 🌬️',  desc:'ลมแรง หนาว',      img:'https://images.unsplash.com/photo-1546874177-9e664107314e?q=90&w=1000&auto=format&fit=crop', currency:'KRW', rateUnit:1000,rateLabel:'1,000 KRW',badge:'🇰🇷 South Korea', days:'6',budget:'30k–60k',   budgetLow:30000,  budgetHigh:60000,  lang:'Korean',     season:'Mar–May', visa:'✅ Visa-free 30d', flight:'~5.5 hrs', icon:'🏯',  highlights:['Itaewon','Gyeongbokgung Palace','K-BBQ','Myeongdong','Han River picnic','Namsan Seoul Tower','Insadong tea street','Jeju Island','Busan beach','BTS statue photo','Demilitarized Zone tour','Jeonju hanok village','Seoraksan hiking','Andong mask festival','Lotte World theme park'] },
  USA:         { lat:40.7128,  lon:-74.0060, name:'นิวยอร์ก, USA',         temp:'18°C 🌤️', desc:'อากาศดี',          img:'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?q=90&w=1000&auto=format&fit=crop', currency:'USD', rateUnit:1,   rateLabel:'1 USD',   badge:'🇺🇸 USA',    days:'10', budget:'80k–180k',   budgetLow:80000,  budgetHigh:180000, lang:'English',    season:'Apr–Jun', visa:'🛂 US Visa',   flight:'~17 hrs',  icon:'🗽',  highlights:['Central Park','Times Square','Brooklyn Bridge','NY Pizza','Statue of Liberty','High Line Park','Grand Canyon','Hollywood Walk of Fame','Golden Gate Bridge','Niagara Falls','New Orleans jazz','Chicago deep dish','Las Vegas Strip','Yellowstone geysers','Miami Art Deco'] },
  UK:          { lat:51.5074,  lon:-0.1278,  name:'ลอนดอน, UK',            temp:'10°C 🌧️', desc:'มีฝน พกร่ม',      img:'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?q=90&w=1000&auto=format&fit=crop', currency:'GBP', rateUnit:1,   rateLabel:'1 GBP',   badge:'🇬🇧 UK',     days:'7',  budget:'70k–150k',   budgetLow:70000,  budgetHigh:150000, lang:'English',    season:'Jun–Aug', visa:'🛂 UK Visa',   flight:'~12 hrs',  icon:'🎡',  highlights:['Buckingham Palace','Tate Modern','The Tube','Fish and chips','Tower of London','Harry Potter studio','Edinburgh Castle','Cotswolds village','Stonehenge day trip','Camden Market','Oxford University tour','Lake District hike','Bath Roman spa','Glastonbury countryside','Scottish Highlands'] },
  Italy:       { lat:41.9028,  lon:12.4964,  name:'โรม, อิตาลี',           temp:'22°C ☀️', desc:'ท้องฟ้าโปร่ง',    img:'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?q=90&w=1000&auto=format&fit=crop', currency:'EUR', rateUnit:1,   rateLabel:'1 EUR',   badge:'🇮🇹 Italy',  days:'8',  budget:'55k–110k',   budgetLow:55000,  budgetHigh:110000, lang:'Italian',    season:'Apr–Jun', visa:'🛂 Schengen', flight:'~11 hrs',  icon:'🏛️', highlights:['The Colosseum','Gelato','Trevi Fountain','St. Peter\'s','Venice gondola','Florence Uffizi','Amalfi Coast drive','Pizza in Naples','Cinque Terre hike','Vatican Museums','Pompeii ruins','Lake Como villa','Siena Palio square','Trulli of Alberobello','Sicilian arancino'] },
  Switzerland: { lat:47.3769,  lon:8.5417,   name:'ซูริค, Switzerland',    temp:'5°C 🌨️',  desc:'หนาวจัด หิมะ',    img:'https://images.unsplash.com/photo-1657137436880-e906b111b040?q=90&w=1000&auto=format&fit=crop', currency:'CHF', rateUnit:1,   rateLabel:'1 CHF',   badge:'🇨🇭 Switzerland', days:'6',budget:'90k–200k',  budgetLow:90000,  budgetHigh:200000, lang:'German/French',season:'Jun–Aug', visa:'🛂 Schengen', flight:'~11.5 hrs',icon:'🏔️', highlights:['Interlaken ski','Jungfraujoch','Fondue','Lake Geneva','Matterhorn view','Lucerne chapel bridge','Rhine Falls','Zermatt cable car','Swiss chocolate factory','Bern old town','Lausanne Olympic Museum','Grindelwald glacier','Appenzell countryside','St. Moritz resort','Geneva jet d\'eau'] },
  Taiwan:      { lat:25.0330,  lon:121.5654, name:'ไทเป, Taiwan',           temp:'25°C ⛅', desc:'อากาศอบอุ่น',     img:'https://images.unsplash.com/photo-1598935898639-81586f7d2129?q=90&w=1000&auto=format&fit=crop', currency:'TWD', rateUnit:100, rateLabel:'100 TWD', badge:'🇹🇼 Taiwan',  days:'5',  budget:'20k–45k',    budgetLow:20000,  budgetHigh:45000,  lang:'Mandarin',   season:'Oct–Dec', visa:'✅ Visa-free 30d', flight:'~3.5 hrs', icon:'🏮',  highlights:['Shilin Night Market','Taipei 101','Stinky tofu','Cycling','Jiufen village','Sun Moon Lake','Taroko Gorge','Din Tai Fung dumplings','Tainan temples','Beitou hot spring','Yehliu geopark','Kenting surf beach','Alishan forest train','Lantern Festival','Wulai aboriginal village'] },
  Singapore:   { lat:1.3521,   lon:103.8198, name:'สิงคโปร์',               temp:'30°C 🌦️', desc:'ร้อนชื้น',        img:'https://images.unsplash.com/photo-1582511951111-56f95f789d79?q=90&w=1000&auto=format&fit=crop', currency:'SGD', rateUnit:1,   rateLabel:'1 SGD',   badge:'🇸🇬 Singapore', days:'4',budget:'30k–70k',   budgetLow:30000,  budgetHigh:70000,  lang:'English/Chinese',season:'Year-round',visa:'✅ Visa-free 30d', flight:'~2.5 hrs', icon:'🦁',  highlights:['Gardens by the Bay','Chinatown','Chilli crab','Marina Bay Sands','Hawker centre feast','Universal Studios','Sentosa island','Little India','Clarke Quay nightlife','Night Safari','Haw Par Villa','Arab Street','Jewel Changi waterfall','Botanic Gardens','Southern Ridges walk'] },
  Vietnam:     { lat:16.0544,  lon:108.2022, name:'ดานัง, Vietnam',         temp:'28°C ⛅', desc:'ลมทะเลเย็น',      img:'https://images.unsplash.com/photo-1722526933541-9a9cdfcdb28f?q=90&w=1000&auto=format&fit=crop', currency:'VND', rateUnit:10000,rateLabel:'10,000 VND',badge:'🇻🇳 Vietnam', days:'6', budget:'15k–35k',    budgetLow:15000,  budgetHigh:35000,  lang:'Vietnamese', season:'Jan–Apr', visa:'✅ Visa-free 45d', flight:'~2 hrs',   icon:'🏖️', highlights:['Ha Long Bay','Hoi An','Pho','Motorbike ride','Hanoi Old Quarter','Mekong Delta boat','Sapa rice terraces','Banh mi breakfast','War Remnants Museum','Cu Chi tunnels','Hue Imperial City','Da Nang beach','Ninh Binh limestone','Bun cha lunch','Egg coffee in Hanoi'] },
  Maldives:    { lat:4.1755,   lon:73.5093,  name:'มาเล่, Maldives',        temp:'29°C 🏝️', desc:'แดดแรง ทะเลใส',  img:'https://images.unsplash.com/photo-1676082896999-9c7288fdb7f1?q=90&w=1000&auto=format&fit=crop', currency:'MVR', rateUnit:10,  rateLabel:'10 MVR',  badge:'🇲🇻 Maldives', days:'5',budget:'80k–200k',   budgetLow:80000,  budgetHigh:200000, lang:'Dhivehi/English',season:'Nov–Apr',visa:'✅ Visa on Arrival', flight:'~3 hrs',  icon:'🐠',  highlights:['Overwater bungalow','Whale shark snorkel','Bioluminescent beach','Dhoni cruise','Sunset dolphin watch','Coral reef snorkeling','Island hopping','Local island visit','Manta ray diving','Beach bonfire night','Underwater restaurant','Sandbank picnic','Fishing with locals','Seaplane transfer view','Spa on water deck'] },
  Australia:   { lat:-33.8688, lon:151.2093, name:'ซิดนีย์, Australia',    temp:'24°C ☀️', desc:'อากาศแจ่มใส',     img:'https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?q=90&w=1000&auto=format&fit=crop', currency:'AUD', rateUnit:1,   rateLabel:'1 AUD',   badge:'🇦🇺 Australia', days:'10',budget:'60k–130k',  budgetLow:60000,  budgetHigh:130000, lang:'English',    season:'Sep–Nov', visa:'🛂 ETA',       flight:'~9.5 hrs', icon:'🦘',  highlights:['Sydney Opera House','Bondi Beach','Blue Mountains','Kangaroos','Great Barrier Reef','Melbourne laneways','Uluru sunrise','Great Ocean Road','Daintree Rainforest','Sydney Harbour cruise','Kakadu National Park','Fraser Island 4WD','Barossa Valley wine','Tasmanian wilderness','Whitsunday sailing'] },
  UAE:         { lat:25.2048,  lon:55.2708,  name:'ดูไบ, UAE',              temp:'35°C 🏜️', desc:'ร้อนแห้ง',        img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=90&w=1000&auto=format&fit=crop', currency:'AED', rateUnit:10,  rateLabel:'10 AED',  badge:'🇦🇪 UAE',    days:'5',  budget:'50k–120k',   budgetLow:50000,  budgetHigh:120000, lang:'Arabic/English',season:'Nov–Apr',visa:'✅ Visa on Arrival', flight:'~6.5 hrs', icon:'🏙️', highlights:['Burj Khalifa','Dubai Mall','Dune bashing','Dubai Fountain','Abra boat in Deira','Gold Souk shopping','Abu Dhabi mosque','Desert glamping','Sky Views Observatory','Old Dubai heritage walk','Louvre Abu Dhabi','Yas Island F1 circuit','Hatta mountain escape','Palm Jumeirah brunch','Dubai Frame landmark'] },
  China:       { lat:39.9042,  lon:116.4074, name:'ปักกิ่ง, จีน',           temp:'10°C 🌤️', desc:'อากาศดี แห้ง',    img:'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=90&w=1000&auto=format&fit=crop', currency:'CNY', rateUnit:10,  rateLabel:'10 CNY',  badge:'🇨🇳 China',  days:'8',  budget:'25k–60k',    budgetLow:25000,  budgetHigh:60000,  lang:'Mandarin',   season:'Apr–Jun', visa:'🛂 China Visa', flight:'~4.5 hrs', icon:'🏯',  highlights:['Great Wall of China','Forbidden City','Peking Duck','Hutong walk','Temple of Heaven','Summer Palace','Terracotta Army Xi\'an','Li River cruise','Panda base Chengdu','Zhangjiajie park','Shanghai Bund promenade','Guilin karst scenery','West Lake Hangzhou','Chengdu hotpot dinner','Leshan Giant Buddha'] },
  Germany:     { lat:52.5200,  lon:13.4050,  name:'เบอร์ลิน, เยอรมนี',      temp:'8°C 🌥️',  desc:'เย็น มีเมฆ',      img:'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?q=90&w=1000&auto=format&fit=crop', currency:'EUR', rateUnit:1,   rateLabel:'1 EUR',   badge:'🇩🇪 Germany', days:'7', budget:'50k–110k',   budgetLow:50000,  budgetHigh:110000, lang:'German',     season:'Jun–Aug', visa:'🛂 Schengen', flight:'~11 hrs',  icon:'🍺',  highlights:['Brandenburg Gate','Black Forest','Bavarian castles','Oktoberfest','Berlin Wall','Cologne Cathedral','Neuschwanstein Castle','Hamburg harbour','Rhine Valley cruise','Dresden Zwinger','Munich Hofbräuhaus','Romantic Road drive','Heidelberg old town','Berlin street art','Nuremberg Christmas market'] },
  India:       { lat:19.0760,  lon:72.8777,  name:'มุมไบ, อินเดีย',          temp:'32°C ☀️', desc:'ร้อนชื้น',         img:'https://images.unsplash.com/photo-1660145416818-b9a2b1a1f193?q=90&w=1000&auto=format&fit=crop', currency:'INR', rateUnit:100, rateLabel:'100 INR', badge:'🇮🇳 India',  days:'9',  budget:'15k–40k',    budgetLow:15000,  budgetHigh:40000,  lang:'Hindi/English',season:'Oct–Mar',visa:'✅ eVisa',      flight:'~3.5 hrs', icon:'🕌',  highlights:['Taj Mahal','Jaipur Pink City','Goa beaches','Street food tour','Varanasi ghats sunrise','Kerala backwaters','Amber Fort','Mumbai Dharavi tour','Darjeeling tea garden','Hampi ruins','Udaipur lake palace','Rishikesh yoga retreat','Ranthambore tiger safari','Mysore palace','Amritsar Golden Temple'] },
  Indonesia:   { lat:-8.3405,  lon:115.0920, name:'บาหลี, อินโดนีเซีย',     temp:'30°C 🌦️', desc:'ร้อนชื้น ฝนบาง',  img:'https://images.unsplash.com/photo-1639044859961-b8171c166c1e?q=90&w=1000&auto=format&fit=crop', currency:'IDR', rateUnit:10000,rateLabel:'10,000 IDR',badge:'🇮🇩 Indonesia', days:'7',budget:'15k–40k',   budgetLow:15000,  budgetHigh:40000,  lang:'Indonesian', season:'Apr–Oct', visa:'✅ Visa-free 30d', flight:'~3 hrs',   icon:'🌺',  highlights:['Ubud rice terraces','Tanah Lot','Komodo Island','Seminyak beach','Borobudur temple','Bromo volcano sunrise','Gili Islands snorkel','Tegalalang swing','Kecak fire dance','Nusa Penida cliffs','Raja Ampat diving','Lombok waterfalls','Toraja funeral ceremony','Mentawai surf','Toba Lake Sumatra'] },
  Spain:       { lat:40.4168,  lon:-3.7038,  name:'มาดริด, สเปน',            temp:'18°C ☀️', desc:'อากาศดี แจ่มใส',  img:'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=90&w=1000&auto=format&fit=crop', currency:'EUR', rateUnit:1,   rateLabel:'1 EUR',   badge:'🇪🇸 Spain',  days:'8',  budget:'45k–100k',   budgetLow:45000,  budgetHigh:100000, lang:'Spanish',    season:'Apr–Jun', visa:'🛂 Schengen', flight:'~12 hrs',  icon:'💃',  highlights:['Sagrada Familia','Flamenco show','La Tomatina','Paella','Alhambra','La Boqueria market','Park Güell','San Sebastian pintxos','Seville cathedral','Camino de Santiago','Prado Museum','Toledo medieval city','Valencia City of Arts','Ronda cliff bridge','Ibiza sunset'] },
  Turkey:      { lat:41.0082,  lon:28.9784,  name:'อิสตันบูล, ตุรกี',        temp:'15°C 🌤️', desc:'อากาศดี',          img:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=90&w=1000&auto=format&fit=crop', currency:'TRY', rateUnit:100, rateLabel:'100 TRY', badge:'🇹🇷 Turkey',  days:'7',  budget:'20k–50k',    budgetLow:20000,  budgetHigh:50000,  lang:'Turkish',    season:'Apr–Jun', visa:'✅ eVisa',      flight:'~9 hrs',   icon:'🕌',  highlights:['Hagia Sophia','Cappadocia balloon','Grand Bazaar','Turkish tea','Bosphorus cruise','Pamukkale hot springs','Ephesus ruins','Antalya beach','Turkish hammam','Topkapi Palace','Whirling dervishes','Sumela monastery','Trabzon plateau','Bodrum castle','Gallipoli memorial'] },
  Greece:      { lat:37.9838,  lon:23.7275,  name:'เอเธนส์, กรีซ',           temp:'20°C ☀️', desc:'อากาศดี แจ่มใส',  img:'https://images.unsplash.com/photo-1555993539-1732b0258235?q=90&w=1000&auto=format&fit=crop', currency:'EUR', rateUnit:1,   rateLabel:'1 EUR',   badge:'🇬🇷 Greece',  days:'7',  budget:'45k–100k',   budgetLow:45000,  budgetHigh:100000, lang:'Greek',      season:'Apr–Jun', visa:'🛂 Schengen', flight:'~11 hrs',  icon:'🏛️', highlights:['Acropolis of Athens','Santorini sunset','Greek moussaka','Island hopping','Parthenon','Mykonos beach club','Delphi Oracle','Rhodes medieval town','Meteora monasteries','Athens flea market','Corfu old town','Crete Samaria Gorge','Olympia ancient site','Thessaloniki food tour','Zakynthos shipwreck beach'] },
  Portugal:    { lat:38.7223,  lon:-9.1393,  name:'ลิสบอน, โปรตุเกส',        temp:'18°C 🌤️', desc:'อากาศอบอุ่น',     img:'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=90&w=1000&auto=format&fit=crop', currency:'EUR', rateUnit:1,   rateLabel:'1 EUR',   badge:'🇵🇹 Portugal', days:'7', budget:'40k–90k',    budgetLow:40000,  budgetHigh:90000,  lang:'Portuguese', season:'Apr–Oct', visa:'🛂 Schengen', flight:'~13 hrs',  icon:'🐓', highlights:['Belém Tower','Sintra palaces','Pastéis de nata','Tram 28','Douro Valley wine','Fado music night','Porto wine cellars','Algarve sea caves','Nazaré surf waves','Alfama sunset view','Évora Roman temple','Azores island hike','Madeira levada walk','Obidos walled town','Monsanto boulder village'] },
  Mexico:      { lat:19.4326,  lon:-99.1332, name:'เม็กซิโก ซิตี้, เม็กซิโก', temp:'22°C ⛅', desc:'อากาศอบอุ่น',     img:'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=90&w=1000&auto=format&fit=crop', currency:'MXN', rateUnit:10,  rateLabel:'10 MXN',  badge:'🇲🇽 Mexico',  days:'9',  budget:'35k–80k',    budgetLow:35000,  budgetHigh:80000,  lang:'Spanish',    season:'Nov–Apr', visa:'🛂 Tourist Visa', flight:'~22 hrs', icon:'🌮', highlights:['Chichen Itza','Tulum ruins','Tacos al pastor','Lucha Libre','Cenote swimming','Oaxaca mezcal tour','Day of the Dead','Mariachi in Garibaldi','Mexico City murals','Copper Canyon train','Palenque jungle ruins','Guanajuato mummy museum','Monarch butterfly reserve','Izamal yellow city','Huatulco bays'] },
  Morocco:     { lat:31.6295,  lon:-7.9811,  name:'มาร์ราเกช, โมร็อกโก',      temp:'26°C ☀️', desc:'ร้อน แห้ง',       img:'https://images.unsplash.com/photo-1624805098931-098c0d918b34?q=90&w=1000&auto=format&fit=crop', currency:'MAD', rateUnit:10,  rateLabel:'10 MAD',  badge:'🇲🇦 Morocco',  days:'7', budget:'20k–50k',    budgetLow:20000,  budgetHigh:50000,  lang:'Arabic/French',season:'Mar–May', visa:'✅ Visa on Arrival', flight:'~11 hrs', icon:'🕌', highlights:['Djemaa el-Fna','Sahara Desert','Medina souks','Tajine','Atlas Mountains','Chefchaouen blue city','Fes tannery','Ouarzazate kasbahs','Essaouira port town','Hammam spa','Aït Benhaddou ksar','Dades Gorge drive','Merzouga camel ride','Rabat royal palace','Marrakech rooftop dining'] },
  Jordan:      { lat:31.9454,  lon:35.9284,  name:'อัมมาน, จอร์แดน',          temp:'23°C ☀️', desc:'อากาศดี แห้ง',    img:'https://images.unsplash.com/photo-1680423141142-77b719842d9d?q=90&w=1000&auto=format&fit=crop', currency:'JOD', rateUnit:1,   rateLabel:'1 JOD',   badge:'🇯🇴 Jordan',  days:'6',  budget:'30k–70k',    budgetLow:30000,  budgetHigh:70000,  lang:'Arabic',     season:'Mar–May', visa:'✅ Visa on Arrival', flight:'~7 hrs',  icon:'🏜️', highlights:['Petra','Wadi Rum','Dead Sea float','Jerash ruins','Mansaf','Aqaba Red Sea diving','Baptism Site of Jesus','Ajloun forest castle','Madaba mosaic map','Dana Nature Reserve','Little Petra','Shobak crusader castle','Wadi Mujib canyon swim','Umm Qais hilltop view','Amman Roman Theatre'] },
}

const FLIGHT_OPTIONS = [
  {value:'BKK', label:'🇹🇭 Bangkok (BKK)'},
  {value:'SIN', label:'🇸🇬 Singapore (SIN)'},
  {value:'KUL', label:'🇲🇾 Kuala Lumpur (KUL)'},
  {value:'DXB', label:'🇦🇪 Dubai (DXB)'},
  {value:'LHR', label:'🇬🇧 London (LHR)'},
  {value:'CDG', label:'🇫🇷 Paris (CDG)'},
  {value:'FRA', label:'🇩🇪 Frankfurt (FRA)'},
  {value:'JFK', label:'🇺🇸 New York (JFK)'},
  {value:'LAX', label:'🇺🇸 Los Angeles (LAX)'},
  {value:'NRT', label:'🇯🇵 Tokyo (NRT)'},
  {value:'ICN', label:'🇰🇷 Seoul (ICN)'},
  {value:'SYD', label:'🇦🇺 Sydney (SYD)'},
  {value:'BOM', label:'🇮🇳 Mumbai (BOM)'},
  {value:'HKG', label:'🇭🇰 Hong Kong (HKG)'},
  {value:'PEK', label:'🇨🇳 Beijing (PEK)'},
  {value:'ATH', label:'🇬🇷 Athens (ATH)'},
  {value:'LIS', label:'🇵🇹 Lisbon (LIS)'},
  {value:'MEX', label:'🇲🇽 Mexico City (MEX)'},
  {value:'CMN', label:'🇲🇦 Casablanca (CMN)'},
  {value:'AMM', label:'🇯🇴 Amman (AMM)'},
]

const FLIGHT_TIMES = {
  BKK: {Japan:'~7h',France:'~11h',Thailand:'local',SouthKorea:'~5.5h',USA:'~17h',UK:'~12h',Italy:'~11h',Switzerland:'~11.5h',Taiwan:'~3.5h',UAE:'~6.5h',Singapore:'~2.5h',Vietnam:'~2h',Maldives:'~3h',Australia:'~9.5h',China:'~4.5h',Germany:'~11h',India:'~3.5h',Indonesia:'~3h',Spain:'~12h',Turkey:'~9h',Greece:'~11h',Portugal:'~13h',Mexico:'~22h',Morocco:'~11h',Jordan:'~7h'},
  SIN: {Japan:'~7h',France:'~13h',Thailand:'~2.5h',SouthKorea:'~6.5h',USA:'~18h',UK:'~13h',Italy:'~13h',Switzerland:'~13h',Taiwan:'~4.5h',UAE:'~7h',Singapore:'local',Vietnam:'~2h',Maldives:'~4.5h',Australia:'~8h',China:'~5h',Germany:'~12h',India:'~4h',Indonesia:'~1.5h',Spain:'~13h',Turkey:'~10h',Greece:'~12h',Portugal:'~14h',Mexico:'~22h',Morocco:'~13h',Jordan:'~8h'},
  KUL: {Japan:'~7h',France:'~12.5h',Thailand:'~2h',SouthKorea:'~6h',USA:'~19h',UK:'~13h',Italy:'~12h',Switzerland:'~12h',Taiwan:'~4h',UAE:'~7h',Singapore:'~1h',Vietnam:'~2h',Maldives:'~4h',Australia:'~8h',China:'~4.5h',Germany:'~12h',India:'~3.5h',Indonesia:'~1h',Spain:'~13h',Turkey:'~10h',Greece:'~12h',Portugal:'~14h',Mexico:'~23h',Morocco:'~12h',Jordan:'~8h'},
  DXB: {Japan:'~9h',France:'~7h',Thailand:'~6.5h',SouthKorea:'~8.5h',USA:'~14h',UK:'~7h',Italy:'~6.5h',Switzerland:'~6.5h',Taiwan:'~8h',UAE:'local',Singapore:'~7h',Vietnam:'~6h',Maldives:'~4h',Australia:'~13h',China:'~8.5h',Germany:'~6.5h',India:'~3h',Indonesia:'~8h',Spain:'~7.5h',Turkey:'~4h',Greece:'~4h',Portugal:'~8h',Mexico:'~16h',Morocco:'~7h',Jordan:'~3h'},
  LHR: {Japan:'~12h',France:'~1.5h',Thailand:'~12h',SouthKorea:'~11h',USA:'~8h',UK:'local',Italy:'~2.5h',Switzerland:'~2h',Taiwan:'~13h',UAE:'~7h',Singapore:'~13h',Vietnam:'~12h',Maldives:'~11h',Australia:'~22h',China:'~10h',Germany:'~2h',India:'~9h',Indonesia:'~14h',Spain:'~2.5h',Turkey:'~4h',Greece:'~3.5h',Portugal:'~2.5h',Mexico:'~11h',Morocco:'~3.5h',Jordan:'~5h'},
  CDG: {Japan:'~12h',France:'local',Thailand:'~11h',SouthKorea:'~11h',USA:'~8h',UK:'~1.5h',Italy:'~2h',Switzerland:'~1.5h',Taiwan:'~13h',UAE:'~7h',Singapore:'~13h',Vietnam:'~12h',Maldives:'~11h',Australia:'~23h',China:'~10h',Germany:'~1.5h',India:'~9h',Indonesia:'~14h',Spain:'~2h',Turkey:'~3.5h',Greece:'~3h',Portugal:'~2.5h',Mexico:'~11.5h',Morocco:'~3.5h',Jordan:'~5h'},
  FRA: {Japan:'~11.5h',France:'~1.5h',Thailand:'~11h',SouthKorea:'~10.5h',USA:'~9h',UK:'~2h',Italy:'~2h',Switzerland:'~1h',Taiwan:'~12h',UAE:'~6.5h',Singapore:'~12h',Vietnam:'~11h',Maldives:'~10h',Australia:'~21h',China:'~9.5h',Germany:'local',India:'~8.5h',Indonesia:'~13h',Spain:'~2.5h',Turkey:'~3.5h',Greece:'~3h',Portugal:'~3h',Mexico:'~11h',Morocco:'~3.5h',Jordan:'~4.5h'},
  JFK: {Japan:'~14h',France:'~7.5h',Thailand:'~17h',SouthKorea:'~14.5h',USA:'local',UK:'~7h',Italy:'~9h',Switzerland:'~9h',Taiwan:'~16h',UAE:'~12h',Singapore:'~18h',Vietnam:'~18h',Maldives:'~20h',Australia:'~21h',China:'~14h',Germany:'~8.5h',India:'~15h',Indonesia:'~19h',Spain:'~8h',Turkey:'~10h',Greece:'~10h',Portugal:'~7.5h',Mexico:'~5h',Morocco:'~8h',Jordan:'~11h'},
  LAX: {Japan:'~11h',France:'~11h',Thailand:'~20h',SouthKorea:'~12h',USA:'local',UK:'~10h',Italy:'~12h',Switzerland:'~12h',Taiwan:'~13h',UAE:'~16h',Singapore:'~17h',Vietnam:'~20h',Maldives:'~23h',Australia:'~16h',China:'~12h',Germany:'~11h',India:'~17h',Indonesia:'~18h',Spain:'~11.5h',Turkey:'~13h',Greece:'~14h',Portugal:'~12h',Mexico:'~4h',Morocco:'~12h',Jordan:'~14h'},
  NRT: {Japan:'local',France:'~12h',Thailand:'~7h',SouthKorea:'~2h',USA:'~12h',UK:'~12h',Italy:'~12.5h',Switzerland:'~12.5h',Taiwan:'~3h',UAE:'~10h',Singapore:'~7h',Vietnam:'~5h',Maldives:'~9h',Australia:'~10h',China:'~3h',Germany:'~11.5h',India:'~8.5h',Indonesia:'~7h',Spain:'~13h',Turkey:'~11h',Greece:'~12h',Portugal:'~14h',Mexico:'~15h',Morocco:'~13h',Jordan:'~10.5h'},
  ICN: {Japan:'~2h',France:'~11.5h',Thailand:'~5.5h',SouthKorea:'local',USA:'~13h',UK:'~11h',Italy:'~11h',Switzerland:'~11.5h',Taiwan:'~2.5h',UAE:'~9h',Singapore:'~6.5h',Vietnam:'~4.5h',Maldives:'~8.5h',Australia:'~10h',China:'~1.5h',Germany:'~11h',India:'~8.5h',Indonesia:'~7h',Spain:'~12h',Turkey:'~10h',Greece:'~11h',Portugal:'~13h',Mexico:'~16h',Morocco:'~12h',Jordan:'~9.5h'},
  SYD: {Japan:'~10h',France:'~23h',Thailand:'~9h',SouthKorea:'~10h',USA:'~15h',UK:'~22h',Italy:'~22h',Switzerland:'~22h',Taiwan:'~9h',UAE:'~13.5h',Singapore:'~8h',Vietnam:'~8.5h',Maldives:'~12h',Australia:'local',China:'~11h',Germany:'~22h',India:'~12h',Indonesia:'~6h',Spain:'~23h',Turkey:'~18h',Greece:'~20h',Portugal:'~24h',Mexico:'~20h',Morocco:'~22h',Jordan:'~17h'},
  BOM: {Japan:'~8.5h',France:'~9h',Thailand:'~3.5h',SouthKorea:'~8.5h',USA:'~16h',UK:'~9h',Italy:'~8.5h',Switzerland:'~8.5h',Taiwan:'~5h',UAE:'~3h',Singapore:'~4h',Vietnam:'~5h',Maldives:'~2h',Australia:'~12h',China:'~5.5h',Germany:'~9h',India:'local',Indonesia:'~5h',Spain:'~10h',Turkey:'~6h',Greece:'~6.5h',Portugal:'~11h',Mexico:'~18h',Morocco:'~9h',Jordan:'~4h'},
  HKG: {Japan:'~4h',France:'~12h',Thailand:'~2.5h',SouthKorea:'~3.5h',USA:'~15h',UK:'~12h',Italy:'~12h',Switzerland:'~12h',Taiwan:'~1.5h',UAE:'~8h',Singapore:'~3.5h',Vietnam:'~2h',Maldives:'~6h',Australia:'~9h',China:'~3h',Germany:'~11.5h',India:'~5h',Indonesia:'~4h',Spain:'~13h',Turkey:'~11h',Greece:'~12h',Portugal:'~14h',Mexico:'~18h',Morocco:'~13h',Jordan:'~9.5h'},
  PEK: {Japan:'~3h',France:'~10.5h',Thailand:'~4.5h',SouthKorea:'~1.5h',USA:'~13h',UK:'~10h',Italy:'~10h',Switzerland:'~10h',Taiwan:'~3h',UAE:'~8.5h',Singapore:'~5h',Vietnam:'~3.5h',Maldives:'~7h',Australia:'~11h',China:'local',Germany:'~10h',India:'~5h',Indonesia:'~6h',Spain:'~11h',Turkey:'~9.5h',Greece:'~10h',Portugal:'~12h',Mexico:'~16h',Morocco:'~11h',Jordan:'~8.5h'},
  ATH: {Japan:'~12h',France:'~3h',Thailand:'~11h',SouthKorea:'~11h',USA:'~11h',UK:'~3.5h',Italy:'~2h',Switzerland:'~3h',Taiwan:'~12h',UAE:'~4h',Singapore:'~12h',Vietnam:'~11h',Maldives:'~9h',Australia:'~20h',China:'~10h',Germany:'~3h',India:'~6.5h',Indonesia:'~13h',Spain:'~3.5h',Turkey:'~1.5h',Greece:'local',Portugal:'~4h',Mexico:'~13h',Morocco:'~4.5h',Jordan:'~3h'},
  LIS: {Japan:'~14h',France:'~2.5h',Thailand:'~13h',SouthKorea:'~13h',USA:'~8h',UK:'~2.5h',Italy:'~3h',Switzerland:'~3h',Taiwan:'~14h',UAE:'~8h',Singapore:'~14h',Vietnam:'~14h',Maldives:'~12h',Australia:'~24h',China:'~12h',Germany:'~3h',India:'~11h',Indonesia:'~15h',Spain:'~1.5h',Turkey:'~4h',Greece:'~4h',Portugal:'local',Mexico:'~10.5h',Morocco:'~3h',Jordan:'~5.5h'},
  MEX: {Japan:'~15h',France:'~11.5h',Thailand:'~22h',SouthKorea:'~16h',USA:'~4.5h',UK:'~11h',Italy:'~13h',Switzerland:'~12.5h',Taiwan:'~18h',UAE:'~16h',Singapore:'~23h',Vietnam:'~23h',Maldives:'~22h',Australia:'~20h',China:'~16h',Germany:'~12h',India:'~19h',Indonesia:'~22h',Spain:'~12h',Turkey:'~13.5h',Greece:'~13h',Portugal:'~10.5h',Mexico:'local',Morocco:'~12.5h',Jordan:'~14.5h'},
  CMN: {Japan:'~13h',France:'~3.5h',Thailand:'~11h',SouthKorea:'~13h',USA:'~8.5h',UK:'~3.5h',Italy:'~3h',Switzerland:'~3.5h',Taiwan:'~13h',UAE:'~7h',Singapore:'~13h',Vietnam:'~12h',Maldives:'~10h',Australia:'~22h',China:'~11h',Germany:'~3.5h',India:'~9h',Indonesia:'~14h',Spain:'~2h',Turkey:'~4.5h',Greece:'~4.5h',Portugal:'~3h',Mexico:'~12.5h',Morocco:'local',Jordan:'~5h'},
  AMM: {Japan:'~10.5h',France:'~5h',Thailand:'~7h',SouthKorea:'~9.5h',USA:'~12h',UK:'~5h',Italy:'~3.5h',Switzerland:'~4h',Taiwan:'~9h',UAE:'~3h',Singapore:'~8h',Vietnam:'~7.5h',Maldives:'~6h',Australia:'~17h',China:'~8.5h',Germany:'~4.5h',India:'~4h',Indonesia:'~9h',Spain:'~5.5h',Turkey:'~2h',Greece:'~3h',Portugal:'~5.5h',Mexico:'~14.5h',Morocco:'~5h',Jordan:'local'},
}

const STATIC_USD_RATES = { USD:1,EUR:0.92,GBP:0.79,JPY:149.8,CHF:0.90,AUD:1.57,CAD:1.38,SGD:1.35,HKD:7.78,CNY:7.27,KRW:1360,TWD:32.5,THB:34.8,VND:25100,IDR:15900,MYR:4.70,INR:83.2,AED:3.673,TRY:32.0,MVR:15.42,MXN:17.15,MAD:10.05,JOD:0.71 }
const currencies = ['THB','USD','EUR','GBP','JPY','KRW','SGD','AUD','CHF','CNY','HKD','TWD','VND','AED','MVR','IDR','INR','TRY','CAD','MYR','MXN','MAD','JOD']

const LS_DB = 'travelaroha_dashboard'
function loadDB(key, def) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def } catch(e) { return def }
}
function saveDB(key, val) { try { localStorage.setItem(key, JSON.stringify(val)) } catch(e) {} }

const selectedKey    = ref(loadDB(LS_DB + '_country', 'Japan'))
const countryDropOpen  = ref(false)
const flightDropOpen   = ref(false)
const currencyDropOpen = ref(false)
const countryBtnRef    = ref(null)
const flightBtnRef     = ref(null)
const currencyBtnRef   = ref(null)
const countryDropStyle = ref({})
const flightDropStyle  = ref({})
const currencyDropStyle = ref({})

function positionCountry() {
  if (!countryBtnRef.value) return
  const r = countryBtnRef.value.getBoundingClientRect()
  const dropH = Math.min(288, Object.keys(countryData).length * 40)
  const above = r.top > dropH + 8
  countryDropStyle.value = above
    ? { bottom: (window.innerHeight - r.top + 8) + 'px', right: (window.innerWidth - r.right) + 'px' }
    : { top: (r.bottom + 8) + 'px', right: (window.innerWidth - r.right) + 'px' }
}
function positionFlight() {
  if (!flightBtnRef.value) return
  const r = flightBtnRef.value.getBoundingClientRect()
  const dropH = Math.min(256, 20 * 32)
  const above = r.bottom + dropH + 8 > window.innerHeight
  flightDropStyle.value = above
    ? { bottom: (window.innerHeight - r.top + 4) + 'px', left: r.left + 'px' }
    : { top: (r.bottom + 4) + 'px', left: r.left + 'px' }
}
function positionCurrency() {
  if (!currencyBtnRef.value) return
  const r = currencyBtnRef.value.getBoundingClientRect()
  const dropH = 256
  const above = r.bottom + dropH + 8 > window.innerHeight
  currencyDropStyle.value = above
    ? { bottom: (window.innerHeight - r.top + 4) + 'px', left: r.left + 'px', width: r.width + 'px' }
    : { top: (r.bottom + 4) + 'px', left: r.left + 'px', width: r.width + 'px' }
}

function toggleCountryDrop() {
  countryDropOpen.value = !countryDropOpen.value
  flightDropOpen.value = false
  currencyDropOpen.value = false
  if (countryDropOpen.value) positionCountry()
}
function toggleFlightDrop() {
  flightDropOpen.value = !flightDropOpen.value
  countryDropOpen.value = false
  currencyDropOpen.value = false
  if (flightDropOpen.value) positionFlight()
}
function toggleCurrencyDrop() {
  currencyDropOpen.value = !currencyDropOpen.value
  countryDropOpen.value = false
  flightDropOpen.value = false
  if (currencyDropOpen.value) positionCurrency()
}

function onScrollResize() {
  if (countryDropOpen.value)  positionCountry()
  if (flightDropOpen.value)   positionFlight()
  if (currencyDropOpen.value) positionCurrency()
}
const rateAmount     = ref(loadDB(LS_DB + '_rateamt', 1))
const targetCurrency = ref(loadDB(LS_DB + '_currency', 'THB'))
const rateResult  = ref(0)
const rateLoading = ref(false)
const rateError   = ref(false)
const rateUpdated = ref('')
const isOfflineRate = ref(false)
let rateCache = {}

const people       = ref(loadDB(LS_DB + '_people', 2))
const calcDays     = ref(loadDB(LS_DB + '_days', 5))
const flightOrigin = ref(loadDB(LS_DB + '_origin', 'BKK'))

watch(selectedKey,    v => saveDB(LS_DB + '_country', v))
watch(rateAmount,     v => saveDB(LS_DB + '_rateamt', v))
watch(targetCurrency, v => saveDB(LS_DB + '_currency', v))
watch(people,         v => saveDB(LS_DB + '_people', v))
watch(calcDays,       v => saveDB(LS_DB + '_days', v))
watch(flightOrigin,   v => saveDB(LS_DB + '_origin', v))

const flightTime = computed(() => {
  const times = FLIGHT_TIMES[flightOrigin.value]
  const raw = (times && times[selectedKey.value]) || current.value.flight
  if (!raw) return ''
  if (raw === 'local') return t('db_flight_local')
  // raw is like '~7h' or '~11.5h' — replace 'h' with localized unit
  return raw.replace(/h$/, t('db_flight_h'))
})

const flightOriginLabel = computed(() =>
  FLIGHT_OPTIONS.find(o => o.value === flightOrigin.value)?.label || flightOrigin.value
)

const current = computed(() => countryData[selectedKey.value])

// Preload all country images so switching is instant
// ── Local Time for selected country ─────────────────────────────────────
const localTime     = ref('')
const localDate     = ref('')
const localSeconds  = ref(0)
const localTZ       = ref('')
const clockSecFrac  = ref(0)
let   clockTimer    = null

function updateClock() {
  const c = current.value
  if (!c?.lat) return
  try {
    // derive IANA timezone from lat/lon using Intl offset heuristic
    // Use the timezone auto-detected by open-meteo (stored in weatherData) or guess from longitude
    const tz = c.tz || guessTimezone(c.lon)
    const now = new Date()
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    })
    const dtfDate = new Intl.DateTimeFormat(lang.value === 'th' ? 'th-TH' : 'en-US', {
      timeZone: tz,
      weekday: 'short', month: 'short', day: 'numeric',
    })
    const parts = dtf.formatToParts(now)
    const get   = type => parts.find(p => p.type === type)?.value || '00'
    const hh = get('hour'), mm = get('minute'), ss = get('second')
    localTime.value    = `${hh}:${mm}`
    localSeconds.value = parseInt(ss)
    clockSecFrac.value = parseInt(ss) / 60
    localDate.value    = dtfDate.format(now)
    localTZ.value      = tz.replace(/_/g, ' ')
  } catch(e) {
    localTime.value = '--:--'
  }
}

function guessTimezone(lon) {
  // rough mapping of lon → IANA tz (good enough for listed countries)
  const tzMap = {
    Japan: 'Asia/Tokyo', France: 'Europe/Paris', Thailand: 'Asia/Bangkok',
    SouthKorea: 'Asia/Seoul', USA: 'America/New_York', UK: 'Europe/London',
    Italy: 'Europe/Rome', Switzerland: 'Europe/Zurich', Taiwan: 'Asia/Taipei',
    Singapore: 'Asia/Singapore', Vietnam: 'Asia/Ho_Chi_Minh',
    Maldives: 'Indian/Maldives', Australia: 'Australia/Sydney',
    China: 'Asia/Shanghai', Germany: 'Europe/Berlin', India: 'Asia/Kolkata',
    Indonesia: 'Asia/Makassar', Spain: 'Europe/Madrid', Turkey: 'Europe/Istanbul',
    Greece: 'Europe/Athens', Portugal: 'Europe/Lisbon', Mexico: 'America/Mexico_City',
    Morocco: 'Africa/Casablanca', Jordan: 'Asia/Amman', UAE: 'Asia/Dubai',
  }
  return tzMap[selectedKey.value] || 'UTC'
}
// ────────────────────────────────────────────────────────────────────────

onMounted(() => {
  Object.values(countryData).forEach(c => { const i = new Image(); i.src = c.img })
  document.addEventListener('click', () => {
    countryDropOpen.value = false
    flightDropOpen.value = false
    currencyDropOpen.value = false
  })
  window.addEventListener('scroll', onScrollResize, true)
  window.addEventListener('resize', onScrollResize)
  // Start clock
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
  window.addEventListener('scroll', onScrollTop, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScrollResize, true)
  window.removeEventListener('resize', onScrollResize)
  window.removeEventListener('scroll', onScrollTop)
  if (clockTimer) clearInterval(clockTimer)
})

const showScrollTop = ref(false)
function onScrollTop() { showScrollTop.value = window.scrollY > 320 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
const currentI18n = computed(() => {
  const c = DB_COUNTRIES[selectedKey.value]
  if (!c) return null
  const l = lang.value
  const lH  = c.highlights?.[l]    || []
  const enH = c.highlights?.['en'] || []
  const mergedHighlights = lH.length >= enH.length ? lH : [...lH, ...enH.slice(lH.length)]
  return {
    name:       c.name?.[l]       || c.name?.['en'],
    desc:       c.desc?.[l]       || c.desc?.['en'],
    lang:       c.lang?.[l]       || c.lang?.['en'],
    season:     c.season?.[l]     || c.season?.['en'],
    flight:     c.flight?.[l]     || c.flight?.['en'],
    highlights: mergedHighlights,
  }
})

const fmt = n => Math.round(n).toLocaleString()

// Rate for converting THB budget → targetCurrency (for calculator & summary)
const calcRate = ref(1)

async function fetchCalcRate() {
  const to = targetCurrency.value
  if (to === 'THB') { calcRate.value = 1; return }
  try {
    const rates = await getUsdRates()
    const thbRate = rates['THB'], toRate = rates[to]
    if (thbRate && toRate) calcRate.value = toRate / thbRate
  } catch(e) {}
}

const CURRENCY_SYMBOL = {
  THB:'฿', USD:'$', EUR:'€', GBP:'£', JPY:'¥', KRW:'₩',
  SGD:'S$', AUD:'A$', CHF:'CHF', CNY:'¥', HKD:'HK$',
  TWD:'NT$', VND:'₫', AED:'د.إ', MVR:'Rf', IDR:'Rp',
  INR:'₹', TRY:'₺', CAD:'CA$', MYR:'RM',
}

const calcCurrSign = computed(() => CURRENCY_SYMBOL[targetCurrency.value] || targetCurrency.value + ' ')

const calcResult = computed(() => {
  const c = current.value
  const base = parseInt(c.days) || 7
  const r = calcRate.value
  const low  = c.budgetLow  * people.value * calcDays.value / base * r
  const high = c.budgetHigh * people.value * calcDays.value / base * r
  return `${calcCurrSign.value}${fmt(low)} – ${calcCurrSign.value}${fmt(high)}`
})

const costBreakdown = computed(() => {
  const c = current.value
  const base = parseInt(c.days) || 7
  const days = calcDays.value, ppl = people.value
  const r = calcRate.value
  const hotelPct = 0.40, foodPct = 0.25, transPct = 0.20, actPct = 0.15
  const midLow = c.budgetLow * ppl * days / base * r
  const midHigh = c.budgetHigh * ppl * days / base * r
  const total = (midLow + midHigh) / 2
  const sign = calcCurrSign.value
  const BREAKDOWN_ICONS = {
    db_hotel:      `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"/>`,
    db_food:       `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h12m-10-5v5m4-5v5m4-5v5"/><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>`,
    db_transport:  `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17h8M3 9l1-5h14l1 5M3 9v6a1 1 0 001 1h1m12 0h1a1 1 0 001-1V9M3 9h18"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/>`,
    db_activities: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`,
  }
  return [
    { key: 'db_hotel',      amount: `${sign}${fmt(total * hotelPct)}`, icon: BREAKDOWN_ICONS.db_hotel },
    { key: 'db_food',       amount: `${sign}${fmt(total * foodPct)}`,  icon: BREAKDOWN_ICONS.db_food },
    { key: 'db_transport',  amount: `${sign}${fmt(total * transPct)}`, icon: BREAKDOWN_ICONS.db_transport },
    { key: 'db_activities', amount: `${sign}${fmt(total * actPct)}`,   icon: BREAKDOWN_ICONS.db_activities },
  ]
})

function fmtBudgetRange(low, high) {
  const r = calcRate.value
  return `${fmt(low * r)}–${fmt(high * r)}`
}

function adjustPeople(d) { people.value = Math.max(1, Math.min(20, people.value + d)) }
function adjustDays(d)   { calcDays.value = Math.max(1, Math.min(60, calcDays.value + d)) }

let _usdRates = null
let _usdRatesTs = 0

async function getUsdRates() {
  if (_usdRates && Date.now() - _usdRatesTs < 600000) return _usdRates
  const apis = [
    {
      url: 'https://open.er-api.com/v6/latest/USD',
      parse: d => d.rates ? { USD:1, ...d.rates } : null,
    },
    {
      url: 'https://api.frankfurter.app/latest?from=USD',
      parse: d => d.rates ? { USD:1, ...d.rates } : null,
    },
    {
      url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      parse: d => {
        if (!d.usd) return null
        const r = {}
        Object.entries(d.usd).forEach(([k,v]) => { r[k.toUpperCase()] = v })
        return r
      },
    },
    {
      url: 'https://latest.currency-api.pages.dev/v1/currencies/usd.json',
      parse: d => {
        if (!d.usd) return null
        const r = {}
        Object.entries(d.usd).forEach(([k,v]) => { r[k.toUpperCase()] = v })
        return r
      },
    },
  ]
  for (const { url, parse } of apis) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
      if (!res.ok) continue
      const data = await res.json()
      const rates = parse(data)
      if (rates && Object.keys(rates).length > 10) {
        _usdRates = rates; _usdRatesTs = Date.now()
        isOfflineRate.value = false
        return rates
      }
    } catch(e) {}
  }
  _usdRates = STATIC_USD_RATES; _usdRatesTs = Date.now()
  isOfflineRate.value = true
  return _usdRates
}

async function fetchRate() {
  const from = current.value.currency
  const to   = targetCurrency.value
  const amt  = rateAmount.value   // direct amount user typed

  if (from === to) { rateResult.value = amt; rateUpdated.value = t('db_local_curr'); return }

  const cacheKey = `${from}_${to}`
  const cached = rateCache[cacheKey]
  if (cached && Date.now() - cached.ts < 600000) {
    rateResult.value = cached.rate * amt
    rateUpdated.value = `${t('db_rate_updated')} ${cached.timeStr}`
    return
  }

  rateLoading.value = true
  rateError.value = false
  try {
    const rates = await getUsdRates()
    const fromRate = rates[from], toRate = rates[to]
    if (!fromRate || !toRate) throw new Error('not found')
    const rate = toRate / fromRate
    const timeStr = new Date().toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' })
    rateCache[cacheKey] = { rate, ts: Date.now(), timeStr }
    rateResult.value = rate * amt
    rateUpdated.value = `${t('db_rate_updated')} ${timeStr}`
  } catch(e) {
    rateError.value = true
  }
  rateLoading.value = false
}

// Auto-fetch on country or currency change
watch([selectedKey, targetCurrency, rateAmount], () => fetchRate(), { immediate: true })
watch(targetCurrency, () => fetchCalcRate(), { immediate: true })

// ─── Realtime Weather (Open-Meteo, free, no API key) ─────────────────────────
const WMO = {
  0:  { emoji:'☀️',  th:'ท้องฟ้าแจ่มใส',    en:'Clear sky',          zh:'晴天',      es:'Cielo despejado', ar:'سماء صافية',   fr:'Ciel dégagé' },
  1:  { emoji:'🌤️', th:'แจ่มใสเป็นส่วนมาก', en:'Mostly clear',       zh:'大致晴朗',   es:'Mayormente despejado', ar:'غالباً صافي', fr:'Globalement dégagé' },
  2:  { emoji:'⛅',  th:'มีเมฆบางส่วน',      en:'Partly cloudy',      zh:'多云',       es:'Parcialmente nublado', ar:'غائم جزئياً', fr:'Partiellement nuageux' },
  3:  { emoji:'☁️',  th:'มีเมฆมาก',          en:'Overcast',           zh:'阴天',       es:'Nublado',         ar:'غائم',          fr:'Couvert' },
  45: { emoji:'🌫️', th:'หมอกลง',            en:'Foggy',              zh:'有雾',       es:'Niebla',          ar:'ضبابي',         fr:'Brouillard' },
  48: { emoji:'🌫️', th:'หมอกเยือกแข็ง',     en:'Icy fog',            zh:'冻雾',       es:'Niebla helada',   ar:'ضباب جليدي',    fr:'Brouillard givrant' },
  51: { emoji:'🌦️', th:'ฝนปรอยเบา',         en:'Light drizzle',      zh:'毛毛雨',     es:'Llovizna ligera',  ar:'رذاذ خفيف',    fr:'Bruine légère' },
  53: { emoji:'🌦️', th:'ฝนปรอย',            en:'Drizzle',            zh:'毛毛雨',     es:'Llovizna',        ar:'رذاذ',           fr:'Bruine' },
  55: { emoji:'🌦️', th:'ฝนปรอยหนัก',        en:'Heavy drizzle',      zh:'浓毛毛雨',   es:'Llovizna intensa', ar:'رذاذ كثيف',    fr:'Bruine dense' },
  61: { emoji:'🌧️', th:'ฝนตกเบา',           en:'Light rain',         zh:'小雨',       es:'Lluvia ligera',   ar:'مطر خفيف',      fr:'Pluie légère' },
  63: { emoji:'🌧️', th:'ฝนตก',              en:'Rain',               zh:'下雨',       es:'Lluvia',          ar:'مطر',            fr:'Pluie' },
  65: { emoji:'🌧️', th:'ฝนตกหนัก',          en:'Heavy rain',         zh:'大雨',       es:'Lluvia fuerte',   ar:'مطر غزير',      fr:'Pluie forte' },
  71: { emoji:'🌨️', th:'หิมะตกเบา',         en:'Light snow',         zh:'小雪',       es:'Nieve ligera',    ar:'ثلج خفيف',      fr:'Neige légère' },
  73: { emoji:'🌨️', th:'หิมะตก',            en:'Snow',               zh:'下雪',       es:'Nieve',           ar:'ثلج',            fr:'Neige' },
  75: { emoji:'❄️',  th:'หิมะตกหนัก',        en:'Heavy snow',         zh:'大雪',       es:'Nieve intensa',   ar:'ثلج كثيف',      fr:'Neige dense' },
  80: { emoji:'🌦️', th:'ฝนตกเป็นพักๆ เบา',  en:'Light showers',      zh:'阵雨',       es:'Chubascos ligeros',ar:'زخات خفيفة',   fr:'Averses légères' },
  81: { emoji:'🌦️', th:'ฝนตกเป็นพักๆ',      en:'Showers',            zh:'阵雨',       es:'Chubascos',       ar:'زخات مطر',       fr:'Averses' },
  82: { emoji:'⛈️',  th:'ฝนหนักมาก',         en:'Heavy showers',      zh:'强阵雨',     es:'Chubascos fuertes',ar:'زخات غزيرة',   fr:'Averses fortes' },
  85: { emoji:'🌨️', th:'หิมะเป็นพักๆ',      en:'Snow showers',       zh:'阵雪',       es:'Chubascos de nieve',ar:'زخات ثلج',     fr:'Averses de neige' },
  95: { emoji:'⛈️',  th:'พายุฝนฟ้าคะนอง',    en:'Thunderstorm',       zh:'雷雨',       es:'Tormenta',        ar:'عاصفة رعدية',   fr:'Orage' },
  96: { emoji:'⛈️',  th:'พายุลูกเห็บ',       en:'Thunderstorm w/ hail',zh:'冰雹雷雨',  es:'Tormenta con granizo',ar:'عاصفة مع برد',fr:'Orage avec grêle' },
  99: { emoji:'⛈️',  th:'พายุลูกเห็บหนัก',   en:'Heavy hail storm',   zh:'强冰雹',     es:'Tormenta fuerte',  ar:'عاصفة قوية',   fr:'Orage violent' },
}

function wmoInfo(code) {
  // find closest code (handles odd codes like 77, 56, etc.)
  if (WMO[code]) return WMO[code]
  const closest = Object.keys(WMO).map(Number).reduce((a, b) => Math.abs(b - code) < Math.abs(a - code) ? b : a)
  return WMO[closest]
}

const weatherData   = ref(null)  // { temp, emoji, desc }
const weatherLoading = ref(false)
const weatherError   = ref(false)
let   weatherCache  = {}

async function fetchWeather() {
  const c = current.value
  if (!c?.lat) return
  const key = selectedKey.value
  const cached = weatherCache[key]
  if (cached && Date.now() - cached.ts < 600000) {
    // always re-derive desc from current language (cache may have old lang)
    const info = wmoInfo(cached.data.code)
    const l = lang.value
    weatherData.value = { ...cached.data, desc: info[l] || info.en }
    weatherError.value = false
    return
  }

  weatherLoading.value = true
  weatherData.value = null
  weatherError.value = false
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weathercode&wind_speed_unit=kmh&timezone=auto`
    const res  = await fetch(url, { signal: AbortSignal.timeout(6000) })
    const json = await res.json()
    const cur  = json.current
    const info = wmoInfo(cur.weathercode)
    const l    = lang.value
    const data = {
      temp:  Math.round(cur.temperature_2m),
      emoji: info.emoji,
      desc:  info[l] || info.en,
      code:  cur.weathercode,
    }
    weatherCache[key] = { data, ts: Date.now() }
    weatherData.value = data
    weatherError.value = false
  } catch(e) {
    weatherData.value = null
    weatherError.value = true
  }
  weatherLoading.value = false
}

// Re-map desc when language changes — update ALL cached entries + current view
watch(lang, () => {
  const l = lang.value
  // update every cached country so switching country later gets correct lang
  Object.keys(weatherCache).forEach(key => {
    const cached = weatherCache[key]
    if (!cached) return
    const info = wmoInfo(cached.data.code)
    weatherCache[key] = {
      ...cached,
      data: { ...cached.data, desc: info[l] || info.en }
    }
  })
  // update currently displayed weather immediately
  const current = weatherCache[selectedKey.value]
  if (current) weatherData.value = { ...current.data }
})

watch(selectedKey, () => {
  fetchWeather()
  updateClock()
}, { immediate: true })
</script>

<style scoped>
.counter-btn {
  @apply w-8 h-8 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400
         bg-teal-100/50 dark:bg-teal-900/30 border border-teal-200/50 dark:border-teal-800
         hover:bg-teal-200 dark:hover:bg-teal-900/60 transition-colors font-bold text-xl cursor-pointer select-none;
}

/* Hero image crossfade */
.img-fade-enter-active { transition: opacity 0.25s ease; }
.img-fade-leave-active { transition: opacity 0.2s ease; position: absolute; inset: 0; }
.img-fade-enter-from   { opacity: 0; }
.img-fade-leave-to     { opacity: 0; }

/* Custom dropdown fade */
.drop-fade-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.drop-fade-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.drop-fade-enter-from   { opacity: 0; transform: translateY(4px); }
.drop-fade-leave-to     { opacity: 0; transform: translateY(4px); }

/* Scroll to top */
.scroll-top-enter-active, .scroll-top-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.scroll-top-enter-from, .scroll-top-leave-to { opacity: 0; transform: translateY(12px) scale(0.9); }
</style>