<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
    <!-- Hero -->
    <div class="text-center mb-8">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">{{ t('cl_title') }}</h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400 text-sm">{{ heroSub }}</p>
    </div>

    <!-- Itinerary section (if exported from storyboard) -->
    <div v-if="exportData && exportData.days?.length"
      class="glass-panel rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm mb-6"
    >
      <h2 class="font-bold text-base mb-1 text-slate-700 dark:text-slate-300">
        <span class="inline-flex items-center gap-1.5">
          <svg class="w-4 h-4 text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7"/></svg>
          {{ store.tripName ? store.tripName : t('cl_itin_label') }}
        </span>
      </h2>
      <p class="text-xs text-slate-400 mb-4">{{ itin_meta }}</p>

      <div class="space-y-3">
        <div v-for="day in exportData.days" :key="day.dayNum" class="bg-white/60 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
            <span class="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-bold text-sm flex items-center justify-center shrink-0">
              {{ day.dayNum }}
            </span>
            <span class="font-bold text-sm text-slate-700 dark:text-slate-300">
              {{ day.subtitle || `Day ${day.dayNum}` }}
              <span class="ml-2 text-xs font-normal text-slate-400">{{ day.places.length }} {{ t('cl_places') }}</span>
            </span>
          </div>

          <div v-if="day.places.length" class="divide-y divide-slate-50 dark:divide-slate-700/50">
            <div v-for="p in day.places" :key="p.name" class="px-4 py-2.5 flex items-center gap-3">
              <span class="text-sm flex-1 font-medium text-slate-700 dark:text-slate-300">{{ getPlaceName(p.name) }}</span>
              <span class="text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full shrink-0">
                {{ p.start }} – {{ p.end }}
              </span>
            </div>
          </div>
          <div v-else class="px-4 py-3 text-sm text-slate-400 italic">{{ t('cl_no_places') }}</div>
        </div>
      </div>
    </div>

    <!-- Packing progress -->
    <div class="glass-panel p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <span class="font-bold text-slate-700 dark:text-slate-300">{{ t('cl_packing') }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-teal-600 dark:text-teal-400">{{ checkedCount }} / {{ totalCount }}</span>
          <button @click="resetChecklist" class="text-xs text-slate-400 hover:text-rose-500 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-rose-300 bg-white/50 dark:bg-slate-800/50 transition-colors">
            {{ t('cl_reset') }}
          </button>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
      </div>
      <div v-if="progressPct >= 100" class="mt-3 text-center text-sm font-bold text-teal-600 dark:text-teal-400">
        {{ t('cl_done') }}
      </div>
    </div>

    <!-- Packing sections -->
    <!-- Vibe detected badge -->
    <Transition name="fade-in">
      <div v-if="vibeSections.length > 0" class="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800">
        <span class="flex gap-1 text-lg">
          <span v-for="sec in vibeSections" :key="sec.id">{{ sec.icon }}</span>
        </span>
        <div>
          <p class="text-xs font-bold text-teal-700 dark:text-teal-300">{{ t('cl_vibe_detected') }}</p>
          <p class="text-xs text-teal-600/70 dark:text-teal-400/70">{{ t('cl_vibe_hint') }}</p>
        </div>
      </div>
    </Transition>
    <div class="space-y-4 mb-6">
      <div v-for="section in allSections" :key="section.id"
        class="glass-panel rounded-3xl border p-5 shadow-sm transition-all duration-500"
        :class="sectionDone(section)
          ? 'border-teal-300 dark:border-teal-700 bg-teal-50/40 dark:bg-teal-900/10'
          : 'border-slate-200/60 dark:border-slate-700/60'"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold flex items-center gap-2 transition-colors duration-300"
            :class="sectionDone(section) ? 'text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'"
          >
            <span class="transition-transform duration-300" :class="sectionDone(section) ? 'scale-125' : ''">{{ section.icon }}</span>
            {{ t(section.titleKey) }}
          </h3>
          <span class="text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300"
            :class="sectionDone(section) ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'"
          >
            {{ sectionChecked(section) }}/{{ section.items.length }}
            <span v-if="sectionDone(section)"> ✓</span>
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <label
            v-for="itemId in section.items" :key="itemId"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all"
            :class="store.checkState[itemId]
              ? 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20'
              : 'border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800'"
          >
            <input
              type="checkbox"
              :checked="store.checkState[itemId]"
              @change="onCheckItem(section, itemId, $event.target.checked)"
              class="w-4 h-4 rounded accent-teal-500"
            />
            <span class="text-sm"
              :class="store.checkState[itemId] ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'"
            >
              {{ t(itemId) }}
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- All done confetti banner -->
    <Transition name="fade">
      <div v-if="showAllDone" class="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none">
        <div class="text-center pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-teal-200 dark:border-teal-700 mx-4">
          <div class="flex justify-center mb-3">
            <div class="w-16 h-16 rounded-2xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center animate-bounce">
              <svg class="w-9 h-9 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <h2 class="text-2xl font-extrabold text-teal-600 dark:text-teal-400 mb-1">{{ t('cl_all_done_title') }}</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-5">{{ t('cl_all_done_sub') }}</p>
          <button @click="showAllDone = false" class="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-bold transition-colors">
            {{ t('cl_all_done_btn') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Save plan section -->
    <div class="glass-panel p-6 rounded-3xl border border-teal-200 dark:border-teal-800 shadow-sm text-center space-y-4">
      <svg class="w-12 h-12 mx-auto text-teal-400 dark:text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="font-bold text-xl text-slate-800 dark:text-slate-200">{{ t('cl_save_title') }}</h3>
      <p class="text-sm text-slate-500 dark:text-slate-400">{{ t('cl_save_sub') }}</p>
      <div class="flex flex-col sm:flex-row justify-center gap-3 flex-wrap">
        <button @click="downloadPlan" class="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          {{ t('cl_download') }}
        </button>
        <RouterLink to="/storyboard" class="flex items-center justify-center gap-2 px-6 py-3 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 rounded-2xl font-medium hover:scale-105 transition-all">
          {{ t('cl_back') }}
        </RouterLink>
        <button @click="startNewPlan" class="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-medium hover:scale-105 transition-all">
          {{ t('cl_new_plan') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAppStore } from '../stores/useAppStore.js'
import { useI18n } from '../composables/useI18n.js'
import { CHECKLIST_SECTIONS, VIBE_SECTIONS } from '../data/checklist.js'
import { PLACE_NAMES, PLACES } from '../data/places.js'

const store = useAppStore()
const { t, lang } = useI18n()
const router = useRouter()

const exportData = computed(() => store.exportData)

onMounted(() => {
  store.loadExport()
})

// ── Detect ALL vibes in trip ─────────────────────────────────────────────
// Priority: places in exported storyboard → saved places
const detectedVibes = computed(() => {
  let placeNames = []

  // 1. from storyboard export
  if (exportData.value?.days?.length) {
    exportData.value.days.forEach(day => {
      day.places.forEach(p => placeNames.push(p.name))
    })
  }
  // 2. fallback: saved places
  if (placeNames.length === 0) {
    placeNames = store.savedPlaces
  }

  if (placeNames.length === 0) return []

  // Collect unique vibes ordered by frequency
  const counts = {}
  placeNames.forEach(name => {
    const place = PLACES.find(p => p.name === name)
    if (place?.vibe) counts[place.vibe] = (counts[place.vibe] || 0) + 1
  })

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([vibe]) => vibe)
    .filter(vibe => VIBE_SECTIONS[vibe])
})

const vibeSections = computed(() => detectedVibes.value.map(v => VIBE_SECTIONS[v]))

// All active sections = ALL vibe sections detected + base sections
const allSections = computed(() => {
  if (vibeSections.value.length > 0) return [...vibeSections.value, ...CHECKLIST_SECTIONS]
  return CHECKLIST_SECTIONS
})
// ─────────────────────────────────────────────────────────────────────────

const heroSub = computed(() => {
  if (!exportData.value) return t('cl_sub')
  const d = exportData.value
  const total = d.days?.reduce((s, day) => s + day.places.length, 0) || 0
  return `${d.days?.length || 0} ${t('cl_days')} · ${total} ${t('cl_places')}`
})

const itin_meta = computed(() => {
  const d = exportData.value
  if (!d) return ''
  const total = d.days?.reduce((s, day) => s + day.places.length, 0) || 0
  return `${d.days?.length} ${t('cl_days')} · ${total} ${t('cl_places')} · ${new Date(d.exportedAt).toLocaleDateString()}`
})

const totalCount = computed(() => allSections.value.reduce((s, sec) => s + sec.items.length, 0))
const checkedCount = computed(() => Object.values(store.checkState).filter(Boolean).length)
const progressPct = computed(() => totalCount.value > 0 ? Math.round(checkedCount.value / totalCount.value * 100) : 0)

function sectionChecked(section) { return section.items.filter(id => store.checkState[id]).length }
function sectionDone(section)    { return sectionChecked(section) === section.items.length }

const showAllDone = ref(false)
const prevAllDone = ref(progressPct.value >= 100)

function onCheckItem(section, itemId, val) {
  const wasSectionDone = sectionDone(section)
  store.setChecked(itemId, val)
  // Section just completed
  if (!wasSectionDone && sectionDone(section)) {
    store.showToast(`${t(section.titleKey)} ${t('cl_sec_done')}`, { type: 'success', duration: 2500 })
  }
  // All done
  if (!prevAllDone.value && progressPct.value >= 100) {
    setTimeout(() => { showAllDone.value = true }, 400)
  }
  prevAllDone.value = progressPct.value >= 100
}

function getPlaceName(thaiName) {
  if (lang.value === 'th') return thaiName
  const row = PLACE_NAMES[thaiName]
  if (!row) return thaiName
  return row[lang.value] || row['en'] || thaiName
}

function resetChecklist() {
  store.showConfirm({
    title: t('cl_reset_title'),
    desc:  t('cl_reset_desc'),
    confirmLabel: t('cl_reset_confirm_btn'),
    cancelLabel:  t('modal_cancel'),
    danger: true,
    onConfirm: () => store.resetChecklist()
  })
}

function startNewPlan() {
  store.clearBoard()
  store.clearExport()
  store.resetChecklist()
  store.clearTripMeta()
  router.push('/storyboard')
}

function downloadPlan() {
  const localeMap = { th: 'th-TH', en: 'en-US', zh: 'zh-CN', es: 'es-ES', ar: 'ar-SA', fr: 'fr-FR' }
  const locale = localeMap[lang.value] || 'en-US'
  const isRtl = lang.value === 'ar'
  const now = new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  const docTitle = store.tripName || t('plan_title')
  const logoB64 = 'data:image/png;base64,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'
  const plannedLabel  = { th:'วันที่วางแผน', en:'Planned on', zh:'计划于', es:'Planificado el', ar:'خُطِّط في', fr:'Planifié le' }[lang.value] || 'Planned on'
  const departLabel   = { th:'วันออกเดินทาง', en:'Departure', zh:'出发日期', es:'Fecha de salida', ar:'تاريخ المغادرة', fr:'Date de départ' }[lang.value] || 'Departure'
  const departDisplay = store.travelDate ? new Date(store.travelDate + 'T00:00:00').toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }) : '—'
  const planByPre = { th:'สร้างด้วย ', en:'Created with ', zh:'由 ', es:'Creado con ', ar:'أُنشئ بواسطة ', fr:'Créé avec ' }[lang.value] || 'Created with '
  const d = exportData.value

  let itineraryHtml = ''
  if (d?.days) {
    d.days.forEach(day => {
      itineraryHtml += `<div class="day-card"><div class="day-header"><div class="day-num">${day.dayNum}</div><div class="day-title">Day ${day.dayNum}${day.subtitle ? ': ' + day.subtitle : ''}</div></div>`
      if (day.places.length) {
        itineraryHtml += '<div class="places">'
        day.places.forEach(p => {
          itineraryHtml += `<div class="place-row"><div class="place-name">${getPlaceName(p.name)}</div><div class="place-time">${p.start} – ${p.end}</div></div>`
        })
        itineraryHtml += '</div>'
      }
      itineraryHtml += '</div>'
    })
  }

  let packingHtml = ''
  CHECKLIST_SECTIONS.forEach(sec => {
    const total = sec.items.length
    const checked = sec.items.filter(id => store.checkState[id]).length
    const pct = total ? Math.round((checked / total) * 100) : 0
    packingHtml += `<div class="section"><div class="section-header"><span class="section-title">${sec.icon} ${t(sec.titleKey)}</span><span class="badge">${checked}/${total}</span></div><div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div><div class="items">`
    sec.items.forEach(id => {
      const done = store.checkState[id]
      packingHtml += `<div class="item${done ? ' done' : ''}"><div class="checkbox">${done ? '✓' : ''}</div><span>${t(id)}</span></div>`
    })
    packingHtml += '</div></div>'
  })

  const html = `<!DOCTYPE html>
<html lang="${lang.value}" dir="${isRtl ? 'rtl' : 'ltr'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${docTitle}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  /* ── Default (Dark) ── */
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',system-ui,sans-serif;padding:28px 20px;max-width:820px;margin:0 auto;min-height:100vh;background:#0f172a;color:#e2e8f0}
  .hero{position:relative;overflow:hidden;background:linear-gradient(135deg,#134e4a 0%,#0d9488 50%,#0891b2 100%);border-radius:24px;padding:36px 32px;margin-bottom:32px}
  .hero::before{content:'';position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.07)}
  .hero::after{content:'';position:absolute;bottom:-30px;left:60px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.05)}
  .hero-emoji{font-size:2.4rem;margin-bottom:12px}
  .hero h1{font-size:2rem;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:6px;position:relative;z-index:1}
  .hero{display:flex;align-items:center;justify-content:space-between}
  .hero-left{display:flex;flex-direction:column;align-items:flex-start;z-index:1}
  .hero h1{text-align:left;margin-bottom:6px}
  .hero-logo-wrap{width:100px;height:100px;border-radius:50%;flex-shrink:0;z-index:1;background:white;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;overflow:hidden;padding:10px;box-sizing:border-box}
  .hero-logo{width:100%;height:100%;object-fit:contain}
  .hero .date-row{font-size:.85rem;color:rgba(255,255,255,0.75);font-weight:500;position:relative;z-index:1;display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center}
  .hero .date-label{color:rgba(255,255,255,0.5);font-size:.75rem;text-transform:uppercase;letter-spacing:.05em}
  .hero .date-divider{color:rgba(255,255,255,0.3)}
  .day-num{width:34px;height:34px;background:linear-gradient(135deg,#0d9488,#0891b2);color:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.82rem;flex-shrink:0}
  .section-label{font-size:1.1rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin:28px 0 14px;display:flex;align-items:center;gap:8px;color:#94a3b8}
  .day-card{border-radius:18px;margin-bottom:14px;overflow:hidden;border:1px solid;background:#1e293b;border-color:#334155}
  .day-header{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom-width:1px;border-bottom-style:solid;background:#273449;border-color:#334155}
  .day-title{color:#e2e8f0;font-weight:700;font-size:.98rem}
  .places{padding:12px 16px}
  .place-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;border:1px solid;margin-bottom:8px;background:#273449;border-color:#334155}
  .place-name{font-weight:600;font-size:.9rem;color:#cbd5e1}
  .place-time{font-size:.8rem;font-weight:700;color:#2dd4bf;background:rgba(45,212,191,.12);padding:4px 10px;border-radius:8px;white-space:nowrap}
  .section{border-radius:18px;margin-bottom:14px;padding:20px;border:1px solid;background:#1e293b;border-color:#334155}
  .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
  .section-title{font-size:1rem;font-weight:700;color:#e2e8f0}
  .badge{background:#0d9488;color:#fff;font-size:.75rem;font-weight:700;padding:3px 10px;border-radius:20px}
  .progress-wrap{height:5px;border-radius:9px;margin-bottom:14px;overflow:hidden;background:#334155}
  .progress-bar{height:100%;background:linear-gradient(90deg,#0d9488,#2dd4bf);border-radius:9px}
  .items{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
  .item{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:11px;border:1px solid;font-size:.86rem;background:#273449;border-color:#334155;color:#94a3b8}
  .item.done{border-color:#0d948840;color:#64748b;text-decoration:line-through;background:#1a2a2a}
  .checkbox{width:17px;height:17px;border-radius:5px;border:1.5px solid;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;color:#0d9488;flex-shrink:0;border-color:#475569}
  .item.done .checkbox{background:#0d9488;color:#fff;border-color:#0d9488}
  .footer{margin-top:36px;text-align:center;font-size:.78rem;padding-top:20px;border-top:1px solid;color:#475569;border-color:#1e293b}

  /* ── Light mode override ── */
  @media (prefers-color-scheme: light) {
    body{background:#f8fafc;color:#1e293b}
    .section-label{color:#64748b}
    .day-card{background:#fff;border-color:#e2e8f0}
    .day-header{background:#f1f5f9;border-color:#e2e8f0}
    .day-title{color:#1e293b}
    .place-row{background:#f8fafc;border-color:#e2e8f0}
    .place-name{color:#334155}
    .section{background:#fff;border-color:#e2e8f0}
    .section-title{color:#1e293b}
    .progress-wrap{background:#e2e8f0}
    .item{background:#f8fafc;border-color:#e2e8f0;color:#475569}
    .item.done{border-color:#0d948830;color:#94a3b8;background:#f0fdf9}
    .checkbox{border-color:#cbd5e1}
    .footer{color:#94a3b8;border-color:#e2e8f0}
  }
</style>
</head>
<body>
<div class="hero">
  <div class="hero-left">
    <div class="hero-emoji"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="#14b8a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7"/></svg></div>
    <h1>${docTitle}</h1>
    <div class="date-row">
      <span><span class="date-label">${plannedLabel}:</span> ${now}</span>
      <span class="date-divider">·</span>
      <span><span class="date-label">${departLabel}:</span> ${departDisplay}</span>
    </div>
  </div>
  <div class="hero-logo-wrap"><img src="${logoB64}" class="hero-logo" alt="Travelaroha" /></div>
</div>
<div class="section-label">${t('plan_itinerary')}</div>
${itineraryHtml}
<div class="section-label">${t('plan_packing')}</div>
${packingHtml}
<div class="footer">${planByPre}<a href="https://travelaroha.space" target="_blank" style="color:#14b8a6;text-decoration:none;font-weight:600;">Travelaroha</a></div>
</body></html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const namePart = store.tripName ? store.tripName.replace(/[/\\?%*:|"<>]/g, '-') : t('plan_title')
  const datePart = store.travelDate || new Date().toISOString().slice(0, 10)
  a.download = `${namePart}_${datePart} by Travelaroha.space.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.fade-enter-active { transition: all 0.4s ease; }
.fade-leave-active { transition: all 0.3s ease-in; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.92); }
</style>