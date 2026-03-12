<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">{{ t('db_title') }}</h1>

    <!-- Country selector + hero -->
    <div class="relative rounded-3xl overflow-hidden mb-6 shadow-lg">
      <img :src="current.img" class="w-full h-48 sm:h-60 object-cover transition-opacity duration-300" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
        <div class="flex flex-wrap items-end gap-3 justify-between">
          <div>
            <div class="text-2xl font-extrabold">{{ current.icon }} {{ currentI18n?.name || current.name }}</div>
            <div class="text-sm text-white/70 mt-0.5">{{ current.temp }} · {{ currentI18n?.desc || current.desc }}</div>
          </div>
          <select
            v-model="selectedKey"
            class="bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option v-for="(_, k) in countryData" :key="k" :value="k" class="text-slate-800">{{ countryData[k].badge }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Exchange Rate card -->
      <div class="glass-panel rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm">
        <h2 class="font-bold text-base mb-4 text-slate-700 dark:text-slate-300">{{ t('db_exchange') }}</h2>
        <div class="flex gap-2 mb-3">
          <input
            v-model.number="rateAmount"
            type="number" min="1"
            class="w-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <span class="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300">{{ current.currency }}</span>
          <span class="py-2 text-slate-400 text-sm">→</span>
          <select
            v-model="targetCurrency"
            class="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option v-for="cur in currencies" :key="cur">{{ cur }}</option>
          </select>
        </div>

        <div class="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-4 mb-2">
          <div v-if="rateLoading" class="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse w-32"></div>
          <div v-else-if="rateError" class="text-rose-500 text-sm">{{ t('db_rate_error') }}</div>
          <div v-else class="text-3xl font-extrabold text-teal-700 dark:text-teal-300">
            {{ fmt(rateResult) }} <span class="text-xl text-slate-500 dark:text-slate-400 font-medium">{{ targetCurrency }}</span>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xs text-slate-400">{{ rateAmount }} {{ current.currency }} =</span>
            <span v-if="isOfflineRate && !rateLoading" class="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-medium">
              ⚠️ {{ t('db_rate_offline') }}
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
      <div class="glass-panel rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm">
        <h2 class="font-bold text-base mb-4 text-slate-700 dark:text-slate-300">{{ t('db_trip_summary') }}</h2>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3">
            <div class="text-xs text-slate-400">{{ t('db_rec_days') }}</div>
            <div class="font-extrabold text-lg text-teal-600 dark:text-teal-400">{{ currentI18n ? 'Mar–May' : current.season }}</div>
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
              <select
                v-model="flightOrigin"
                class="flex-1 min-w-[140px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option v-for="o in FLIGHT_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
              <span class="text-slate-400 text-xs">→</span>
              <span class="font-extrabold text-sm text-teal-600 dark:text-teal-400">{{ flightTime }}</span>
            </div>
          </div>
        </div>
        <div class="text-xs text-slate-400 mb-1 font-semibold">{{ t('db_highlights') }}</div>
        <ul class="space-y-1">
          <li
            v-for="h in (currentI18n?.highlights || current.highlights)"
            :key="h"
            class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
          >
            <span class="text-teal-500 mt-0.5">•</span> {{ h }}
          </li>
        </ul>
      </div>

      <!-- Cost Calculator -->
      <div class="glass-panel rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm md:col-span-2">
        <h2 class="font-bold text-base mb-4 text-slate-700 dark:text-slate-300">{{ t('db_calc_title') }}</h2>
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
            <div class="text-sm font-semibold text-slate-700 dark:text-slate-300">{{ t(item.key) }}</div>
            <div class="text-xs text-teal-600 dark:text-teal-400 font-bold mt-0.5">{{ item.amount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { DB_COUNTRIES } from '../data/countries.js'

const { t, lang } = useI18n()

// ─── Country data (dashboard-specific with budget tiers) ─────────────────────
const countryData = {
  Japan:       { name:'โตเกียว, ญี่ปุ่น',     temp:'15°C ⛅', desc:'อากาศเย็นสบาย', img:'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80', currency:'JPY', rateUnit:100, rateLabel:'100 JPY', badge:'🇯🇵 Japan', days:'7',  budget:'35k–70k',    budgetLow:35000,  budgetHigh:70000,  lang:'Japanese',   season:'Mar–May', visa:'✅ Visa-free 30d', flight:'~7 hrs',   icon:'⛩️',  highlights:['Cherry blossoms at Ueno','Shibuya Crossing','Ramen','Tokyo Skytree'] },
  France:      { name:'ปารีส, ฝรั่งเศส',      temp:'12°C 🌥️', desc:'มีเมฆ โรแมนติก',  img:'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80', currency:'EUR', rateUnit:1,   rateLabel:'1 EUR',   badge:'🇫🇷 France', days:'6',  budget:'60k–120k',   budgetLow:60000,  budgetHigh:120000, lang:'French',     season:'Apr–Jun', visa:'🛂 Schengen', flight:'~11 hrs',  icon:'🗼',  highlights:['Eiffel Tower at night','Seine river cruise','The Louvre','Croissant'] },
  Thailand:    { name:'กรุงเทพฯ, ไทย',        temp:'33°C ☀️', desc:'ร้อน แดดแรง',      img:'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80', currency:'THB', rateUnit:1,   rateLabel:'1 THB',   badge:'🇹🇭 Thailand', days:'5', budget:'8k–20k',     budgetLow:8000,   budgetHigh:20000,  lang:'Thai',       season:'Nov–Feb', visa:'✅ No visa',   flight:'Domestic', icon:'🛕',  highlights:['Wat Phra Kaew','Mango sticky rice','Chatuchak Market','Chao Phraya boat'] },
  SouthKorea:  { name:'โซล, เกาหลีใต้',       temp:'8°C 🌬️',  desc:'ลมแรง หนาว',      img:'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80', currency:'KRW', rateUnit:1000,rateLabel:'1,000 KRW',badge:'🇰🇷 South Korea', days:'6',budget:'30k–60k',   budgetLow:30000,  budgetHigh:60000,  lang:'Korean',     season:'Mar–May', visa:'✅ Visa-free 30d', flight:'~5.5 hrs', icon:'🏯',  highlights:['Itaewon','Gyeongbokgung Palace','K-BBQ','Myeongdong'] },
  USA:         { name:'นิวยอร์ก, USA',         temp:'18°C 🌤️', desc:'อากาศดี',          img:'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', currency:'USD', rateUnit:1,   rateLabel:'1 USD',   badge:'🇺🇸 USA',    days:'10', budget:'80k–180k',   budgetLow:80000,  budgetHigh:180000, lang:'English',    season:'Apr–Jun', visa:'🛂 US Visa',   flight:'~17 hrs',  icon:'🗽',  highlights:['Central Park','Times Square','Brooklyn Bridge','NY Pizza'] },
  UK:          { name:'ลอนดอน, UK',            temp:'10°C 🌧️', desc:'มีฝน พกร่ม',      img:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80', currency:'GBP', rateUnit:1,   rateLabel:'1 GBP',   badge:'🇬🇧 UK',     days:'7',  budget:'70k–150k',   budgetLow:70000,  budgetHigh:150000, lang:'English',    season:'Jun–Aug', visa:'🛂 UK Visa',   flight:'~12 hrs',  icon:'🎡',  highlights:['Buckingham Palace','Tate Modern','The Tube','Fish and chips'] },
  Italy:       { name:'โรม, อิตาลี',           temp:'22°C ☀️', desc:'ท้องฟ้าโปร่ง',    img:'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', currency:'EUR', rateUnit:1,   rateLabel:'1 EUR',   badge:'🇮🇹 Italy',  days:'8',  budget:'55k–110k',   budgetLow:55000,  budgetHigh:110000, lang:'Italian',    season:'Apr–Jun', visa:'🛂 Schengen', flight:'~11 hrs',  icon:'🏛️', highlights:['The Colosseum','Gelato','Trevi Fountain','St. Peter\'s'] },
  Switzerland: { name:'ซูริค, Switzerland',    temp:'5°C 🌨️',  desc:'หนาวจัด หิมะ',    img:'https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=800&q=80', currency:'CHF', rateUnit:1,   rateLabel:'1 CHF',   badge:'🇨🇭 Switzerland', days:'6',budget:'90k–200k',  budgetLow:90000,  budgetHigh:200000, lang:'German/French',season:'Jun–Aug', visa:'🛂 Schengen', flight:'~11.5 hrs',icon:'🏔️', highlights:['Interlaken ski','Jungfraujoch','Fondue','Lake Geneva'] },
  Taiwan:      { name:'ไทเป, Taiwan',           temp:'25°C ⛅', desc:'อากาศอบอุ่น',     img:'https://images.unsplash.com/photo-1550951298-5c7b95a66bfc?auto=format&fit=crop&w=800&q=80', currency:'TWD', rateUnit:100, rateLabel:'100 TWD', badge:'🇹🇼 Taiwan',  days:'5',  budget:'20k–45k',    budgetLow:20000,  budgetHigh:45000,  lang:'Mandarin',   season:'Oct–Dec', visa:'✅ Visa-free 30d', flight:'~3.5 hrs', icon:'🏮',  highlights:['Shilin Night Market','Taipei 101','Stinky tofu','Cycling'] },
  Singapore:   { name:'สิงคโปร์',               temp:'30°C 🌦️', desc:'ร้อนชื้น',        img:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80', currency:'SGD', rateUnit:1,   rateLabel:'1 SGD',   badge:'🇸🇬 Singapore', days:'4',budget:'30k–70k',   budgetLow:30000,  budgetHigh:70000,  lang:'English/Chinese',season:'Year-round',visa:'✅ Visa-free 30d', flight:'~2.5 hrs', icon:'🦁',  highlights:['Gardens by the Bay','Chinatown','Chilli crab','Marina Bay Sands'] },
  Vietnam:     { name:'ดานัง, Vietnam',         temp:'28°C ⛅', desc:'ลมทะเลเย็น',      img:'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80', currency:'VND', rateUnit:10000,rateLabel:'10,000 VND',badge:'🇻🇳 Vietnam', days:'6', budget:'15k–35k',    budgetLow:15000,  budgetHigh:35000,  lang:'Vietnamese', season:'Jan–Apr', visa:'✅ Visa-free 45d', flight:'~2 hrs',   icon:'🏖️', highlights:['Ha Long Bay','Hoi An','Pho','Motorbike ride'] },
  Maldives:    { name:'มาเล่, Maldives',        temp:'29°C 🏝️', desc:'แดดแรง ทะเลใส',  img:'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80', currency:'MVR', rateUnit:10,  rateLabel:'10 MVR',  badge:'🇲🇻 Maldives', days:'5',budget:'80k–200k',   budgetLow:80000,  budgetHigh:200000, lang:'Dhivehi/English',season:'Nov–Apr',visa:'✅ Visa on Arrival', flight:'~3 hrs',  icon:'🐠',  highlights:['Overwater bungalow','Whale shark snorkel','Bioluminescent beach','Dhoni cruise'] },
  Australia:   { name:'ซิดนีย์, Australia',    temp:'24°C ☀️', desc:'อากาศแจ่มใส',     img:'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80', currency:'AUD', rateUnit:1,   rateLabel:'1 AUD',   badge:'🇦🇺 Australia', days:'10',budget:'60k–130k',  budgetLow:60000,  budgetHigh:130000, lang:'English',    season:'Sep–Nov', visa:'🛂 ETA',       flight:'~9.5 hrs', icon:'🦘',  highlights:['Sydney Opera House','Bondi Beach','Blue Mountains','Kangaroos'] },
  UAE:         { name:'ดูไบ, UAE',              temp:'35°C 🏜️', desc:'ร้อนแห้ง',        img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', currency:'AED', rateUnit:10,  rateLabel:'10 AED',  badge:'🇦🇪 UAE',    days:'5',  budget:'50k–120k',   budgetLow:50000,  budgetHigh:120000, lang:'Arabic/English',season:'Nov–Apr',visa:'✅ Visa on Arrival', flight:'~6.5 hrs', icon:'🏙️', highlights:['Burj Khalifa','Dubai Mall','Dune bashing','Dubai Fountain'] },
  China:       { name:'ปักกิ่ง, จีน',           temp:'10°C 🌤️', desc:'อากาศดี แห้ง',    img:'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80', currency:'CNY', rateUnit:10,  rateLabel:'10 CNY',  badge:'🇨🇳 China',  days:'8',  budget:'25k–60k',    budgetLow:25000,  budgetHigh:60000,  lang:'Mandarin',   season:'Apr–Jun', visa:'🛂 China Visa', flight:'~4.5 hrs', icon:'🏯',  highlights:['Great Wall of China','Forbidden City','Peking Duck','Hutong walk'] },
  Germany:     { name:'เบอร์ลิน, เยอรมนี',      temp:'8°C 🌥️',  desc:'เย็น มีเมฆ',      img:'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80', currency:'EUR', rateUnit:1,   rateLabel:'1 EUR',   badge:'🇩🇪 Germany', days:'7', budget:'50k–110k',   budgetLow:50000,  budgetHigh:110000, lang:'German',     season:'Jun–Aug', visa:'🛂 Schengen', flight:'~11 hrs',  icon:'🍺',  highlights:['Brandenburg Gate','Black Forest','Bavarian castles','Oktoberfest','Berlin Wall'] },
  India:       { name:'มุมไบ, อินเดีย',          temp:'32°C ☀️', desc:'ร้อนชื้น',         img:'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80', currency:'INR', rateUnit:100, rateLabel:'100 INR', badge:'🇮🇳 India',  days:'9',  budget:'15k–40k',    budgetLow:15000,  budgetHigh:40000,  lang:'Hindi/English',season:'Oct–Mar',visa:'✅ eVisa',      flight:'~3.5 hrs', icon:'🕌',  highlights:['Taj Mahal','Jaipur Pink City','Goa beaches','Street food tour'] },
  Indonesia:   { name:'บาหลี, อินโดนีเซีย',     temp:'30°C 🌦️', desc:'ร้อนชื้น ฝนบาง',  img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', currency:'IDR', rateUnit:10000,rateLabel:'10,000 IDR',badge:'🇮🇩 Indonesia', days:'7',budget:'15k–40k',   budgetLow:15000,  budgetHigh:40000,  lang:'Indonesian', season:'Apr–Oct', visa:'✅ Visa-free 30d', flight:'~3 hrs',   icon:'🌺',  highlights:['Ubud rice terraces','Tanah Lot','Komodo Island','Seminyak beach'] },
  Spain:       { name:'มาดริด, สเปน',            temp:'18°C ☀️', desc:'อากาศดี แจ่มใส',  img:'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80', currency:'EUR', rateUnit:1,   rateLabel:'1 EUR',   badge:'🇪🇸 Spain',  days:'8',  budget:'45k–100k',   budgetLow:45000,  budgetHigh:100000, lang:'Spanish',    season:'Apr–Jun', visa:'🛂 Schengen', flight:'~12 hrs',  icon:'💃',  highlights:['Sagrada Familia','Flamenco show','La Tomatina','Paella','Alhambra'] },
  Turkey:      { name:'อิสตันบูล, ตุรกี',        temp:'15°C 🌤️', desc:'อากาศดี',          img:'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80', currency:'TRY', rateUnit:100, rateLabel:'100 TRY', badge:'🇹🇷 Turkey',  days:'7',  budget:'20k–50k',    budgetLow:20000,  budgetHigh:50000,  lang:'Turkish',    season:'Apr–Jun', visa:'✅ eVisa',      flight:'~9 hrs',   icon:'🕌',  highlights:['Hagia Sophia','Cappadocia balloon','Grand Bazaar','Turkish tea','Bosphorus cruise'] },
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
]

const FLIGHT_TIMES = {
  BKK: {Japan:'~7h',France:'~11h',Thailand:'local',SouthKorea:'~5.5h',USA:'~17h',UK:'~12h',Italy:'~11h',Switzerland:'~11.5h',Taiwan:'~3.5h',UAE:'~6.5h',Singapore:'~2.5h',Vietnam:'~2h',Maldives:'~3h',Australia:'~9.5h',China:'~4.5h',Germany:'~11h',India:'~3.5h',Indonesia:'~3h',Spain:'~12h',Turkey:'~9h'},
  SIN: {Japan:'~7h',France:'~13h',Thailand:'~2.5h',SouthKorea:'~6.5h',USA:'~18h',UK:'~13h',Italy:'~13h',Switzerland:'~13h',Taiwan:'~4.5h',UAE:'~7h',Singapore:'local',Vietnam:'~2h',Maldives:'~4.5h',Australia:'~8h',China:'~5h',Germany:'~12h',India:'~4h',Indonesia:'~1.5h',Spain:'~13h',Turkey:'~10h'},
  KUL: {Japan:'~7h',France:'~12.5h',Thailand:'~2h',SouthKorea:'~6h',USA:'~19h',UK:'~13h',Italy:'~12h',Switzerland:'~12h',Taiwan:'~4h',UAE:'~7h',Singapore:'~1h',Vietnam:'~2h',Maldives:'~4h',Australia:'~8h',China:'~4.5h',Germany:'~12h',India:'~3.5h',Indonesia:'~1h',Spain:'~13h',Turkey:'~10h'},
  DXB: {Japan:'~9h',France:'~7h',Thailand:'~6.5h',SouthKorea:'~8.5h',USA:'~14h',UK:'~7h',Italy:'~6.5h',Switzerland:'~6.5h',Taiwan:'~8h',UAE:'local',Singapore:'~7h',Vietnam:'~6h',Maldives:'~4h',Australia:'~13h',China:'~8.5h',Germany:'~6.5h',India:'~3h',Indonesia:'~8h',Spain:'~7.5h',Turkey:'~4h'},
  LHR: {Japan:'~12h',France:'~1.5h',Thailand:'~12h',SouthKorea:'~11h',USA:'~8h',UK:'local',Italy:'~2.5h',Switzerland:'~2h',Taiwan:'~13h',UAE:'~7h',Singapore:'~13h',Vietnam:'~12h',Maldives:'~11h',Australia:'~22h',China:'~10h',Germany:'~2h',India:'~9h',Indonesia:'~14h',Spain:'~2.5h',Turkey:'~4h'},
  CDG: {Japan:'~12h',France:'local',Thailand:'~11h',SouthKorea:'~11h',USA:'~8h',UK:'~1.5h',Italy:'~2h',Switzerland:'~1.5h',Taiwan:'~13h',UAE:'~7h',Singapore:'~13h',Vietnam:'~12h',Maldives:'~11h',Australia:'~23h',China:'~10h',Germany:'~1.5h',India:'~9h',Indonesia:'~14h',Spain:'~2h',Turkey:'~3.5h'},
  FRA: {Japan:'~11.5h',France:'~1.5h',Thailand:'~11h',SouthKorea:'~10.5h',USA:'~9h',UK:'~2h',Italy:'~2h',Switzerland:'~1h',Taiwan:'~12h',UAE:'~6.5h',Singapore:'~12h',Vietnam:'~11h',Maldives:'~10h',Australia:'~21h',China:'~9.5h',Germany:'local',India:'~8.5h',Indonesia:'~13h',Spain:'~2.5h',Turkey:'~3.5h'},
  JFK: {Japan:'~14h',France:'~7.5h',Thailand:'~17h',SouthKorea:'~14.5h',USA:'local',UK:'~7h',Italy:'~9h',Switzerland:'~9h',Taiwan:'~16h',UAE:'~12h',Singapore:'~18h',Vietnam:'~18h',Maldives:'~20h',Australia:'~21h',China:'~14h',Germany:'~8.5h',India:'~15h',Indonesia:'~19h',Spain:'~8h',Turkey:'~10h'},
  LAX: {Japan:'~11h',France:'~11h',Thailand:'~20h',SouthKorea:'~12h',USA:'local',UK:'~10h',Italy:'~12h',Switzerland:'~12h',Taiwan:'~13h',UAE:'~16h',Singapore:'~17h',Vietnam:'~20h',Maldives:'~23h',Australia:'~16h',China:'~12h',Germany:'~11h',India:'~17h',Indonesia:'~18h',Spain:'~11.5h',Turkey:'~13h'},
  NRT: {Japan:'local',France:'~12h',Thailand:'~7h',SouthKorea:'~2h',USA:'~12h',UK:'~12h',Italy:'~12.5h',Switzerland:'~12.5h',Taiwan:'~3h',UAE:'~10h',Singapore:'~7h',Vietnam:'~5h',Maldives:'~9h',Australia:'~10h',China:'~3h',Germany:'~11.5h',India:'~8.5h',Indonesia:'~7h',Spain:'~13h',Turkey:'~11h'},
  ICN: {Japan:'~2h',France:'~11.5h',Thailand:'~5.5h',SouthKorea:'local',USA:'~13h',UK:'~11h',Italy:'~11h',Switzerland:'~11.5h',Taiwan:'~2.5h',UAE:'~9h',Singapore:'~6.5h',Vietnam:'~4.5h',Maldives:'~8.5h',Australia:'~10h',China:'~1.5h',Germany:'~11h',India:'~8.5h',Indonesia:'~7h',Spain:'~12h',Turkey:'~10h'},
  SYD: {Japan:'~10h',France:'~23h',Thailand:'~9h',SouthKorea:'~10h',USA:'~15h',UK:'~22h',Italy:'~22h',Switzerland:'~22h',Taiwan:'~9h',UAE:'~13.5h',Singapore:'~8h',Vietnam:'~8.5h',Maldives:'~12h',Australia:'local',China:'~11h',Germany:'~22h',India:'~12h',Indonesia:'~6h',Spain:'~23h',Turkey:'~18h'},
  BOM: {Japan:'~8.5h',France:'~9h',Thailand:'~3.5h',SouthKorea:'~8.5h',USA:'~16h',UK:'~9h',Italy:'~8.5h',Switzerland:'~8.5h',Taiwan:'~5h',UAE:'~3h',Singapore:'~4h',Vietnam:'~5h',Maldives:'~2h',Australia:'~12h',China:'~5.5h',Germany:'~9h',India:'local',Indonesia:'~5h',Spain:'~10h',Turkey:'~6h'},
  HKG: {Japan:'~4h',France:'~12h',Thailand:'~2.5h',SouthKorea:'~3.5h',USA:'~15h',UK:'~12h',Italy:'~12h',Switzerland:'~12h',Taiwan:'~1.5h',UAE:'~8h',Singapore:'~3.5h',Vietnam:'~2h',Maldives:'~6h',Australia:'~9h',China:'~3h',Germany:'~11.5h',India:'~5h',Indonesia:'~4h',Spain:'~13h',Turkey:'~11h'},
  PEK: {Japan:'~3h',France:'~10.5h',Thailand:'~4.5h',SouthKorea:'~1.5h',USA:'~13h',UK:'~10h',Italy:'~10h',Switzerland:'~10h',Taiwan:'~3h',UAE:'~8.5h',Singapore:'~5h',Vietnam:'~3.5h',Maldives:'~7h',Australia:'~11h',China:'local',Germany:'~10h',India:'~5h',Indonesia:'~6h',Spain:'~11h',Turkey:'~9.5h'},
}

const STATIC_USD_RATES = { USD:1,EUR:0.92,GBP:0.79,JPY:149.8,CHF:0.90,AUD:1.57,CAD:1.38,SGD:1.35,HKD:7.78,CNY:7.27,KRW:1360,TWD:32.5,THB:34.8,VND:25100,IDR:15900,MYR:4.70,INR:83.2,AED:3.673,TRY:32.0,MVR:15.42 }
const currencies = ['THB','USD','EUR','GBP','JPY','KRW','SGD','AUD','CHF','CNY','HKD','TWD','VND','AED','MVR','IDR','INR','TRY','CAD','MYR']

const LS_DB = 'travelaroha_dashboard'
function loadDB(key, def) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def } catch(e) { return def }
}
function saveDB(key, val) { try { localStorage.setItem(key, JSON.stringify(val)) } catch(e) {} }

const selectedKey    = ref(loadDB(LS_DB + '_country', 'Japan'))
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
const currentI18n = computed(() => {
  const c = DB_COUNTRIES[selectedKey.value]
  if (!c) return null
  const l = lang.value
  return {
    name:       c.name?.[l]       || c.name?.['en'],
    desc:       c.desc?.[l]       || c.desc?.['en'],
    lang:       c.lang?.[l]       || c.lang?.['en'],
    season:     c.season?.[l]     || c.season?.['en'],
    flight:     c.flight?.[l]     || c.flight?.['en'],
    highlights: c.highlights?.[l] || c.highlights?.['en'],
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
  return [
    { key: 'db_hotel',      amount: `${sign}${fmt(total * hotelPct)}` },
    { key: 'db_food',       amount: `${sign}${fmt(total * foodPct)}` },
    { key: 'db_transport',  amount: `${sign}${fmt(total * transPct)}` },
    { key: 'db_activities', amount: `${sign}${fmt(total * actPct)}` },
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
</script>

<style scoped>
.counter-btn {
  @apply w-8 h-8 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400
         bg-teal-100/50 dark:bg-teal-900/30 border border-teal-200/50 dark:border-teal-800
         hover:bg-teal-200 dark:hover:bg-teal-900/60 transition-colors font-bold text-xl cursor-pointer select-none;
}
</style>