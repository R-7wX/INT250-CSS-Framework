<template>
  <div class="app-shell" :class="{ light: !isDark }">

    <!-- ══ SIDEBAR ══ -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-logo-wrap">
          <img src="/logo.png" alt="TripTab Logo" class="brand-logo" />
        </div>
        <div>
          <p class="brand-name font-display">Trip<span class="text-gradient-amber">Tab</span></p>
          <p class="brand-sub">{{ lang === 'th' ? 'หารค่าใช้จ่าย ไม่เสียเพื่อน' : 'Split expenses, keep friends' }}</p>
        </div>
      </div>

      <!-- Trip Manager (inside sidebar) -->
      <div class="px-3 pt-3 pb-1">
        <TripManager />
      </div>

      <nav class="sidebar-nav" v-if="activeTrip">
        <button v-for="item in navItems" :key="item.id"
          class="nav-item" :class="{ active: activeTab === item.id }"
          @click="activeTab = item.id">
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.id === 'travelers' && participants.length > 0"  class="nav-badge nav-badge-violet">{{ participants.length }}</span>
          <span v-if="item.id === 'list'       && expenses.length > 0"     class="nav-badge nav-badge-amber">{{ expenses.length }}</span>
          <span v-if="item.id === 'settlement' && settlements.length > 0"  class="nav-badge nav-badge-emerald">{{ settlements.length }}</span>
        </button>
      </nav>

      <div class="sidebar-footer" v-if="activeTrip">
        <div class="footer-stat">
          <span class="footer-label">{{ lang === 'th' ? 'นักเดินทาง' : 'Travelers' }}</span>
          <span class="footer-val text-gradient-violet">{{ participants.length }}</span>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-stat">
          <span class="footer-label">{{ lang === 'th' ? 'ยอดรวม' : 'Total Spent' }}</span>
          <span class="footer-val text-gradient-amber">{{ fmt(totalSpent) }}</span>
        </div>
      </div>
    </aside>

    <!-- ══ MAIN ══ -->
    <div class="main-wrapper">

      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <div class="mobile-brand">
            <img src="/logo.png" alt="Logo" class="mobile-logo" />
            <span class="font-display mobile-brand-name">Trip<span class="text-gradient-amber">Tab</span></span>
          </div>
          <div class="desktop-title">
            <h2 class="topbar-title">{{ currentItem?.label ?? 'TripTab' }}</h2>
            <p class="topbar-desc">{{ currentItem?.desc ?? 'Select or create a trip' }}</p>
          </div>
        </div>
        <div class="topbar-right">
          <div class="search-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input placeholder="Search…" class="search-input" v-model="searchQ" />
          </div>
          <button class="theme-toggle" @click="lang = lang === 'en' ? 'th' : 'en'" :title="lang === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'" style="font-size:11px;font-weight:700;letter-spacing:0.03em;min-width:32px">
            {{ lang === 'th' ? 'EN' : 'TH' }}
          </button>
          <button class="theme-toggle" @click="isDark = !isDark">
            <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <button v-if="activeTrip" class="btn-primary add-btn-desktop" @click="activeTab = 'add'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            {{ lang === 'th' ? 'เพิ่มรายจ่าย' : 'Add Expense' }}
          </button>
          <button v-if="activeTrip" class="btn-primary add-btn-mobile" @click="activeTab = 'add'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- No trip selected -->
      <div v-if="!activeTrip" class="no-trip-screen">
        <div class="no-trip-card">
          <div class="no-trip-logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h2 class="no-trip-title font-display">{{ lang === 'th' ? 'ยินดีต้อนรับสู่ Trip' : 'Welcome to Trip' }}<span class="text-gradient-amber">Tab</span></h2>
          <p class="no-trip-sub">{{ lang === 'th' ? 'สร้างทริปแรกของคุณเพื่อเริ่มหารค่าใช้จ่ายกับเพื่อน' : 'Create your first trip to start splitting expenses with friends.' }}</p>
          <button class="btn-primary" style="margin-top:20px" @click="showCreateFirst = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            {{ lang === 'th' ? 'สร้างทริป' : 'Create a Trip' }}
          </button>
          <div v-if="showCreateFirst" class="first-trip-form">
            <input v-model="firstTripName" :placeholder="lang === 'th' ? 'ชื่อทริป (เช่น ญี่ปุ่น 2025)' : 'Trip name (e.g. Japan 2025)'" />
            <select v-model="firstTripCur" class="mt-2">
              <option v-for="c in CURRENCIES" :key="c.code" :value="c.code">{{ c.code }} — {{ lang === 'th' ? c.nameTh : c.name }}</option>
            </select>
            <button class="btn-primary w-full justify-center mt-3" @click="handleFirstTrip">{{ lang === 'th' ? 'เริ่มเลย →' : "Let's go →" }}</button>
          </div>
        </div>
      </div>

      <div v-else class="content-grid">
        <div class="content-main">

          <!-- ── Dashboard ── -->
          <template v-if="activeTab === 'dashboard'">
            <p class="panel-heading">Overview</p>
            <div class="overview-tiles">
              <div class="tile tile-amber">
                <p class="tile-label">{{ lang === 'th' ? 'ยอดรวม' : 'Total Spent' }}</p>
                <p class="tile-val">{{ fmt(totalSpent) }}</p>
                <p class="tile-sub">{{ expenses.length }} {{ lang === 'th' ? 'รายการ' : (expenses.length !== 1 ? 'expenses' : 'expense') }}</p>
              </div>
              <div class="tile tile-violet">
                <p class="tile-label">{{ lang === 'th' ? 'นักเดินทาง' : 'Travelers' }}</p>
                <p class="tile-val">{{ participants.length }}</p>
                <p class="tile-sub">{{ participants.length > 0 ? (lang === 'th' ? 'ในทริปนี้' : 'on this trip') : (lang === 'th' ? 'เพิ่มสมาชิก' : 'add someone') }}</p>
              </div>
              <div class="tile tile-emerald">
                <p class="tile-label">{{ lang === 'th' ? 'การชำระ' : 'Settlements' }}</p>
                <p class="tile-val">{{ settlements.length }}</p>
                <p class="tile-sub">{{ settlements.length === 0 ? (lang === 'th' ? 'เคลียร์แล้ว ✓' : 'all settled ✓') : (lang === 'th' ? `ยังค้างอยู่ ${settlements.length} รายการ` : 'payment' + (settlements.length > 1 ? 's' : '') + ' left') }}</p>
              </div>
              <div class="tile tile-rose">
                <p class="tile-label">{{ lang === 'th' ? 'เฉลี่ย/คน' : 'Per Person' }}</p>
                <p class="tile-val">{{ participants.length > 0 ? fmt(totalSpent / participants.length) : fmt(0) }}</p>
                <p class="tile-sub">{{ lang === 'th' ? 'ค่าเฉลี่ย' : 'average share' }}</p>
              </div>
            </div>

            <!-- Category chart on dashboard -->
            <CategoryChart />

            <div class="overview-section">
              <p class="overview-section-title">{{ lang === 'th' ? 'ผู้จ่ายสูงสุด' : 'Top Payers' }}</p>
              <div v-if="participants.length === 0" class="overview-empty">{{ lang === 'th' ? 'เพิ่มนักเดินทางเพื่อดูสถิติ' : 'Add travelers to see payer breakdown' }}</div>
              <div v-else class="top-payers">
                <div v-for="p in topPayers" :key="p.id" class="payer-row">
                  <div class="badge-sm" :style="{ background: p.color + '28', color: p.color }">{{ initials(p.name) }}</div>
                  <span class="payer-name">{{ p.name }}</span>
                  <div class="payer-bar-track">
                    <div class="payer-bar-fill" :style="{ width: p.pct + '%', background: p.color }"></div>
                  </div>
                  <span class="payer-amt" :style="{ color: p.color }">{{ fmt(p.paid) }}</span>
                </div>
              </div>
            </div>

            <div class="overview-section">
              <div class="overview-section-header">
                <p class="overview-section-title" style="margin-bottom:0">{{ lang === 'th' ? 'รายจ่ายล่าสุด' : 'Recent Expenses' }}</p>
                <button v-if="expenses.length > 3" class="view-all-btn" @click="activeTab = 'list'">{{ lang === 'th' ? 'ดูทั้งหมด →' : 'View all →' }}</button>
              </div>
              <div v-if="expenses.length === 0" class="overview-empty">{{ lang === 'th' ? 'ยังไม่มีรายจ่าย — กด "เพิ่มรายจ่าย" เพื่อเริ่ม' : 'No expenses yet — click "Add Expense" to start' }}</div>
              <div v-else class="expense-cards" style="margin-top:12px">
                <div v-for="exp in [...expenses].reverse().slice(0,3)" :key="exp.id" class="exp-card fade-in">
                  <div class="exp-card-top">
                    <div>
                      <p class="exp-card-title">{{ exp.description }}</p>
                      <p class="exp-card-meta">{{ lang === 'th' ? 'จ่ายโดย' : 'Paid by' }}
                        <span :style="{ color: getParticipant(exp.paidBy)?.color }">{{ getParticipant(exp.paidBy)?.name }}</span>
                        · {{ lang === 'th' ? `หาร ${exp.splitAmong.length} คน` : `split among ${exp.splitAmong.length}` }}
                      </p>
                    </div>
                    <div class="exp-card-amount">{{ exp.currency !== baseCurrency ? fmt(exp.amount, exp.currency) : fmt(exp.amount) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else-if="activeTab === 'travelers'"><ParticipantsPanel /></template>
          <template v-else-if="activeTab === 'add'"><ExpenseForm /></template>
          <template v-else-if="activeTab === 'list'">
            <ExpenseList />
          </template>
          <template v-else-if="activeTab === 'settlement'"><SettlementSummary /></template>
          <template v-else-if="activeTab === 'currency'"><CurrencySettings /></template>
          <template v-else-if="activeTab === 'share'">
            <div class="flex flex-col gap-4">
              <SharePanel />
              <ExportPanel />
            </div>
          </template>

          <!-- Mobile stats -->
          <div class="mobile-stats-panel">
            <div class="stats-card">
              <p class="section-label">{{ lang === 'th' ? 'ยอดรวมทริป' : 'Trip Total' }}</p>
              <p class="stats-big-val">{{ fmt(totalSpent) }}</p>
              <div class="stats-avatars">
                <div v-for="p in participants.slice(0,6)" :key="p.id" class="badge-sm"
                     :style="{ background: p.color + '28', color: p.color }">{{ initials(p.name) }}</div>
                <span v-if="participants.length > 6" class="more-badge">+{{ participants.length - 6 }}</span>
              </div>
            </div>
            <div class="balance-card">
              <p class="section-label">{{ lang === 'th' ? 'ยอดคงเหลือ' : 'Balance' }}</p>
              <div v-if="participants.length === 0" class="empty-balance">{{ lang === 'th' ? 'เพิ่มนักเดินทางเพื่อดูยอดคงเหลือ' : 'Add travelers to see balances' }}</div>
              <div v-else class="balance-list">
                <div v-for="p in participants" :key="p.id" class="balance-row">
                  <div class="badge-sm" :style="{ background: p.color + '28', color: p.color }">{{ initials(p.name) }}</div>
                  <span class="balance-name">{{ p.name }}</span>
                  <div class="bar-mini-track">
                    <div class="bar-mini-fill" :style="{
                      width: pct(p.id),
                      background: getBalance(p.id) >= 0 ? 'linear-gradient(90deg,#34D399,#10B981)' : 'linear-gradient(90deg,#F43F5E,#FB7185)',
                    }" />
                  </div>
                  <span class="balance-val" :class="getBalance(p.id) >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                    {{ getBalance(p.id) >= 0 ? '+' : '' }}{{ fmt(getBalance(p.id)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right sidebar (desktop) -->
        <div class="content-sidebar">
          <div class="stats-card">
            <p class="section-label">{{ lang === 'th' ? 'ยอดรวมทริป' : 'Trip Total' }}</p>
            <p class="stats-big-val">{{ fmt(totalSpent) }}</p>
            <div class="stats-avatars">
              <div v-for="p in participants.slice(0,6)" :key="p.id" class="badge-sm"
                   :style="{ background: p.color + '28', color: p.color }">{{ initials(p.name) }}</div>
              <span v-if="participants.length > 6" class="more-badge">+{{ participants.length - 6 }}</span>
            </div>
          </div>

          <div class="balance-card">
            <p class="section-label">{{ lang === 'th' ? 'ยอดคงเหลือ' : 'Balance' }}</p>
            <div v-if="participants.length === 0" class="empty-balance">{{ lang === 'th' ? 'เพิ่มนักเดินทางเพื่อดูยอดคงเหลือ' : 'Add travelers to see balances' }}</div>
            <div v-else class="balance-list">
              <div v-for="p in participants" :key="p.id" class="balance-row">
                <div class="badge-sm" :style="{ background: p.color + '28', color: p.color }">{{ initials(p.name) }}</div>
                <span class="balance-name">{{ p.name }}</span>
                <div class="bar-mini-track">
                  <div class="bar-mini-fill" :style="{
                    width: pct(p.id),
                    background: getBalance(p.id) >= 0 ? 'linear-gradient(90deg,#34D399,#10B981)' : 'linear-gradient(90deg,#F43F5E,#FB7185)',
                  }" />
                </div>
                <span class="balance-val" :class="getBalance(p.id) >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                  {{ getBalance(p.id) >= 0 ? '+' : '' }}{{ fmt(getBalance(p.id)) }}
                </span>
              </div>
            </div>
            <div class="balance-legend">
              <span class="legend-item"><span class="legend-dot" style="background:#34D399"></span> {{ lang === 'th' ? 'เครดิต' : 'Credit' }}</span>
              <span class="legend-item"><span class="legend-dot" style="background:#FB7185"></span> {{ lang === 'th' ? 'หนี้' : 'Debt' }}</span>
            </div>
            <div class="grad-bar-track"><div class="grad-bar-fill"></div></div>
          </div>

          <div class="settle-stat-card">
            <p class="section-label">{{ lang === 'th' ? 'การชำระที่ต้องทำ' : 'Payments Needed' }}</p>
            <div v-if="settlements.length === 0" class="settled-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ lang === 'th' ? 'เคลียร์หมดแล้ว!' : 'All settled up!' }}
            </div>
            <p v-else class="settle-count">{{ settlements.length }} {{ lang === 'th' ? 'รายการ' : ('payment' + (settlements.length > 1 ? 's' : '')) }}</p>
            <button v-if="settlements.length > 0" class="view-settle-btn" @click="activeTab = 'settlement'">{{ lang === 'th' ? 'ดูรายละเอียด →' : 'View details →' }}</button>
          </div>

          <!-- Export quick access -->
          <ExportPanel v-if="expenses.length > 0" />
        </div>
      </div>
    </div>

    <!-- ══ BOTTOM NAV (mobile) ══ -->
    <nav class="bottom-nav" v-if="activeTrip">
      <button v-for="item in navItems" :key="item.id"
        class="bottom-nav-item" :class="{ active: activeTab === item.id }"
        @click="activeTab = item.id">
        <span class="bottom-nav-icon" v-html="item.icon"></span>
        <span class="bottom-nav-label">{{ item.shortLabel }}</span>
        <span v-if="item.id === 'list' && expenses.length > 0" class="bottom-badge">{{ expenses.length }}</span>
        <span v-if="item.id === 'settlement' && settlements.length > 0" class="bottom-badge bottom-badge-emerald">{{ settlements.length }}</span>
      </button>
    </nav>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ParticipantsPanel from './components/ParticipantsPanel.vue'
