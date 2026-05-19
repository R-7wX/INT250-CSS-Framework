<template>
  <section class="card" v-if="categoryBreakdown.length > 0">
    <div class="flex items-center gap-2.5 mb-4">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center"
           style="background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.25)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2.5">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>
        </svg>
      </div>
      <p class="section-label mb-0">{{ lang === 'th' ? 'ค่าใช้จ่ายตามหมวดหมู่' : 'Spending by Category' }}</p>
    </div>

    <div class="cat-layout">
      <!-- Donut chart -->
      <div class="donut-wrap">
        <svg :width="SIZE" :height="SIZE" :viewBox="`0 0 ${SIZE} ${SIZE}`">
          <g :transform="`translate(${SIZE/2},${SIZE/2})`">
            <circle :r="OUTER" fill="none" stroke="var(--border)" stroke-width="1"/>
            <path v-for="(seg, i) in segments" :key="i"
                  :d="seg.d"
                  :fill="seg.color"
                  :opacity="hoveredCat === seg.id ? 1 : 0.85"
                  @mouseenter="hoveredCat = seg.id"
                  @mouseleave="hoveredCat = null"
                  style="cursor:pointer; transition: opacity 0.15s"
            />
            <!-- Center label -->
            <text text-anchor="middle" dy="-8" style="fill:var(--text-3); font-size:10px; font-family:'Outfit',sans-serif">
              {{ hoveredLabel ? hoveredLabel.pctStr : '' }}
            </text>
            <text text-anchor="middle" dy="6" style="fill:var(--text-3); font-size:9px; font-family:'Outfit',sans-serif">
              {{ hoveredLabel ? hoveredLabel.label : 'รวม' }}
            </text>
          </g>
        </svg>
      </div>

      <!-- Legend -->
      <div class="cat-legend">
        <div v-for="cat in categoryBreakdown" :key="cat.id"
             class="cat-row" :class="{ dimmed: hoveredCat && hoveredCat !== cat.id }"
             @mouseenter="hoveredCat = cat.id" @mouseleave="hoveredCat = null">
          <span class="cat-emoji" v-html="cat.svg" :style="{ color: cat.color }"></span>
          <div class="cat-bar-wrap">
            <div class="cat-bar-label">
              <span class="cat-bar-name">{{ cat.label }}</span>
              <span class="cat-bar-amt" :style="{ color: cat.color }">{{ fmt(cat.total) }}</span>
            </div>
            <div class="cat-bar-track">
              <div class="cat-bar-fill"
                   :style="{ width: cat.pct.toFixed(1) + '%', background: cat.color }" />
            </div>
          </div>
          <span class="cat-pct">{{ cat.pct.toFixed(0) }}%</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useExpenses }   from '../composables/useExpenses.js'
import { lang } from '../composables/useExpenses.js'

const { categoryBreakdown, fmt } = useExpenses()

const SIZE  = 130
const OUTER = 56
const INNER = 34
const hoveredCat = ref(null)

const hoveredLabel = computed(() => {
  if (!hoveredCat.value) return null
  const cat = categoryBreakdown.value.find(c => c.id === hoveredCat.value)
  if (!cat) return null
  return { label: cat.labelTh ?? cat.label, pctStr: cat.pct.toFixed(1) + '%' }
})

const segments = computed(() => {
  const total = categoryBreakdown.value.reduce((s, c) => s + c.pct, 0) || 1
  let startAngle = -Math.PI / 2
  return categoryBreakdown.value.map(cat => {
    const angle = (cat.pct / total) * Math.PI * 2
    const endAngle = startAngle + angle
    const x1 = Math.cos(startAngle) * OUTER
    const y1 = Math.sin(startAngle) * OUTER
    const x2 = Math.cos(endAngle)   * OUTER
    const y2 = Math.sin(endAngle)   * OUTER
    const ix1 = Math.cos(startAngle) * INNER
    const iy1 = Math.sin(startAngle) * INNER
    const ix2 = Math.cos(endAngle)   * INNER
    const iy2 = Math.sin(endAngle)   * INNER
    const large = angle > Math.PI ? 1 : 0
    const d = [
      `M ${x1} ${y1}`,
      `A ${OUTER} ${OUTER} 0 ${large} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${INNER} ${INNER} 0 ${large} 0 ${ix1} ${iy1}`,
      'Z'
    ].join(' ')
    startAngle = endAngle
    return { d, color: cat.color, id: cat.id }
  })
})
</script>
