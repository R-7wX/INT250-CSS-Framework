<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
        {{ t('idx_title') }}
      </h1>
      <p class="mt-2 text-slate-500 dark:text-slate-400 text-sm sm:text-base">
        {{ t('idx_sub') }}
      </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2 mb-6 items-center">
      <button
        v-for="vibe in vibes" :key="vibe.key"
        @click="setVibe(vibe.key)"
        class="filter-btn"
        :class="[
          currentVibe === vibe.key && !savedMode ? VIBE_ACTIVE_COLORS[vibe.key] : '',
          VIBE_HOVER_CLASSES[vibe.key]
        ]"
      >
        {{ VIBE_ICONS[vibe.key] ? VIBE_ICONS[vibe.key] + ' ' : '' }}{{ t(vibe.labelKey) }}
      </button>

      <button
        @click="toggleSavedMode"
        class="ml-auto flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold border transition-all"
        :class="savedMode
          ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/20'"
      >
        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" :fill="savedMode ? 'currentColor' : 'none'" :stroke="savedMode ? 'none' : 'currentColor'" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
        <span>{{ savedMode ? t('idx_saved_on') : t('idx_saved_btn') }}</span>
        <span class="px-1.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
          {{ savedPlaces.length }}
        </span>
      </button>
    </div>

    <!-- Grid -->
    <div v-if="filtered.length > 0" class="place-grid">
      <div
        v-for="(place, i) in filtered" :key="place.name"
        class="place-card rounded-3xl relative overflow-hidden group shadow-md cursor-pointer"
        :class="isLargeCard(i, filtered.length) ? 'large' : 'small'"
        :style="{ animationDelay: (i * 0.04) + 's' }"
      >
        <img :src="place.img" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
        <div class="absolute bottom-4 left-4 z-20 text-white pr-12">
          <span class="px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-medium mb-2 inline-flex items-center gap-1">
            {{ VIBE_ICONS[place.vibe] || '' }} {{ t(VIBE_I18N_KEY[place.vibe]) || place.vibe }}
          </span>
          <h3 class="font-bold leading-tight" :class="isLargeCard(i, filtered.length) ? 'text-2xl' : 'text-base'">
            {{ getPlaceName(place.name) }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-200/90 mt-1 leading-snug line-clamp-2">
            {{ getPlaceDesc(place.name) || place.desc }}
          </p>
        </div>
        <button
          @click.stop="toggleSavedWithToast(place.name)"
          class="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center backdrop-blur-md rounded-full hover:scale-110 transition-all"
          :class="store.isSaved(place.name) ? 'bg-white text-rose-500 shadow-md' : 'bg-black/20 text-white'"
        >
          <svg v-if="store.isSaved(place.name)" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" style="color:#f43f5e">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center gap-4">
      <svg class="w-16 h-16 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h3 class="text-xl font-bold text-slate-700 dark:text-slate-300">{{ t('idx_empty_h') }}</h3>
      <p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm">{{ t('idx_empty_sub') }}</p>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/useAppStore.js'
import { useI18n } from '../composables/useI18n.js'
import { PLACES, PLACE_NAMES, PLACE_DESCS } from '../data/places.js'

const store = useAppStore()
const { t, lang } = useI18n()

const currentVibe = ref('All')
const savedMode = ref(false)

const savedPlaces = computed(() => store.savedPlaces)

// Mobile detection for drag hint
const isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0

function toggleSavedWithToast(placeName) {
  const wasSaved = store.isSaved(placeName)
  store.toggleSaved(placeName)
  const displayName = getPlaceName(placeName)
  if (!wasSaved) {
    store.showToast(displayName, { type: 'success',
      undoFn: () => store.toggleSaved(placeName)
    })
  } else {
    store.showToast(displayName, { type: 'warning', duration: 2000 })
  }
}

const vibes = [
  { key: 'All',             labelKey: 'idx_filter_all' },
  { key: 'Urban Adventure', labelKey: 'idx_vibe_urban' },
  { key: 'Slow Living',     labelKey: 'idx_vibe_slow' },
  { key: 'Nature Retreat',  labelKey: 'idx_vibe_nature' },
  { key: 'Foodie Tour',     labelKey: 'idx_vibe_foodie' },
  { key: 'Beach Getaway',   labelKey: 'idx_vibe_beach' },
]

const VIBE_ICONS = {
  'Urban Adventure': '🏙️',
  'Slow Living':     '☕',
  'Nature Retreat':  '🌲',
  'Foodie Tour':     '🍣',
  'Beach Getaway':   '🏖️',
}

const VIBE_I18N_KEY = {
  'Urban Adventure': 'idx_vibe_urban',
  'Slow Living':     'idx_vibe_slow',
  'Nature Retreat':  'idx_vibe_nature',
  'Foodie Tour':     'idx_vibe_foodie',
  'Beach Getaway':   'idx_vibe_beach',
}

const VIBE_ACTIVE_COLORS = {
  'All':             'vibe-active-all',
  'Urban Adventure': 'vibe-active-urban',
  'Slow Living':     'vibe-active-slow',
  'Nature Retreat':  'vibe-active-nature',
  'Foodie Tour':     'vibe-active-foodie',
  'Beach Getaway':   'vibe-active-beach',
}

const VIBE_HOVER_CLASSES = {
  'All':             'vibe-btn-all',
  'Urban Adventure': 'vibe-btn-urban',
  'Slow Living':     'vibe-btn-slow',
  'Nature Retreat':  'vibe-btn-nature',
  'Foodie Tour':     'vibe-btn-foodie',
  'Beach Getaway':   'vibe-btn-beach',
}

const filtered = computed(() => {
  if (savedMode.value) return PLACES.filter(p => store.isSaved(p.name))
  if (currentVibe.value !== 'All') return PLACES.filter(p => p.vibe === currentVibe.value)
  return PLACES
})

function setVibe(vibe) {
  savedMode.value = false
  currentVibe.value = vibe
}

function toggleSavedMode() {
  savedMode.value = !savedMode.value
  if (savedMode.value) currentVibe.value = 'All'
}

function getPlaceName(thaiName) {
  if (lang.value === 'th') return thaiName   // key itself is already the Thai name
  const row = PLACE_NAMES[thaiName]
  if (!row) return thaiName
  return row[lang.value] || row['en'] || thaiName
}

function getPlaceDesc(thaiName) {
  const row = PLACE_DESCS[thaiName]
  if (!row) return ''
  return row[lang.value] || row['th'] || row['en'] || ''
}

function isLargeCard(i, total) {
  if (total < 4) return false
  const groupOf5 = Math.floor(i / 5)
  const posInGroup = i % 5
  const largePositions = [0, 2, 1, 4, 3]
  return posInGroup === largePositions[groupOf5 % largePositions.length]
}

// Scroll to top
const showScrollTop = ref(false)
function onScroll() { showScrollTop.value = window.scrollY > 320 }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* Tight mosaic grid — matches original prototype exactly */
.place-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 200px;
  grid-auto-flow: dense;
  gap: 12px;
}
@media (max-width: 1024px) {
  .place-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 200px;
  }
}
@media (max-width: 768px) {
  .place-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 200px;
    gap: 8px;
  }
}

.place-card {
  animation: cardIn 0.4s ease both;
}
.place-card.large {
  grid-column: span 2;
  grid-row: span 2;
}
.place-card.small {
  grid-column: span 1;
  grid-row: span 1;
}

@keyframes cardIn {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

.scroll-top-enter-active, .scroll-top-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.scroll-top-enter-from, .scroll-top-leave-to { opacity: 0; transform: translateY(12px) scale(0.9); }
</style>