import ExpenseForm       from './components/ExpenseForm.vue'
import ExpenseList       from './components/ExpenseList.vue'
import SettlementSummary from './components/SettlementSummary.vue'
import TripManager       from './components/TripManager.vue'
import CategoryChart     from './components/CategoryChart.vue'
import CurrencySettings  from './components/CurrencySettings.vue'
import SharePanel        from './components/SharePanel.vue'
import ExportPanel       from './components/ExportPanel.vue'
import { useExpenses, CURRENCIES, lang } from './composables/useExpenses.js'
import { useTrips }                from './composables/useExpenses.js'

const { participants, expenses, totalSpent, settlements, maxAbsBalance,
        getParticipant, getBalance, initials, fmt, baseCurrency } = useExpenses()
const { trips, activeTrip, createTrip, importTripFromURL, undo, canUndo } = useTrips()

const activeTab = ref('dashboard')
const isDark    = ref(true)
const searchQ   = ref('')
const showCreateFirst = ref(false)
const firstTripName   = ref('')
const firstTripCur    = ref('THB')

onMounted(() => {
  // Try import from URL on load
  importTripFromURL()
  // Keyboard shortcut Ctrl+Z
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault(); undo()
    }
  })
})

function handleFirstTrip() {
  if (!firstTripName.value.trim()) return
  createTrip(firstTripName.value, firstTripCur.value)
  showCreateFirst.value = false
  activeTab.value = 'travelers'
}

