<template>
  <section class="card" v-if="activeTrip">
    <div class="flex items-center gap-2.5 mb-4">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center"
           style="background: rgba(167,139,250,0.15); border: 1px solid rgba(167,139,250,0.25)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2.5">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </div>
      <p class="section-label mb-0">Share Trip</p>
    </div>

    <!-- Share URL -->
    <div class="share-url-box" v-if="shareURL">
      <p class="share-url-text">{{ shareURL.slice(0, 60) }}…</p>
      <button class="share-copy-btn" @click="copyURL">
        <svg v-if="!copied" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>

    <!-- QR Code -->
    <div class="qr-wrap" v-if="shareURL" ref="qrRef">
      <canvas ref="qrCanvas" class="qr-canvas" />
      <p class="qr-hint">Scan to open trip</p>
    </div>

    <div class="share-actions">
      <button class="btn-primary w-full justify-center" style="font-size:12px; padding:9px" @click="generateShare">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
        Generate Share Link
      </button>
    </div>

    <p class="text-[10px] text-night-400 mt-2 text-center">Trip data is encoded in the URL — no server needed.</p>
  </section>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useTrips } from '../composables/useExpenses.js'
import { lang } from '../composables/useExpenses.js'

const { activeTrip, activeTripId, encodeTripToURL } = useTrips()

const shareURL  = ref('')
const copied    = ref(false)
const qrCanvas  = ref(null)

async function generateShare() {
  shareURL.value = encodeTripToURL(activeTripId.value)
  await nextTick()
  drawQR(shareURL.value)
}

function copyURL() {
  navigator.clipboard.writeText(shareURL.value).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

function drawQR(url) {
  const canvas = qrCanvas.value
  if (!canvas) return
  const size = 140
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // Simple visual QR placeholder using a deterministic pattern from URL hash
  ctx.fillStyle = '#0C111B'
  ctx.fillRect(0, 0, size, size)

  // Load qrcode library dynamically
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
  script.onload = () => {
    canvas.width = 140; canvas.height = 140
    const container = document.createElement('div')
    new QRCode(container, {
      text: url, width: 140, height: 140,
      colorDark: '#F59E0B', colorLight: '#080D14',
      correctLevel: QRCode.CorrectLevel.L,
    })
    setTimeout(() => {
      const img = container.querySelector('img')
      if (img) {
        img.onload = () => ctx.drawImage(img, 0, 0, 140, 140)
        if (img.complete) ctx.drawImage(img, 0, 0, 140, 140)
      }
    }, 100)
  }
  if (!window.QRCode) document.head.appendChild(script)
  else script.onload()
}
</script>
