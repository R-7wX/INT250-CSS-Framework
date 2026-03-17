import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const LS_LANG    = 'travelaroha_lang'
const LS_SAVED   = 'travelaroha_saved'
const LS_BOARD   = 'travelaroha_storyboard'
const LS_EXPORT  = 'travelaroha_export'
const LS_CHECK   = 'travelaroha_checklist'
const LS_TRIPNAME = 'travelaroha_tripname'
const LS_TRAVELDATE = 'travelaroha_traveldate'

export const useAppStore = defineStore('app', () => {
  // ── Language ──
  const SUPPORTED_LANGS = ['th', 'en', 'zh', 'es', 'ar', 'fr']
  function detectLang() {
    const saved = localStorage.getItem(LS_LANG)
    if (saved) return saved
    const browser = (navigator.language || navigator.userLanguage || 'en').split('-')[0].toLowerCase()
    return SUPPORTED_LANGS.includes(browser) ? browser : 'en'
  }
  const lang = ref(detectLang())
  watch(lang, v => localStorage.setItem(LS_LANG, v))

  // ── Dark mode ──
  const dark = ref(localStorage.getItem('theme') === 'dark')
  function applyDark(v) {
    if (v) document.documentElement.classList.add('dark')
    else   document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', v ? 'dark' : 'light')
  }
  function toggleDark(event) {
    const next = !dark.value
    if (!document.startViewTransition) { dark.value = next; return }

    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2
    const maxR = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    document.documentElement.style.setProperty('--vt-x', x + 'px')
    document.documentElement.style.setProperty('--vt-y', y + 'px')
    document.documentElement.style.setProperty('--vt-r', maxR + 'px')
    document.documentElement.dataset.vtDir = next ? 'to-dark' : 'to-light'

    const transition = document.startViewTransition(() => { dark.value = next })
    transition.finished.finally(() => delete document.documentElement.dataset.vtDir)
  }
  watch(dark, v => applyDark(v))
  applyDark(dark.value)

  // ── Toast ──
  const toasts = ref([])
  let toastId = 0
  const toastTimers = {}

  function showToast(msg, { type = 'success', duration = 2500, undoFn = null } = {}) {
    const id = ++toastId
    toasts.value.push({ id, msg, type, undoFn })
    toastTimers[id] = setTimeout(() => dismissToast(id), duration)
    return id
  }
  function dismissToast(id) {
    clearTimeout(toastTimers[id])
    delete toastTimers[id]
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // ── Saved places ──
  const savedPlaces = ref(
    JSON.parse(localStorage.getItem(LS_SAVED) || '[]')
  )
  watch(savedPlaces, v => localStorage.setItem(LS_SAVED, JSON.stringify(v)), { deep: true })

  function toggleSaved(name) {
    const idx = savedPlaces.value.indexOf(name)
    if (idx === -1) savedPlaces.value.push(name)
    else savedPlaces.value.splice(idx, 1)
  }
  function isSaved(name) {
    return savedPlaces.value.includes(name)
  }

  // ── Storyboard ──
  const boardData = ref(
    JSON.parse(localStorage.getItem(LS_BOARD) || 'null')
  )
  function saveBoard(data) {
    boardData.value = data
    localStorage.setItem(LS_BOARD, JSON.stringify(data))
  }
  function clearBoard() {
    boardData.value = null
    localStorage.removeItem(LS_BOARD)
  }

  // ── Export (storyboard → checklist) ──
  const exportData = ref(null)
  function setExport(data) {
    exportData.value = data
    localStorage.setItem(LS_EXPORT, JSON.stringify(data))
  }
  function loadExport() {
    const raw = localStorage.getItem(LS_EXPORT)
    if (raw) { try { exportData.value = JSON.parse(raw) } catch(e) {} }
  }
  function clearExport() {
    exportData.value = null
    localStorage.removeItem(LS_EXPORT)
  }

  // ── Checklist state ──
  const checkState = ref(
    JSON.parse(localStorage.getItem(LS_CHECK) || '{}')
  )
  watch(checkState, v => localStorage.setItem(LS_CHECK, JSON.stringify(v)), { deep: true })
  function setChecked(id, val) {
    checkState.value = { ...checkState.value, [id]: val }
  }
  function resetChecklist() {
    checkState.value = {}
  }

  // ── Confirm Modal ──
  const confirmModal = ref({ open: false, title: '', desc: '', confirmLabel: '', cancelLabel: '', danger: false, onConfirm: null })
  function showConfirm({ title, desc, confirmLabel, cancelLabel, danger = false, onConfirm }) {
    confirmModal.value = { open: true, title, desc, confirmLabel, cancelLabel, danger, onConfirm }
  }
  function closeConfirm() {
    confirmModal.value = { ...confirmModal.value, open: false, onConfirm: null }
  }

  // ── Onboarding ──
  const onboardingOpen = ref(false)
  function openOnboarding() { onboardingOpen.value = true }
  function closeOnboarding() { onboardingOpen.value = false }

  // ── Trip Name ──
  const tripName = ref(localStorage.getItem(LS_TRIPNAME) || '')
  watch(tripName, v => {
    if (v) localStorage.setItem(LS_TRIPNAME, v)
    else localStorage.removeItem(LS_TRIPNAME)
  })

  // ── Travel Date ──
  const travelDate = ref(localStorage.getItem(LS_TRAVELDATE) || '')
  watch(travelDate, v => {
    if (v) localStorage.setItem(LS_TRAVELDATE, v)
    else localStorage.removeItem(LS_TRAVELDATE)
  })

  function clearTripMeta() {
    tripName.value = ''
    travelDate.value = ''
    localStorage.removeItem(LS_TRIPNAME)
    localStorage.removeItem(LS_TRAVELDATE)
  }

  return {
    lang,
    dark, toggleDark,
    toasts, showToast, dismissToast,
    confirmModal, showConfirm, closeConfirm,
    onboardingOpen, openOnboarding, closeOnboarding,
    savedPlaces,
    toggleSaved,
    isSaved,
    boardData,
    saveBoard,
    clearBoard,
    exportData,
    setExport,
    loadExport,
    clearExport,
    checkState,
    setChecked,
    resetChecklist,
    tripName,
    travelDate,
    clearTripMeta,
  }
})