const navItems = computed(() => [
  { id: 'dashboard',  label: lang.value === 'th' ? 'แดชบอร์ด' : 'Dashboard',       shortLabel: lang.value === 'th' ? 'หน้าหลัก' : 'Home',    desc: lang.value === 'th' ? 'ภาพรวมทริป' : 'Overview of your trip',           icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>' },
  { id: 'travelers',  label: lang.value === 'th' ? 'นักเดินทาง' : 'Travelers',      shortLabel: lang.value === 'th' ? 'สมาชิก' : 'People',    desc: lang.value === 'th' ? 'จัดการสมาชิกทริป' : 'Manage trip participants',   icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { id: 'add',        label: lang.value === 'th' ? 'เพิ่มรายจ่าย' : 'Add Expense',  shortLabel: lang.value === 'th' ? 'เพิ่ม' : 'Add',         desc: lang.value === 'th' ? 'บันทึกรายจ่ายใหม่' : 'Record a new expense',       icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  { id: 'list',       label: lang.value === 'th' ? 'รายจ่าย' : 'Expenses',          shortLabel: lang.value === 'th' ? 'รายจ่าย' : 'Expenses',  desc: lang.value === 'th' ? 'รายจ่ายทั้งหมด' : 'All recorded expenses',       icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
  { id: 'settlement', label: lang.value === 'th' ? 'การชำระ' : 'Settlement',         shortLabel: lang.value === 'th' ? 'ชำระ' : 'Settle',       desc: lang.value === 'th' ? 'ใครจ่ายให้ใคร' : 'Who owes whom',               icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { id: 'currency',   label: lang.value === 'th' ? 'สกุลเงิน' : 'Currencies',        shortLabel: 'FX',                                           desc: lang.value === 'th' ? 'อัตราแลกเปลี่ยน' : 'Exchange rates & base currency', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  { id: 'share',      label: lang.value === 'th' ? 'แชร์ & ส่งออก' : 'Share & Export', shortLabel: lang.value === 'th' ? 'แชร์' : 'Share',      desc: lang.value === 'th' ? 'แชร์ QR หรือ PDF' : 'Share via QR or export PDF', icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' },
])

const currentItem = computed(() => navItems.value.find(n => n.id === activeTab.value) ?? navItems.value[0])

const topPayers = computed(() => {
  const maxPaid = Math.max(...participants.value.map(p =>
    expenses.value.filter(e => e.paidBy === p.id).reduce((s, e) => s + (e.amountBase ?? e.amount), 0)
  ), 1)
  return participants.value.map(p => {
    const paid = expenses.value.filter(e => e.paidBy === p.id).reduce((s, e) => s + (e.amountBase ?? e.amount), 0)
    return { ...p, paid, pct: (paid / maxPaid * 100).toFixed(1) }
  }).sort((a, b) => b.paid - a.paid)
})

function pct(id) {
  const abs = Math.abs(getBalance(id))
  return (abs / maxAbsBalance.value * 100).toFixed(1) + '%'
}
</script>
