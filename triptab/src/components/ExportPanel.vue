<template>
  <section class="card" v-if="activeTrip && expenses.length > 0">
    <div class="flex items-center gap-2.5 mb-4">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center"
           style="background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.25)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      </div>
      <p class="section-label mb-0">Export PDF Report</p>
    </div>

    <p class="text-xs text-night-300 mb-4">Generate a summary PDF with all expenses, balances and settlement plan.</p>

    <button class="btn-primary w-full justify-center" style="font-size:12px; padding:9px"
            @click="exportPDF" :disabled="generating">
      <svg v-if="!generating" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           style="animation: spin 1s linear infinite">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      {{ generating ? 'Generating…' : 'Download PDF' }}
    </button>
  </section>
</template>

<script setup>
import { ref }         from 'vue'
import { useTrips }    from '../composables/useExpenses.js'
import { useExpenses } from '../composables/useExpenses.js'
import { lang } from '../composables/useExpenses.js'
import { CATEGORIES }  from '../composables/useExpenses.js'

const { activeTrip } = useTrips()
const { participants, expenses, totalSpent, settlements, categoryBreakdown, getBalance, getParticipant, initials, fmt } = useExpenses()

const generating = ref(false)

async function loadJsPDF() {
  if (window.jspdf) return window.jspdf.jsPDF
  return new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    s.onload = () => resolve(window.jspdf.jsPDF)
    document.head.appendChild(s)
  })
}

