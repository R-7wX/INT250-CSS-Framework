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
      <h2 class="font-bold text-base mb-1 text-slate-700 dark:text-slate-300">{{ t('cl_itin') }}</h2>
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
    <div class="space-y-4 mb-6">
      <div v-for="section in CHECKLIST_SECTIONS" :key="section.id"
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
          <div class="text-6xl mb-3 animate-bounce">🎉</div>
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
import { CHECKLIST_SECTIONS } from '../data/checklist.js'
import { PLACE_NAMES } from '../data/places.js'

const store = useAppStore()
const { t, lang } = useI18n()
const router = useRouter()

const exportData = computed(() => store.exportData)

onMounted(() => {
  store.loadExport()
})

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

const totalCount = computed(() => CHECKLIST_SECTIONS.reduce((s, sec) => s + sec.items.length, 0))
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
  router.push('/storyboard')
}

function downloadPlan() {
  const localeMap = { th: 'th-TH', en: 'en-US', zh: 'zh-CN', es: 'es-ES', ar: 'ar-SA', fr: 'fr-FR' }
  const locale = localeMap[lang.value] || 'en-US'
  const isRtl = lang.value === 'ar'
  const now = new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  const docTitle = store.tripName || t('plan_title')
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
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',system-ui,sans-serif;background:#0f172a;color:#e2e8f0;padding:28px 20px;max-width:820px;margin:0 auto;min-height:100vh}
  .hero{position:relative;overflow:hidden;background:linear-gradient(135deg,#134e4a 0%,#0d9488 50%,#0891b2 100%);border-radius:24px;padding:36px 32px;margin-bottom:32px}
  .hero::before{content:'';position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.07)}
  .hero::after{content:'';position:absolute;bottom:-30px;left:60px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.05)}
  .hero-emoji{font-size:2.4rem;margin-bottom:12px}
  .hero h1{font-size:2rem;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:6px;position:relative;z-index:1}
  .hero .date{font-size:.9rem;color:rgba(255,255,255,0.7);font-weight:500;position:relative;z-index:1}
  .section-label{font-size:1.1rem;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin:28px 0 14px;display:flex;align-items:center;gap:8px}
  .day-card{background:#1e293b;border-radius:18px;margin-bottom:14px;overflow:hidden;border:1px solid #334155}
  .day-header{display:flex;align-items:center;gap:12px;padding:14px 18px;background:#273449;border-bottom:1px solid #334155}
  .day-num{width:34px;height:34px;background:linear-gradient(135deg,#0d9488,#0891b2);color:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.82rem;flex-shrink:0}
  .day-title{font-weight:700;font-size:.98rem;color:#e2e8f0}
  .places{padding:12px 16px}
  .place-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;background:#273449;border-radius:12px;border:1px solid #334155;margin-bottom:8px}
  .place-name{font-weight:600;font-size:.9rem;color:#cbd5e1}
  .place-time{font-size:.8rem;font-weight:700;color:#2dd4bf;background:rgba(45,212,191,.12);padding:4px 10px;border-radius:8px;white-space:nowrap}
  .section{background:#1e293b;border-radius:18px;margin-bottom:14px;padding:20px;border:1px solid #334155}
  .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
  .section-title{font-size:1rem;font-weight:700;color:#e2e8f0}
  .badge{background:#0d9488;color:#fff;font-size:.75rem;font-weight:700;padding:3px 10px;border-radius:20px}
  .progress-wrap{height:5px;background:#334155;border-radius:9px;margin-bottom:14px;overflow:hidden}
  .progress-bar{height:100%;background:linear-gradient(90deg,#0d9488,#2dd4bf);border-radius:9px;transition:width .4s}
  .items{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
  .item{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:11px;border:1px solid #334155;font-size:.86rem;color:#94a3b8;background:#273449}
  .item.done{border-color:#0d948840;color:#64748b;text-decoration:line-through;background:#1a2a2a}
  .checkbox{width:17px;height:17px;border-radius:5px;border:1.5px solid #475569;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:800;color:#0d9488;flex-shrink:0}
  .item.done .checkbox{background:#0d9488;color:#fff;border-color:#0d9488}
  .footer{margin-top:36px;text-align:center;font-size:.78rem;color:#475569;padding-top:20px;border-top:1px solid #1e293b}
</style>
</head>
<body>
<div class="hero">
  <div class="hero-emoji">🗺️</div>
  <h1>${docTitle}</h1>
  <div class="date">${now}</div>
</div>
<div class="section-label">${t('plan_itinerary')}</div>
${itineraryHtml}
<div class="section-label">${t('plan_packing')}</div>
${packingHtml}
<div class="footer">${t('plan_by')}</div>
</body></html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `travelaroha-plan-${new Date().toISOString().slice(0,10)}.html`
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