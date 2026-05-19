import { ref, computed, watch } from 'vue'

// Global language state shared across all components
export const lang = ref('th')
export function useLang() { return { lang } }

export const CATEGORIES = [
  { id: 'food',      label: 'Food & Drink', labelTh: 'อาหาร & เครื่องดื่ม', svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>', color: '#F59E0B' },
  { id: 'hotel',     label: 'Hotel',        labelTh: 'ที่พัก',               svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', color: '#A78BFA' },
  { id: 'transport', label: 'Transport',    labelTh: 'การเดินทาง',           svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>', color: '#38BDF8' },
  { id: 'activity',  label: 'Activity',     labelTh: 'กิจกรรม',             svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', color: '#34D399' },
  { id: 'shopping',  label: 'Shopping',     labelTh: 'ช้อปปิ้ง',            svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', color: '#FB7185' },
  { id: 'other',     label: 'Other',        labelTh: 'อื่นๆ',               svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>', color: '#94A3B8' },
]

export const CURRENCIES = [
  { code: 'THB', symbol: '฿',   name: 'Thai Baht',         nameTh: 'บาทไทย' },
  { code: 'USD', symbol: '$',   name: 'US Dollar',         nameTh: 'ดอลลาร์สหรัฐ' },
  { code: 'EUR', symbol: '€',   name: 'Euro',              nameTh: 'ยูโร' },
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen',      nameTh: 'เยนญี่ปุ่น' },
  { code: 'GBP', symbol: '£',   name: 'British Pound',     nameTh: 'ปอนด์อังกฤษ' },
  { code: 'SGD', symbol: 'S$',  name: 'Singapore Dollar',  nameTh: 'ดอลลาร์สิงคโปร์' },
  { code: 'KRW', symbol: '₩',   name: 'Korean Won',        nameTh: 'วอนเกาหลี' },
  { code: 'CNY', symbol: '¥',   name: 'Chinese Yuan',      nameTh: 'หยวนจีน' },
  { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar', nameTh: 'ดอลลาร์ออสเตรเลีย' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar',  nameTh: 'ดอลลาร์ฮ่องกง' },
]

const DEFAULT_RATES_TO_THB = {
  THB: 1, USD: 35.5, EUR: 38.5, JPY: 0.235,
  GBP: 44.8, SGD: 26.2, KRW: 0.026, CNY: 4.9,
  AUD: 23.1, HKD: 4.55,
}

const COLORS = [
  '#F59E0B','#A78BFA','#34D399','#FB7185',
  '#38BDF8','#F472B6','#4ADE80','#FACC15',
]

let _colorIdx = 0
let _pid = 0, _eid = 0, _tid = 0

// ── Persist ──────────────────────────────────────────────────────
function load() {
  try { const r = localStorage.getItem('triptab_v4'); if (r) return JSON.parse(r) } catch {}
  return null
}
function save(data) {
  try { localStorage.setItem('triptab_v4', JSON.stringify(data)) } catch {}
}

const saved = load()
const trips = ref(saved?.trips ?? [])
const activeTripId = ref(saved?.activeTripId ?? null)
const undoStack = ref([])
const redoStack = ref([])

watch([trips, activeTripId], () => {
  save({ trips: trips.value, activeTripId: activeTripId.value })
}, { deep: true })

function snapshot() {
  undoStack.value.push(JSON.stringify({ trips: trips.value, activeTripId: activeTripId.value }))
  if (undoStack.value.length > 50) undoStack.value.shift()
  redoStack.value = []
}

// ── Derived ──────────────────────────────────────────────────────
const activeTrip   = computed(() => trips.value.find(t => t.id === activeTripId.value) ?? null)
const participants = computed(() => activeTrip.value?.participants ?? [])
const expenses     = computed(() => activeTrip.value?.expenses ?? [])
const baseCurrency = computed(() => activeTrip.value?.baseCurrency ?? 'THB')
const customRates  = computed(() => activeTrip.value?.rates ?? {})

function getRate(code) {
  return customRates.value[code] ?? DEFAULT_RATES_TO_THB[code] ?? 1
}
function toBase(amount, currency) {
  const base = baseCurrency.value
  if (currency === base) return parseFloat(amount)
  const inTHB = parseFloat(amount) * getRate(currency)
  return inTHB / getRate(base)
}

// ── Trip API ─────────────────────────────────────────────────────
export function useTrips() {
  function createTrip(name, currency = 'THB') {
    snapshot()
    const trip = { id: ++_tid, name: name.trim() || 'New Trip', baseCurrency: currency,
      rates: {}, participants: [], expenses: [], createdAt: Date.now() }
    trips.value.push(trip)
    activeTripId.value = trip.id
    _colorIdx = 0; _pid = 0; _eid = 0
    return trip.id
  }
  function deleteTrip(id) {
    snapshot()
    trips.value = trips.value.filter(t => t.id !== id)
    if (activeTripId.value === id)
      activeTripId.value = trips.value[trips.value.length - 1]?.id ?? null
  }
  function renameTrip(id, name) {
    snapshot()
    const t = trips.value.find(t => t.id === id)
    if (t && name.trim()) t.name = name.trim()
  }
  function setActiveTrip(id) { activeTripId.value = id }
  function updateRate(code, rate) {
    const t = activeTrip.value; if (!t) return
    if (!t.rates) t.rates = {}
    t.rates[code] = parseFloat(rate) || DEFAULT_RATES_TO_THB[code]
  }
  function undo() {
    if (!undoStack.value.length) return
    redoStack.value.push(JSON.stringify({ trips: trips.value, activeTripId: activeTripId.value }))
    const prev = JSON.parse(undoStack.value.pop())
    trips.value = prev.trips; activeTripId.value = prev.activeTripId
  }
  function redo() {
    if (!redoStack.value.length) return
    undoStack.value.push(JSON.stringify({ trips: trips.value, activeTripId: activeTripId.value }))
    const next = JSON.parse(redoStack.value.pop())
    trips.value = next.trips; activeTripId.value = next.activeTripId
  }
  function encodeTripToURL(tripId) {
    const trip = trips.value.find(t => t.id === tripId)
    if (!trip) return ''
    try {
      const data = btoa(unescape(encodeURIComponent(JSON.stringify(trip))))
      return `${window.location.origin}${window.location.pathname}?trip=${data}`
    } catch { return '' }
  }
  function importTripFromURL() {
    try {
      const encoded = new URLSearchParams(window.location.search).get('trip')
      if (!encoded) return false
      const trip = JSON.parse(decodeURIComponent(escape(atob(encoded))))
      trip.id = ++_tid
      trip.name = trip.name + ' (shared)'
      trips.value.push(trip)
      activeTripId.value = trip.id
      window.history.replaceState({}, '', window.location.pathname)
      return true
    } catch { return false }
  }
  return {
    trips, activeTrip, activeTripId, baseCurrency, getRate, toBase,
    createTrip, deleteTrip, renameTrip, setActiveTrip, updateRate,
    undo, redo,
    canUndo: computed(() => undoStack.value.length > 0),
    canRedo: computed(() => redoStack.value.length > 0),
    encodeTripToURL, importTripFromURL,
  }
}

// ── Expenses API ─────────────────────────────────────────────────
export function useExpenses() {
  function addParticipant(name) {
    name = name.trim()
    if (!name || !activeTrip.value) return false
    if (participants.value.find(p => p.name.toLowerCase() === name.toLowerCase())) return false
    snapshot()
    activeTrip.value.participants.push({ id: ++_pid, name, color: COLORS[_colorIdx++ % COLORS.length] })
    return true
  }
  function removeParticipant(id) {
    if (!activeTrip.value) return
    snapshot()
    activeTrip.value.participants = activeTrip.value.participants.filter(p => p.id !== id)
    activeTrip.value.expenses     = activeTrip.value.expenses.filter(e => e.paidBy !== id)
  }
  function getParticipant(id) { return participants.value.find(p => p.id === id) }

  function addExpense({ description, amount, paidBy, splitAmong, category = 'other', currency = null }) {
    if (!activeTrip.value) return
    snapshot()
    const cur = currency ?? baseCurrency.value
    activeTrip.value.expenses.push({
      id: ++_eid,
      description: description.trim(),
      amount: parseFloat(amount),
      currency: cur,
      amountBase: toBase(parseFloat(amount), cur),
      paidBy,
      splitAmong: [...splitAmong],
      category,
      date: Date.now(),
    })
  }
  function removeExpense(id) {
    if (!activeTrip.value) return
    snapshot()
    activeTrip.value.expenses = activeTrip.value.expenses.filter(e => e.id !== id)
  }

  const totalSpent = computed(() =>
    expenses.value.reduce((s, e) => s + (e.amountBase ?? e.amount), 0)
  )

  const categoryBreakdown = computed(() => {
    const map = {}
    for (const c of CATEGORIES) map[c.id] = 0
    for (const e of expenses.value) {
      const k = e.category ?? 'other'
      map[k] = (map[k] ?? 0) + (e.amountBase ?? e.amount)
    }
    return CATEGORIES.map(c => ({
      ...c,
      total: Math.round(map[c.id] * 100) / 100,
      pct:   totalSpent.value > 0 ? (map[c.id] / totalSpent.value * 100) : 0,
    })).filter(c => c.total > 0)
  })

  function getBalance(personId) {
    let bal = 0
    for (const exp of expenses.value) {
      const amt = exp.amountBase ?? exp.amount
      if (exp.paidBy === personId)           bal += amt
      if (exp.splitAmong.includes(personId)) bal -= amt / exp.splitAmong.length
    }
    return Math.round(bal * 100) / 100
  }

  const maxAbsBalance = computed(() => {
    const vals = participants.value.map(p => Math.abs(getBalance(p.id)))
    return Math.max(...vals, 1)
  })

  const settlements = computed(() => {
    if (participants.value.length < 2 || expenses.value.length === 0) return []
    const creditors = [], debtors = []
    for (const p of participants.value) {
      const bal = getBalance(p.id)
      if (bal >  0.01) creditors.push({ id: p.id, amount:  bal })
      if (bal < -0.01) debtors.push({   id: p.id, amount: -bal })
    }
    const result = []
    while (creditors.length && debtors.length) {
      creditors.sort((a, b) => b.amount - a.amount)
      debtors.sort((a, b) => b.amount - a.amount)
      const cr = creditors[0], db = debtors[0]
      const amt = Math.min(cr.amount, db.amount)
      result.push({ from: db.id, to: cr.id, amount: Math.round(amt * 100) / 100 })
      cr.amount = Math.round((cr.amount - amt) * 100) / 100
      db.amount = Math.round((db.amount - amt) * 100) / 100
      if (cr.amount < 0.01) creditors.shift()
      if (db.amount < 0.01) debtors.shift()
    }
    return result
  })

  function initials(name = '') {
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  function fmt(val, currency = null) {
    const cur = currency ?? baseCurrency.value
    const sym = CURRENCIES.find(c => c.code === cur)?.symbol ?? cur
    return sym + (Math.round((val || 0) * 100) / 100).toFixed(2)
  }

  return {
    participants, expenses, totalSpent, settlements, maxAbsBalance,
    baseCurrency, categoryBreakdown,
    addParticipant, removeParticipant, getParticipant,
    addExpense, removeExpense, getBalance,
    initials, fmt, toBase,
  }
}