async function exportPDF() {
  generating.value = true
  try {
    const jsPDF = await loadJsPDF()
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const W = 210, MARGIN = 18
    let y = 20

    const amber   = [245, 158, 11]
    const violet  = [167, 139, 250]
    const emerald = [52,  211, 153]
    const dark    = [8,   13,  20]
    const gray1   = [241, 245, 249]
    const gray3   = [100, 116, 139]

    // ── Header ─────────────────────────────────────────────────
    doc.setFillColor(...dark)
    doc.rect(0, 0, W, 30, 'F')
    doc.setTextColor(...amber)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('TripTab', MARGIN, 16)
    doc.setTextColor(...gray1)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(activeTrip.value.name, MARGIN, 23)
    const dateStr = new Date().toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' })
    doc.setTextColor(...gray3)
    doc.text(dateStr, W - MARGIN, 23, { align: 'right' })
    y = 40

    // ── Summary tiles ──────────────────────────────────────────
    const tiles = [
      { label: 'Total Spent',  value: fmt(totalSpent.value),             color: amber },
      { label: 'Travelers',    value: String(participants.value.length),  color: violet },
      { label: 'Settlements',  value: String(settlements.value.length),   color: emerald },
      { label: 'Per Person',   value: participants.value.length > 0 ? fmt(totalSpent.value / participants.value.length) : fmt(0), color: [251,113,133] },
    ]
    const tileW = (W - MARGIN * 2 - 9) / 4
    tiles.forEach((tile, i) => {
      const x = MARGIN + i * (tileW + 3)
      doc.setFillColor(tile.color[0], tile.color[1], tile.color[2], 0.1)
      doc.roundedRect(x, y, tileW, 18, 2, 2, 'F')
      doc.setDrawColor(...tile.color)
      doc.setLineWidth(0.3)
      doc.roundedRect(x, y, tileW, 18, 2, 2, 'S')
      doc.setTextColor(...gray3); doc.setFontSize(7); doc.setFont('helvetica', 'normal')
      doc.text(tile.label.toUpperCase(), x + tileW/2, y + 6, { align: 'center' })
      doc.setTextColor(...tile.color); doc.setFontSize(11); doc.setFont('helvetica', 'bold')
      doc.text(tile.value, x + tileW/2, y + 13, { align: 'center' })
    })
    y += 25

    // ── Category breakdown ─────────────────────────────────────
    if (categoryBreakdown.value.length > 0) {
      doc.setTextColor(...dark); doc.setFontSize(11); doc.setFont('helvetica', 'bold')
      doc.text('Spending by Category', MARGIN, y); y += 7
      const barW = W - MARGIN * 2
      categoryBreakdown.value.forEach(cat => {
        const fillW = (cat.pct / 100) * (barW - 30)
        doc.setFontSize(9); doc.setFont('helvetica', 'normal')
        doc.setTextColor(...gray3)
        doc.text(cat.emoji + ' ' + cat.label, MARGIN, y + 3.5)
        doc.setFillColor(37, 47, 64)
        doc.roundedRect(MARGIN + 30, y, barW - 30, 5, 1, 1, 'F')
        const rgb = hexToRGB(cat.color)
        doc.setFillColor(...rgb)
        if (fillW > 0) doc.roundedRect(MARGIN + 30, y, fillW, 5, 1, 1, 'F')
        doc.setTextColor(...rgb); doc.setFont('helvetica', 'bold'); doc.setFontSize(8)
        doc.text(fmt(cat.total), W - MARGIN, y + 3.5, { align: 'right' })
        y += 9
      })
      y += 6
    }

    // ── Expenses table ─────────────────────────────────────────
    doc.setTextColor(...dark); doc.setFontSize(11); doc.setFont('helvetica', 'bold')
    doc.text('All Expenses', MARGIN, y); y += 7

    // Table header
    doc.setFillColor(37, 47, 64)
    doc.roundedRect(MARGIN, y, W - MARGIN*2, 7, 1, 1, 'F')
    doc.setTextColor(...gray3); doc.setFontSize(7); doc.setFont('helvetica', 'bold')
    const cols = [MARGIN+2, MARGIN+70, MARGIN+100, MARGIN+130, W-MARGIN-2]
    doc.text('DESCRIPTION', cols[0], y+4.5)
    doc.text('PAID BY', cols[1], y+4.5)
    doc.text('CATEGORY', cols[2], y+4.5)
    doc.text('SPLIT', cols[3], y+4.5)
    doc.text('AMOUNT', cols[4], y+4.5, { align: 'right' })
    y += 9

    expenses.value.forEach((exp, idx) => {
      if (y > 260) { doc.addPage(); y = 20 }
      if (idx % 2 === 0) {
        doc.setFillColor(18, 25, 38)
        doc.rect(MARGIN, y - 1, W - MARGIN*2, 7, 'F')
      }
      const payer = getParticipant(exp.paidBy)
      const cat   = CATEGORIES.find(c => c.id === exp.category) ?? CATEGORIES[5]
      doc.setFontSize(8); doc.setFont('helvetica', 'normal')
      doc.setTextColor(...gray1)
      const desc = exp.description.length > 28 ? exp.description.slice(0,25)+'…' : exp.description
      doc.text(desc, cols[0], y + 3.5)
      doc.setTextColor(payer?.color ? hexToRGB(payer.color) : gray3)
      doc.text(payer?.name ?? '-', cols[1], y + 3.5)
      doc.setTextColor(...gray3)
      doc.text(cat.emoji + ' ' + cat.label, cols[2], y + 3.5)
      doc.text(String(exp.splitAmong.length) + ' ppl', cols[3], y + 3.5)
      doc.setTextColor(...amber); doc.setFont('helvetica', 'bold')
      const dispAmt = exp.currency !== activeTrip.value.baseCurrency
        ? fmt(exp.amount, exp.currency) + ' (' + fmt(exp.amountBase) + ')'
        : fmt(exp.amount)
      doc.text(dispAmt, cols[4], y + 3.5, { align: 'right' })
      y += 7
    })
    y += 8

    // ── Balances ───────────────────────────────────────────────
    if (y > 230) { doc.addPage(); y = 20 }
    doc.setTextColor(...dark); doc.setFontSize(11); doc.setFont('helvetica', 'bold')
    doc.text('Net Balances', MARGIN, y); y += 7

    participants.value.forEach(p => {
      const bal = getBalance(p.id)
      const rgb = hexToRGB(p.color)
      const barW = W - MARGIN * 2 - 50
      const fillW = (Math.abs(bal) / Math.max(...participants.value.map(x => Math.abs(getBalance(x.id))), 1)) * barW
      doc.setFillColor(37, 47, 64)
      doc.roundedRect(MARGIN + 28, y, barW, 5, 1, 1, 'F')
      doc.setFillColor(bal >= 0 ? 52 : 244, bal >= 0 ? 211 : 63, bal >= 0 ? 153 : 94)
      if (fillW > 0) doc.roundedRect(MARGIN + 28, y, fillW, 5, 1, 1, 'F')
      doc.setFontSize(8); doc.setFont('helvetica', 'normal')
      doc.setTextColor(...rgb)
      doc.text(initials(p.name), MARGIN + 3, y + 3.5)
      doc.setTextColor(...gray1)
      doc.text(p.name, MARGIN + 10, y + 3.5)
      doc.setTextColor(bal >= 0 ? 52 : 244, bal >= 0 ? 211 : 63, bal >= 0 ? 153 : 94)
      doc.setFont('helvetica', 'bold')
      doc.text((bal >= 0 ? '+' : '') + fmt(bal), W - MARGIN, y + 3.5, { align: 'right' })
      y += 9
    })
    y += 8

    // ── Settlement plan ────────────────────────────────────────
    if (settlements.value.length > 0) {
      if (y > 240) { doc.addPage(); y = 20 }
      doc.setTextColor(...dark); doc.setFontSize(11); doc.setFont('helvetica', 'bold')
      doc.text('Settlement Plan', MARGIN, y); y += 7
      settlements.value.forEach(s => {
        const from = getParticipant(s.from)
        const to   = getParticipant(s.to)
        doc.setFillColor(26, 34, 48)
        doc.roundedRect(MARGIN, y, W - MARGIN*2, 9, 2, 2, 'F')
        doc.setFontSize(9); doc.setFont('helvetica', 'bold')
        doc.setTextColor(hexToRGB(from?.color ?? '#FB7185'))
        doc.text(from?.name ?? '-', MARGIN + 4, y + 5.5)
        doc.setTextColor(...gray3); doc.setFont('helvetica', 'normal')
        doc.text('pays', MARGIN + 4 + doc.getTextWidth(from?.name ?? '-') + 3, y + 5.5)
        doc.setTextColor(...amber); doc.setFont('helvetica', 'bold')
        doc.text(fmt(s.amount), W/2, y + 5.5, { align: 'center' })
        doc.setTextColor(...gray3); doc.setFont('helvetica', 'normal')
        doc.text('to', W - MARGIN - 4 - doc.getTextWidth(to?.name ?? '-') - 8, y + 5.5)
        doc.setTextColor(hexToRGB(to?.color ?? '#34D399')); doc.setFont('helvetica', 'bold')
        doc.text(to?.name ?? '-', W - MARGIN - 4, y + 5.5, { align: 'right' })
        y += 12
      })
    }

    // ── Footer ─────────────────────────────────────────────────
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFillColor(...dark)
      doc.rect(0, 290, W, 10, 'F')
      doc.setFontSize(7); doc.setTextColor(...gray3); doc.setFont('helvetica', 'normal')
      doc.text('Generated by TripTab • triptab.app', MARGIN, 295.5)
      doc.text(`Page ${i} / ${pageCount}`, W - MARGIN, 295.5, { align: 'right' })
    }

    doc.save(`${activeTrip.value.name.replace(/\s+/g,'-')}-TripTab.pdf`)
  } finally {
    generating.value = false
  }
}

function hexToRGB(hex) {
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  return [r, g, b]
}
</script>
