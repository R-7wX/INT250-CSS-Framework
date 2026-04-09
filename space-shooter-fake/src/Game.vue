<template>
  <div class="fixed inset-0 bg-black overflow-hidden select-none" ref="rootEl">

    <!-- CRT scanlines overlay -->
    <div
      class="absolute inset-0 pointer-events-none z-50 opacity-[0.035]"
      style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,1) 2px, rgba(0,0,0,1) 4px);"
    />

    <!-- Vignette -->
    <div
      class="absolute inset-0 pointer-events-none z-40"
      style="background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,20,0.7) 100%);"
    />

    <canvas
      ref="canvasRef"
      class="absolute"
      style="image-rendering: pixelated;"
      @mousemove="onMouseMove"
      @touchmove.prevent="onTouchMove"
      @touchstart.prevent="onTouchMove"
    />

    <!-- ─── HUD ─────────────────────────────────────────────────────── -->
    <div
      v-if="gstate === 'playing' || gstate === 'paused'"
      class="absolute top-0 left-0 right-0 flex justify-between items-start px-4 py-2.5 pointer-events-none z-10"
      style="background: linear-gradient(to bottom, rgba(0,0,20,0.92) 0%, rgba(0,0,20,0.5) 60%, transparent 100%); border-bottom: 1px solid rgba(0,170,255,0.08);"
    >
      <!-- Score -->
      <div class="flex flex-col items-center min-w-[80px]">
        <div class="font-orbitron text-[8px] text-[#3a6f8a] tracking-[3px] mb-0.5 uppercase">Score</div>
        <div
          class="font-orbitron text-xl font-black text-[#00ccff]"
          style="text-shadow: 0 0 12px rgba(0,204,255,0.6);"
        >{{ score.toLocaleString() }}</div>
        <div
          v-if="combo > 1"
          class="font-orbitron text-[11px] font-bold text-[#ff9900] mt-0.5"
          style="text-shadow: 0 0 8px rgba(255,153,0,0.6);"
        >×{{ combo }}</div>
      </div>

      <!-- Level -->
      <div class="flex flex-col items-center min-w-[80px]">
        <div class="font-orbitron text-[8px] text-[#3a6f8a] tracking-[3px] mb-0.5 uppercase">Level</div>
        <div
          class="font-orbitron text-lg font-black text-[#00ccff]"
          style="text-shadow: 0 0 12px rgba(0,204,255,0.6);"
        >{{ level }}</div>
      </div>

      <!-- Lives -->
      <div class="flex flex-col items-center min-w-[80px]">
        <div class="font-orbitron text-[8px] text-[#3a6f8a] tracking-[3px] mb-0.5 uppercase">Lives</div>
        <div class="flex gap-1 mt-0.5">
          <span
            v-for="i in 3" :key="i"
            class="text-[18px] transition-all duration-200"
            :style="i > lives
              ? 'color:#2a2a2a;'
              : 'color:#ff4466; filter:drop-shadow(0 0 5px rgba(255,68,102,0.7));'"
          >♥</span>
        </div>
      </div>
    </div>

    <!-- ─── Active Power-up bar ──────────────────────────────────────── -->
    <div
      v-if="gstate==='playing' && activePU.length"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 pointer-events-none z-10"
    >
      <div
        v-for="p in activePU" :key="p.id"
        class="flex flex-col items-center gap-1 rounded-xl px-2.5 py-2 backdrop-blur-md"
        style="background: rgba(0,5,30,0.8); border: 1px solid rgba(0,80,180,0.5); box-shadow: 0 0 10px rgba(0,80,180,0.2);"
      >
        <span class="text-base leading-none">{{ p.icon }}</span>
        <div class="w-9 h-[3px] rounded-full overflow-hidden" style="background:#011030;">
          <div
            class="h-full rounded-full transition-[width] duration-100"
            :style="{width:(p.t/p.max*100)+'%', background:p.color, boxShadow:`0 0 4px ${p.color}`}"
          />
        </div>
      </div>
    </div>

    <!-- ─── START screen ─────────────────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="gstate==='start'"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4"
        style="background: rgba(0,4,20,0.9); backdrop-filter: blur(3px);"
      >
        <!-- Decorative top line -->
        <div class="flex items-center gap-3 mb-1">
          <div class="h-px w-16" style="background: linear-gradient(to right, transparent, #00ccff44);"></div>
          <div class="font-orbitron text-xs text-[#ffcc44] tracking-[8px] opacity-60">✦ ✧ ✦ ✧ ✦</div>
          <div class="h-px w-16" style="background: linear-gradient(to left, transparent, #00ccff44);"></div>
        </div>

        <h1
          class="font-orbitron text-[2.8rem] font-black text-[#00ccff] text-center leading-[1.15] animate-glow-pulse"
        >
          SPACE<br>
          <span
            class="text-[#ff6600]"
            style="text-shadow: 0 0 20px #ff6600, 0 0 40px rgba(255,68,0,0.5);"
          >SHOOTER</span>
        </h1>

        <p class="font-sarabun text-[0.95rem] text-[#88aacc] tracking-wide">กู้กาแล็กซีจากอุกกาบาตและเอเลี่ยน!</p>

        <!-- Hint box -->
        <div
          class="flex flex-col gap-2 px-5 py-3.5 rounded-2xl mt-1"
          style="background: rgba(0,30,70,0.5); border: 1px solid rgba(0,68,170,0.4); box-shadow: inset 0 0 20px rgba(0,80,180,0.1);"
        >
          <div class="font-sarabun text-[0.82rem] text-[#99bbdd]">🖱️ เลื่อนเมาส์ / 👆 แตะ = เคลื่อนที่</div>
          <div class="font-sarabun text-[0.82rem] text-[#99bbdd]">🔫 ยิงอัตโนมัติ — เก็บ power-up จากศัตรู</div>
          <div class="font-sarabun text-[0.82rem] text-[#99bbdd]">⚠️ ระวัง Boss ทุก 3 ด่าน!</div>
        </div>

        <button
          class="font-orbitron text-[0.95rem] font-bold px-9 py-3 rounded-xl cursor-pointer tracking-widest transition-all duration-200 hover:scale-105 mt-1"
          style="
            border: 2px solid #00ccff;
            background: rgba(0,50,90,0.65);
            color: #00ccff;
            text-shadow: 0 0 10px #00ccff;
            box-shadow: 0 0 18px rgba(0,204,255,0.25), inset 0 0 12px rgba(0,204,255,0.05);
          "
          @mouseenter="e => e.target.style.boxShadow='0 0 32px rgba(0,204,255,0.5), inset 0 0 16px rgba(0,204,255,0.1)'"
          @mouseleave="e => e.target.style.boxShadow='0 0 18px rgba(0,204,255,0.25), inset 0 0 12px rgba(0,204,255,0.05)'"
          @click="startGame"
        >🚀 เริ่มเกม!</button>

        <div v-if="highScore > 0" class="font-orbitron text-[0.7rem] text-[#3a6f8a] tracking-wider">
          🏆 สถิติสูงสุด: {{ highScore.toLocaleString() }}
        </div>

        <!-- Bottom deco line -->
        <div class="h-px w-48 mt-2" style="background: linear-gradient(to right, transparent, rgba(0,204,255,0.3), transparent);"></div>
      </div>
    </Transition>

    <!-- ─── LEVEL UP screen ──────────────────────────────────────────── -->
    <Transition name="bounce">
      <div
        v-if="gstate==='levelup'"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4"
        style="background: rgba(0,4,20,0.9); backdrop-filter: blur(3px);"
      >
        <div class="font-orbitron text-lg text-[#ffcc44] tracking-[6px] opacity-70">⭐ ⭐ ⭐</div>
        <h2
          class="font-orbitron text-[2.4rem] font-black text-[#ffcc00]"
          style="text-shadow: 0 0 24px #ffcc00, 0 0 48px rgba(255,204,0,0.4);"
        >ด่านผ่าน!</h2>
        <div
          class="font-orbitron text-base px-5 py-1.5 rounded-full"
          style="color:#ffcc00; background:rgba(255,200,0,0.12); border:1px solid rgba(255,204,0,0.6); box-shadow: 0 0 12px rgba(255,204,0,0.2);"
        >ด่าน {{ level - 1 }} สำเร็จ</div>
        <div
          v-if="levelBonus > 0"
          class="font-orbitron text-[1.2rem] font-bold text-[#ff9900]"
          style="text-shadow: 0 0 10px rgba(255,153,0,0.6);"
        >+{{ levelBonus.toLocaleString() }} โบนัส!</div>
        <button
          class="font-orbitron text-[0.95rem] font-bold px-9 py-3 rounded-xl cursor-pointer tracking-widest transition-all duration-200 hover:scale-105"
          style="
            border: 2px solid #00ccff;
            background: rgba(0,50,90,0.65);
            color: #00ccff;
            text-shadow: 0 0 10px #00ccff;
            box-shadow: 0 0 18px rgba(0,204,255,0.25), inset 0 0 12px rgba(0,204,255,0.05);
          "
          @mouseenter="e => e.target.style.boxShadow='0 0 32px rgba(0,204,255,0.5), inset 0 0 16px rgba(0,204,255,0.1)'"
          @mouseleave="e => e.target.style.boxShadow='0 0 18px rgba(0,204,255,0.25), inset 0 0 12px rgba(0,204,255,0.05)'"
          @click="advanceLevel"
        >ด่าน {{ level }} ➜</button>
      </div>
    </Transition>

    <!-- ─── BOSS WARNING ──────────────────────────────────────────────── -->
    <Transition name="fade">
      <div v-if="gstate==='bosswarning'" class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 boss-overlay">
        <div class="text-[4rem] animate-pulse">⚠️</div>
        <h2
          class="font-orbitron text-[2.4rem] font-black text-[#ff4400] boss-flicker"
          style="text-shadow: 0 0 24px #ff4400, 0 0 48px rgba(255,68,0,0.5);"
        >BOSS INCOMING</h2>
        <div class="font-sarabun text-[#ff9944] text-[1.1rem] tracking-wide">เตรียมรับมือ!</div>
      </div>
    </Transition>

    <!-- ─── GAME OVER ─────────────────────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="gstate==='gameover'"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4"
        style="background: rgba(0,0,10,0.95); backdrop-filter: blur(3px);"
      >
        <!-- Decorative frame lines -->
        <div class="h-px w-40" style="background: linear-gradient(to right, transparent, rgba(255,68,68,0.4), transparent);"></div>

        <h2
          class="font-orbitron text-[2.6rem] font-black text-[#ff4444]"
          style="text-shadow: 0 0 28px #ff4444, 0 0 56px rgba(255,68,68,0.4);"
        >GAME OVER</h2>

        <div
          class="font-orbitron text-[2rem] font-bold text-[#ffcc44]"
          style="text-shadow: 0 0 14px rgba(255,204,68,0.5);"
        >{{ score.toLocaleString() }}</div>

        <div class="font-sarabun text-[#666] text-sm tracking-wider">ถึงด่านที่ {{ level }}</div>

        <div
          v-if="newRecord"
          class="font-orbitron text-base px-5 py-1.5 rounded-full animate-pulse"
          style="color:#ffcc00; background:rgba(255,200,0,0.12); border:1px solid rgba(255,204,0,0.6); box-shadow:0 0 16px rgba(255,204,0,0.3);"
        >🏆 สถิติใหม่!</div>

        <div class="font-orbitron text-[0.7rem] text-[#3a6f8a] tracking-wider">สถิติสูงสุด: {{ highScore.toLocaleString() }}</div>

        <button
          class="font-orbitron text-[0.95rem] font-bold px-9 py-3 rounded-xl cursor-pointer tracking-widest transition-all duration-200 hover:scale-105 mt-1"
          style="
            border: 2px solid #00ccff;
            background: rgba(0,50,90,0.65);
            color: #00ccff;
            text-shadow: 0 0 10px #00ccff;
            box-shadow: 0 0 18px rgba(0,204,255,0.25), inset 0 0 12px rgba(0,204,255,0.05);
          "
          @mouseenter="e => e.target.style.boxShadow='0 0 32px rgba(0,204,255,0.5), inset 0 0 16px rgba(0,204,255,0.1)'"
          @mouseleave="e => e.target.style.boxShadow='0 0 18px rgba(0,204,255,0.25), inset 0 0 12px rgba(0,204,255,0.05)'"
          @click="restartGame"
        >🔄 เล่นใหม่</button>

        <div class="h-px w-40 mt-1" style="background: linear-gradient(to right, transparent, rgba(255,68,68,0.3), transparent);"></div>
      </div>
    </Transition>

    <!-- ─── PAUSED ─────────────────────────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="gstate==='paused'"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5"
        style="background: rgba(0,4,20,0.72); backdrop-filter: blur(4px);"
      >
        <h2
          class="font-orbitron text-[1.9rem] font-bold text-[#00ccff]"
          style="text-shadow: 0 0 14px rgba(0,204,255,0.6);"
        >⏸ หยุดชั่วคราว</h2>
        <button
          class="font-orbitron text-[0.95rem] font-bold px-9 py-3 rounded-xl cursor-pointer tracking-widest transition-all duration-200 hover:scale-105"
          style="
            border: 2px solid #00ccff;
            background: rgba(0,50,90,0.65);
            color: #00ccff;
            text-shadow: 0 0 10px #00ccff;
            box-shadow: 0 0 18px rgba(0,204,255,0.25), inset 0 0 12px rgba(0,204,255,0.05);
          "
          @mouseenter="e => e.target.style.boxShadow='0 0 32px rgba(0,204,255,0.5), inset 0 0 16px rgba(0,204,255,0.1)'"
          @mouseleave="e => e.target.style.boxShadow='0 0 18px rgba(0,204,255,0.25), inset 0 0 12px rgba(0,204,255,0.05)'"
          @click="togglePause"
        >▶ เล่นต่อ</button>
      </div>
    </Transition>

    <!-- ─── Pause button (in-game) ──────────────────────────────────── -->
    <button
      v-if="gstate==='playing'"
      class="absolute top-3 right-3.5 z-[15] flex items-center justify-center w-9 h-9 rounded-lg text-[15px] cursor-pointer transition-all duration-200"
      style="
        background: rgba(0,15,45,0.75);
        border: 1px solid rgba(0,85,170,0.6);
        color: #0099cc;
        box-shadow: 0 0 8px rgba(0,100,200,0.15);
      "
      @mouseenter="e => { e.target.style.background='rgba(0,40,90,0.9)'; e.target.style.boxShadow='0 0 14px rgba(0,150,255,0.3)'; }"
      @mouseleave="e => { e.target.style.background='rgba(0,15,45,0.75)'; e.target.style.boxShadow='0 0 8px rgba(0,100,200,0.15)'; }"
      @click="togglePause"
    >⏸</button>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// ─── Constants ─────────────────────────────────────────────────────────────
const VW = 480, VH = 720  // virtual canvas size
const MAX_LIVES = 3
const STAR_COUNT = 120
const FIRE_RATE = 220 // ms between shots
const INV_TIME = 2000 // ms invincibility after hit
const PU_DURATION = 8000 // power-up duration ms

// ─── Reactive state ─────────────────────────────────────────────────────────
const canvasRef = ref(null)
const rootEl = ref(null)
const gstate = ref('start')   // start | playing | paused | levelup | bosswarning | gameover
const score = ref(0)
const lives = ref(MAX_LIVES)
const level = ref(1)
const combo = ref(1)
const levelBonus = ref(0)
const newRecord = ref(false)
const highScore = ref(Number(localStorage.getItem('ss_hs') || 0))
const activePU = reactive([])

let ctx = null
let raf = null
let lastTime = 0

// ─── Game objects ────────────────────────────────────────────────────────────
let player = null
let bullets = []
let enemies = []
let particles = []
let powerups = []
let stars = []
let floats = []      // floating score texts
let shake = 0        // screen shake amount
let shootTimer = 0
let spawnTimer = 0
let spawnInterval = 2200
let waveCount = 0    // enemies remaining in wave
let waveTotal = 0
let bossActive = false

// ─── Player definition ───────────────────────────────────────────────────────
function resetPlayer() {
  player = {
    x: VW / 2, y: VH - 90,
    w: 38, h: 48,
    targetX: VW / 2,
    invTimer: 0,
    shieldHP: 0,
    multiShot: false,
    speedBoost: false,
  }
}

// ─── Star field ──────────────────────────────────────────────────────────────
function initStars() {
  stars = []
  for (let i = 0; i < STAR_COUNT; i++) {
    const layer = Math.floor(Math.random() * 3)
    stars.push({
      x: Math.random() * VW,
      y: Math.random() * VH,
      size: layer === 2 ? 2.5 : layer === 1 ? 1.5 : 0.8,
      speed: layer === 2 ? 2.5 : layer === 1 ? 1.2 : 0.5,
      alpha: 0.4 + Math.random() * 0.6,
      twinkle: Math.random() * Math.PI * 2,
    })
  }
}

// ─── Enemy factories ─────────────────────────────────────────────────────────
function spawnAsteroid() {
  const big = Math.random() < 0.3
  const r = big ? 32 + Math.random() * 10 : 14 + Math.random() * 12
  const spd = (1.5 + level.value * 0.15) * (big ? 0.7 : 1)
  const sides = 7 + Math.floor(Math.random() * 5)
  const verts = []
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2
    verts.push({ x: Math.cos(a) * r * (0.65 + Math.random() * 0.35),
                 y: Math.sin(a) * r * (0.65 + Math.random() * 0.35) })
  }
  enemies.push({
    type: 'asteroid',
    x: r + Math.random() * (VW - r * 2), y: -r - 10,
    vx: (Math.random() - 0.5) * 2, vy: spd,
    r, verts,
    angle: Math.random() * Math.PI * 2,
    rotSpd: (Math.random() - 0.5) * 0.05,
    hp: big ? 3 : 1, maxHp: big ? 3 : 1,
    pts: big ? 30 : 10,
    dead: false,
  })
}

function spawnUFO() {
  const fromLeft = Math.random() < 0.5
  const spd = 1.8 + level.value * 0.12
  enemies.push({
    type: 'ufo',
    x: fromLeft ? -40 : VW + 40,
    y: 80 + Math.random() * 250,
    vx: fromLeft ? spd : -spd, vy: 0.4,
    w: 54, h: 30,
    sineT: 0, sineAmp: 25 + Math.random() * 20,
    hp: 2 + Math.floor(level.value / 2),
    maxHp: 2 + Math.floor(level.value / 2),
    pts: 50,
    shootTimer: 80 + Math.random() * 100,
    dead: false,
  })
}

function spawnDart() {
  const spd = 3.5 + level.value * 0.2
  enemies.push({
    type: 'dart',
    x: 20 + Math.random() * (VW - 40), y: -30,
    vx: (Math.random() - 0.5) * 3, vy: spd,
    w: 18, h: 32,
    angle: 0,
    hp: 1, maxHp: 1,
    pts: 25,
    dead: false,
  })
}

function spawnBoss() {
  const hp = 25 + level.value * 8
  enemies.push({
    type: 'boss',
    x: VW / 2, y: -100,
    targetY: 110,
    vx: 1.8, vy: 1.5,
    w: 130, h: 90,
    hp, maxHp: hp,
    pts: 600 + level.value * 80,
    t: 0, phase: 0,
    shootTimer: 40,
    dead: false,
  })
  bossActive = true
}

// ─── Bullet ───────────────────────────────────────────────────────────────────
function fireBullet(x, y, vx, vy, owner, color, w = 4, h = 16) {
  bullets.push({ x, y, vx, vy, owner, color, w, h, dead: false })
}

// ─── Particle ─────────────────────────────────────────────────────────────────
function burst(x, y, color, count = 14, speed = 4) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2
    const s = speed * (0.4 + Math.random() * 0.8)
    particles.push({
      x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      color, size: 2 + Math.random() * 3,
      life: 40 + Math.random() * 30, maxLife: 70,
      dead: false,
    })
  }
}

function sparkle(x, y, color, count = 6) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2
    particles.push({
      x, y, vx: Math.cos(a) * (1 + Math.random() * 2), vy: Math.sin(a) * (1 + Math.random() * 2) - 1,
      color, size: 1.5 + Math.random() * 2,
      life: 20 + Math.random() * 20, maxLife: 40,
      dead: false,
    })
  }
}

// ─── Float text ───────────────────────────────────────────────────────────────
function addFloat(x, y, text, color = '#ffff00') {
  floats.push({ x, y, text, color, life: 60, maxLife: 60, vy: -1.2, dead: false })
}

// ─── Power-up drop ────────────────────────────────────────────────────────────
const PU_TYPES = [
  { type: 'multi',  icon: '🔫', color: '#ff9900', label: 'Multi-shot' },
  { type: 'shield', icon: '🛡️', color: '#00aaff', label: 'Shield' },
  { type: 'speed',  icon: '⚡', color: '#ffff00', label: 'Speed' },
  { type: 'life',   icon: '❤️', color: '#ff4466', label: 'Extra Life' },
]
let puIdCtr = 0

function maybeDropPU(x, y) {
  if (Math.random() > 0.22) return
  const t = PU_TYPES[Math.floor(Math.random() * PU_TYPES.length)]
  powerups.push({ ...t, x, y, vy: 1.8, angle: 0, w: 26, h: 26, dead: false })
}

function applyPU(type) {
  // remove existing same type
  const idx = activePU.findIndex(p => p.type === type)
  if (idx !== -1) activePU.splice(idx, 1)

  if (type === 'life') {
    if (lives.value < MAX_LIVES) lives.value++
    addFloat(player.x, player.y - 40, '+1 LIFE', '#ff4466')
    return
  }
  const info = PU_TYPES.find(p => p.type === type)
  const id = ++puIdCtr
  activePU.push({ id, type, icon: info.icon, color: info.color, t: PU_DURATION, max: PU_DURATION })

  if (type === 'multi') player.multiShot = true
  if (type === 'shield') player.shieldHP = 3
  if (type === 'speed') player.speedBoost = true
}

function tickPU(dt) {
  for (let i = activePU.length - 1; i >= 0; i--) {
    activePU[i].t -= dt
    if (activePU[i].t <= 0) {
      const t = activePU[i].type
      activePU.splice(i, 1)
      if (t === 'multi') player.multiShot = false
      if (t === 'speed') player.speedBoost = false
    }
  }
}

// ─── Wave / spawn logic ───────────────────────────────────────────────────────
function startWave() {
  bossActive = false
  const isBossLevel = level.value % 3 === 0
  if (isBossLevel) {
    // Boss wave
    gstate.value = 'bosswarning'
    setTimeout(() => {
      if (gstate.value === 'bosswarning') {
        gstate.value = 'playing'
        spawnBoss()
        waveTotal = 1; waveCount = 1
      }
    }, 2200)
  } else {
    waveTotal = 6 + level.value * 2
    waveCount = waveTotal
    spawnInterval = Math.max(700, 2200 - level.value * 120)
    spawnTimer = 0
  }
}

function spawnEnemy() {
  if (bossActive || waveCount <= 0) return
  // Mix enemy types based on level
  const r = Math.random()
  if (level.value >= 3 && r < 0.25) spawnUFO()
  else if (level.value >= 2 && r < 0.5) spawnDart()
  else spawnAsteroid()
  waveCount--
}

// ─── Collision helpers ────────────────────────────────────────────────────────
function rectOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return Math.abs(ax - bx) < (aw + bw) / 2 && Math.abs(ay - by) < (ah + bh) / 2
}
function circleRect(cx, cy, cr, rx, ry, rw, rh) {
  const dx = Math.abs(cx - rx), dy = Math.abs(cy - ry)
  if (dx > rw / 2 + cr || dy > rh / 2 + cr) return false
  if (dx <= rw / 2 || dy <= rh / 2) return true
  const corner = (dx - rw / 2) ** 2 + (dy - rh / 2) ** 2
  return corner <= cr * cr
}

// ─── Main update ─────────────────────────────────────────────────────────────
function update(dt) {
  shake = Math.max(0, shake - 0.8)

  // Stars
  for (const s of stars) {
    s.y += s.speed
    s.twinkle += 0.05
    if (s.y > VH + 4) s.y = -4
  }

  // Player movement (lerp toward targetX)
  if (player) {
    const spd = player.speedBoost ? 10 : 6.5
    const dx = player.targetX - player.x
    player.x += dx * 0.15
    player.x = Math.max(player.w / 2, Math.min(VW - player.w / 2, player.x))
    if (player.invTimer > 0) player.invTimer -= dt
  }

  // Auto-fire
  shootTimer -= dt
  if (shootTimer <= 0 && player) {
    shootTimer = player.multiShot ? FIRE_RATE * 0.7 : FIRE_RATE
    const cx = player.x
    const ty = player.y - player.h / 2 - 8
    if (player.multiShot) {
      fireBullet(cx - 12, ty, -0.5, -14, 'player', '#00ffff')
      fireBullet(cx,      ty,  0,   -14, 'player', '#00ffff')
      fireBullet(cx + 12, ty,  0.5, -14, 'player', '#00ffff')
    } else {
      fireBullet(cx, ty, 0, -14, 'player', '#00ffff')
    }
  }

  // Spawn enemies
  if (!bossActive && waveCount > 0) {
    spawnTimer -= dt
    if (spawnTimer <= 0) {
      spawnTimer = spawnInterval
      spawnEnemy()
    }
  }

  // Bullets
  for (const b of bullets) {
    b.x += b.vx; b.y += b.vy
    if (b.y < -30 || b.y > VH + 30 || b.x < -30 || b.x > VW + 30) b.dead = true
  }

  // Enemies
  for (const e of enemies) {
    if (e.type === 'asteroid') {
      e.x += e.vx; e.y += e.vy; e.angle += e.rotSpd
      if (e.y > VH + 60) e.dead = true
    } else if (e.type === 'ufo') {
      e.sineT += 0.04
      e.x += e.vx + Math.sin(e.sineT) * e.sineAmp * 0.04
      e.y += e.vy
      if (e.x < -80 || e.x > VW + 80 || e.y > VH + 50) e.dead = true
      // UFO shoots at player
      if (player && level.value >= 2) {
        e.shootTimer -= dt
        if (e.shootTimer <= 0) {
          e.shootTimer = Math.max(600, 1500 - level.value * 80)
          const dx = player.x - e.x, dy = player.y - e.y
          const d = Math.sqrt(dx * dx + dy * dy)
          fireBullet(e.x, e.y + e.h / 2, dx / d * 5, dy / d * 5, 'enemy', '#ff4444', 5, 12)
        }
      }
    } else if (e.type === 'dart') {
      e.x += e.vx; e.y += e.vy
      if (e.y > VH + 40) e.dead = true
    } else if (e.type === 'boss') {
      e.t += dt
      if (e.phase === 0) {
        // Move in
        e.y += Math.min(e.vy, Math.max(0, e.targetY - e.y) * 0.08 + 0.5)
        if (e.y >= e.targetY) { e.phase = 1; e.vy = 0 }
      } else {
        // Side-to-side
        e.x += e.vx
        if (e.x > VW - e.w / 2 - 10) e.vx = -Math.abs(e.vx)
        if (e.x < e.w / 2 + 10) e.vx = Math.abs(e.vx)
        // Boss shoots bursts
        e.shootTimer -= dt
        if (e.shootTimer <= 0) {
          e.shootTimer = Math.max(600, 2000 - level.value * 60)
          const spread = 5
          for (let i = -spread; i <= spread; i += spread) {
            fireBullet(e.x + i * 10, e.y + e.h / 2,
              i * 0.5 + (player ? (player.x - e.x) / VH * 2 : 0), 6, 'enemy', '#ff6600', 6, 14)
          }
        }
      }
    }
  }

  // Powerups
  for (const p of powerups) {
    p.y += p.vy; p.angle += 0.06
    if (p.y > VH + 40) p.dead = true
  }

  // Active PU timers
  tickPU(dt)

  // Particles
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy
    p.vy += 0.08
    p.vx *= 0.97
    p.life--
    if (p.life <= 0) p.dead = true
  }

  // Float texts
  for (const f of floats) {
    f.y += f.vy; f.life--
    if (f.life <= 0) f.dead = true
  }

  // ── Collision: player bullets vs enemies ─────────────────────────────────
  for (const b of bullets) {
    if (b.dead || b.owner !== 'player') continue
    for (const e of enemies) {
      if (e.dead) continue
      const hit = e.type === 'asteroid'
        ? circleRect(b.x, b.y, 3, e.x, e.y, e.r * 2, e.r * 2)
        : rectOverlap(b.x, b.y, b.w, b.h, e.x, e.y, e.w, e.h)
      if (hit) {
        b.dead = true
        e.hp--
        sparkle(b.x, b.y, '#00ffff', 5)
        if (e.hp <= 0) {
          e.dead = true
          const pts = e.pts * combo.value
          score.value += pts
          combo.value = Math.min(8, combo.value + 1)
          addFloat(e.x, e.y, `+${pts}`, combo.value > 2 ? '#ff9900' : '#ffff88')
          const explColor = e.type === 'boss' ? '#ff6600' : e.type === 'ufo' ? '#44ff44' : '#ffaa44'
          burst(e.x, e.y, explColor, e.type === 'boss' ? 30 : 16)
          burst(e.x, e.y, '#ffffff', 8, 2)
          if (e.type !== 'boss') maybeDropPU(e.x, e.y)
          else {
            // Boss drops lots of power-ups
            for (let i = 0; i < 3; i++) {
              setTimeout(() => {
                if (player) powerups.push({ ...PU_TYPES[i % PU_TYPES.length], x: e.x + (i - 1) * 40, y: e.y, vy: 1.8, angle: 0, w: 26, h: 26, dead: false })
              }, i * 200)
            }
            bossActive = false
          }
        }
        break
      }
    }
  }

  // ── Collision: enemy bullets & enemies vs player ──────────────────────────
  if (player && player.invTimer <= 0) {
    for (const b of bullets) {
      if (b.dead || b.owner !== 'enemy') continue
      if (rectOverlap(b.x, b.y, b.w, b.h, player.x, player.y, player.w, player.h)) {
        b.dead = true
        hitPlayer()
        break
      }
    }
    for (const e of enemies) {
      if (e.dead) continue
      const hit = e.type === 'asteroid'
        ? circleRect(player.x, player.y, player.w / 2 * 0.8, e.x, e.y, e.r * 2, e.r * 2)
        : rectOverlap(player.x, player.y, player.w * 0.8, player.h * 0.8, e.x, e.y, e.w * 0.8, e.h * 0.8)
      if (hit) {
        hitPlayer()
        e.hp -= 2
        if (e.hp <= 0) {
          e.dead = true
          burst(e.x, e.y, '#ffaa44', 10)
          if (e.type === 'boss') bossActive = false
        }
        break
      }
    }
  }

  // ── Collision: powerups vs player ─────────────────────────────────────────
  for (const p of powerups) {
    if (p.dead) continue
    if (rectOverlap(p.x, p.y, p.w, p.h, player.x, player.y, player.w, player.h)) {
      p.dead = true
      applyPU(p.type)
      sparkle(p.x, p.y, p.color, 10)
      addFloat(p.x, p.y - 20, p.label || p.type, p.color)
    }
  }

  // Cleanup dead objects
  bullets   = bullets.filter(b => !b.dead)
  enemies   = enemies.filter(e => !e.dead)
  particles = particles.filter(p => !p.dead)
  powerups  = powerups.filter(p => !p.dead)
  floats    = floats.filter(f => !f.dead)

  // ── Check wave complete ───────────────────────────────────────────────────
  if (gstate.value === 'playing' && enemies.length === 0 && waveCount === 0 && !bossActive) {
    const bonus = level.value * 100
    levelBonus.value = bonus
    score.value += bonus
    level.value++
    gstate.value = 'levelup'
  }
}

// ─── Hit player ──────────────────────────────────────────────────────────────
function hitPlayer() {
  if (player.invTimer > 0) return
  if (player.shieldHP > 0) {
    player.shieldHP--
    burst(player.x, player.y, '#00aaff', 10)
    addFloat(player.x, player.y - 30, 'SHIELD!', '#00aaff')
    player.invTimer = 600
    shake = 4
    if (player.shieldHP === 0) {
      const idx = activePU.findIndex(p => p.type === 'shield')
      if (idx !== -1) activePU.splice(idx, 1)
    }
    return
  }
  lives.value--
  burst(player.x, player.y, '#ff4466', 18)
  shake = 12
  combo.value = 1
  if (lives.value <= 0) {
    burst(player.x, player.y, '#ffaa44', 30)
    player = null
    setTimeout(() => {
      if (score.value > highScore.value) {
        highScore.value = score.value
        localStorage.setItem('ss_hs', score.value)
        newRecord.value = true
      }
      gstate.value = 'gameover'
    }, 800)
  } else {
    player.invTimer = INV_TIME
    addFloat(player.x, player.y - 40, `${lives.value} LIVES LEFT`, '#ff4466')
  }
}

// ─── Draw ─────────────────────────────────────────────────────────────────────
function draw() {
  if (!ctx) return
  const c = ctx

  // Screen shake transform
  c.save()
  if (shake > 0.5) {
    c.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake)
  }

  // Background
  const bg = c.createLinearGradient(0, 0, 0, VH)
  bg.addColorStop(0, '#000814')
  bg.addColorStop(1, '#001028')
  c.fillStyle = bg
  c.fillRect(0, 0, VW, VH)

  // Stars
  for (const s of stars) {
    const twinkle = 0.5 + 0.5 * Math.sin(s.twinkle)
    c.globalAlpha = s.alpha * twinkle
    c.fillStyle = '#ffffff'
    c.beginPath()
    c.arc(s.x, s.y, s.size, 0, Math.PI * 2)
    c.fill()
  }
  c.globalAlpha = 1

  // Particles
  for (const p of particles) {
    c.globalAlpha = p.life / p.maxLife
    c.fillStyle = p.color
    c.beginPath()
    c.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2)
    c.fill()
  }
  c.globalAlpha = 1

  // Power-ups
  for (const p of powerups) {
    c.save()
    c.translate(p.x, p.y)
    c.rotate(p.angle)
    // Glow
    c.shadowColor = p.color
    c.shadowBlur = 12
    c.fillStyle = p.color + '33'
    c.strokeStyle = p.color
    c.lineWidth = 1.5
    c.beginPath()
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const r = 13
      i === 0 ? c.moveTo(Math.cos(a) * r, Math.sin(a) * r) : c.lineTo(Math.cos(a) * r, Math.sin(a) * r)
    }
    c.closePath()
    c.fill()
    c.stroke()
    c.shadowBlur = 0
    c.font = '14px Sarabun'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillText(p.icon, 0, 0)
    c.restore()
  }

  // Enemies
  for (const e of enemies) {
    c.save()
    c.translate(e.x, e.y)

    if (e.type === 'asteroid') {
      c.rotate(e.angle)
      c.shadowColor = '#884422'
      c.shadowBlur = 8
      c.fillStyle = '#7a5c3a'
      c.strokeStyle = '#c49a6c'
      c.lineWidth = 1.5
      c.beginPath()
      e.verts.forEach((v, i) => i === 0 ? c.moveTo(v.x, v.y) : c.lineTo(v.x, v.y))
      c.closePath(); c.fill(); c.stroke()
      // Crack details
      c.shadowBlur = 0
      c.strokeStyle = '#c49a6c55'
      c.lineWidth = 0.8
      c.beginPath()
      c.moveTo(-e.r * 0.3, -e.r * 0.2)
      c.lineTo(e.r * 0.1, e.r * 0.3)
      c.stroke()
    }

    else if (e.type === 'ufo') {
      const w = e.w, h = e.h
      // Shadow/glow
      c.shadowColor = '#44ff44'
      c.shadowBlur = 18
      // Saucer body (ellipse)
      c.fillStyle = '#224422'
      c.strokeStyle = '#44ff44'
      c.lineWidth = 1.5
      c.beginPath()
      c.ellipse(0, 4, w / 2, h / 2 * 0.55, 0, 0, Math.PI * 2)
      c.fill(); c.stroke()
      // Dome
      c.fillStyle = '#336633'
      c.strokeStyle = '#66ff66'
      c.lineWidth = 1
      c.beginPath()
      c.ellipse(0, -2, w * 0.28, h * 0.5, 0, Math.PI, 0)
      c.fill(); c.stroke()
      // Lights
      c.shadowBlur = 0
      const lc = ['#ff4444', '#ffff44', '#44ff44', '#44ffff', '#ff44ff']
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 + e.sineT
        c.fillStyle = lc[i]
        c.beginPath()
        c.arc(Math.cos(a) * w * 0.38, 4 + Math.sin(a) * h * 0.15, 2.5, 0, Math.PI * 2)
        c.fill()
      }
      // HP bar
      if (e.hp < e.maxHp) {
        const bw = w * 0.9
        c.fillStyle = '#ff0000'; c.fillRect(-bw / 2, -h / 2 - 10, bw, 4)
        c.fillStyle = '#00ff44'; c.fillRect(-bw / 2, -h / 2 - 10, bw * (e.hp / e.maxHp), 4)
      }
    }

    else if (e.type === 'dart') {
      c.shadowColor = '#ff4444'
      c.shadowBlur = 12
      c.fillStyle = '#aa1111'
      c.strokeStyle = '#ff6666'
      c.lineWidth = 1.5
      c.beginPath()
      c.moveTo(0, e.h / 2)
      c.lineTo(-e.w / 2, -e.h / 2)
      c.lineTo(0, -e.h / 2 * 0.5)
      c.lineTo(e.w / 2, -e.h / 2)
      c.closePath(); c.fill(); c.stroke()
      // Exhaust
      c.shadowBlur = 0
      c.fillStyle = '#ff660088'
      c.beginPath()
      c.moveTo(-5, e.h / 2)
      c.lineTo(5, e.h / 2)
      c.lineTo(0, e.h / 2 + 10 + Math.random() * 6)
      c.closePath(); c.fill()
    }

    else if (e.type === 'boss') {
      const w = e.w, h = e.h
      const pulse = 0.5 + 0.5 * Math.sin(e.t * 0.003)
      c.shadowColor = '#ff4400'
      c.shadowBlur = 20 + pulse * 15
      // Main hull
      c.fillStyle = '#330011'
      c.strokeStyle = '#ff4400'
      c.lineWidth = 2
      c.beginPath()
      c.moveTo(0, -h / 2)
      c.lineTo(w / 2, -h * 0.1)
      c.lineTo(w * 0.42, h / 2)
      c.lineTo(-w * 0.42, h / 2)
      c.lineTo(-w / 2, -h * 0.1)
      c.closePath(); c.fill(); c.stroke()
      // Core
      c.shadowColor = '#ff0000'
      c.shadowBlur = 30
      c.fillStyle = `rgba(255, ${80 + pulse * 80}, 0, ${0.8 + pulse * 0.2})`
      c.beginPath()
      c.arc(0, 0, 18 + pulse * 6, 0, Math.PI * 2)
      c.fill()
      // Wing details
      c.shadowBlur = 8
      c.strokeStyle = '#ff6600'
      c.lineWidth = 1.5
      for (let sign of [-1, 1]) {
        c.beginPath()
        c.moveTo(sign * 20, -10)
        c.lineTo(sign * w * 0.4, 0)
        c.lineTo(sign * w * 0.35, h * 0.3)
        c.stroke()
      }
      // Cannon ports
      c.shadowBlur = 0
      c.fillStyle = '#ff4400'
      for (let i = -2; i <= 2; i++) {
        c.beginPath()
        c.arc(i * 22, h / 2 - 8, 4, 0, Math.PI * 2)
        c.fill()
      }
      // HP bar
      const bw = w * 1.1
      c.fillStyle = '#440000'; c.fillRect(-bw / 2, h / 2 + 14, bw, 8)
      c.fillStyle = '#ff2200'; c.fillRect(-bw / 2, h / 2 + 14, bw * (e.hp / e.maxHp), 8)
      c.strokeStyle = '#ff6600'; c.lineWidth = 1
      c.strokeRect(-bw / 2, h / 2 + 14, bw, 8)
      // BOSS label
      c.shadowBlur = 0
      c.font = 'bold 11px Orbitron, monospace'
      c.fillStyle = '#ff6600'
      c.textAlign = 'center'
      c.fillText('BOSS', 0, h / 2 + 36)
    }

    c.restore()
  }

  // Bullets
  for (const b of bullets) {
    c.save()
    if (b.owner === 'player') {
      c.shadowColor = '#00ffff'
      c.shadowBlur = 14
      c.fillStyle = '#aaffff'
      c.beginPath()
      c.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 2)
      c.fill()
      c.fillStyle = '#ffffff'
      c.beginPath()
      c.roundRect(b.x - b.w / 2 + 1, b.y - b.h / 2, b.w - 2, 5, 1)
      c.fill()
    } else {
      c.shadowColor = b.color
      c.shadowBlur = 12
      c.fillStyle = b.color
      c.beginPath()
      c.arc(b.x, b.y, b.w / 2, 0, Math.PI * 2)
      c.fill()
    }
    c.restore()
  }

  // Player ship
  if (player) {
    const visible = player.invTimer <= 0 || (Math.floor(player.invTimer / 80) % 2 === 0)
    if (visible) {
      c.save()
      c.translate(player.x, player.y)
      const w = player.w, h = player.h

      // Engine glow
      c.shadowColor = '#0088ff'
      c.shadowBlur = 18
      c.fillStyle = '#0066ff55'
      c.beginPath()
      c.ellipse(0, h / 2 + 8, 12, 5, 0, 0, Math.PI * 2)
      c.fill()

      // Flame (animated)
      const fl = 12 + Math.random() * 8
      c.shadowColor = '#00aaff'
      c.shadowBlur = 15
      c.fillStyle = '#0066ff'
      c.beginPath()
      c.moveTo(-8, h / 2 - 2)
      c.lineTo(8, h / 2 - 2)
      c.lineTo(0, h / 2 + fl)
      c.closePath(); c.fill()
      c.fillStyle = '#44ccff'
      c.beginPath()
      c.moveTo(-4, h / 2 - 2)
      c.lineTo(4, h / 2 - 2)
      c.lineTo(0, h / 2 + fl * 0.6)
      c.closePath(); c.fill()

      // Main hull
      c.shadowColor = '#00ccff'
      c.shadowBlur = 12
      c.fillStyle = '#003366'
      c.strokeStyle = '#00ccff'
      c.lineWidth = 1.5
      c.beginPath()
      c.moveTo(0, -h / 2)
      c.lineTo(w / 2, h * 0.2)
      c.lineTo(w * 0.35, h / 2)
      c.lineTo(-w * 0.35, h / 2)
      c.lineTo(-w / 2, h * 0.2)
      c.closePath(); c.fill(); c.stroke()

      // Wings
      c.fillStyle = '#004488'
      c.strokeStyle = '#0099ff'
      c.lineWidth = 1
      for (const sign of [-1, 1]) {
        c.beginPath()
        c.moveTo(sign * w * 0.35, h * 0.1)
        c.lineTo(sign * w * 0.5, h * 0.2)
        c.lineTo(sign * w * 0.45, h * 0.45)
        c.lineTo(sign * w * 0.2, h / 2)
        c.closePath(); c.fill(); c.stroke()
      }

      // Cockpit
      c.shadowColor = '#aaffff'
      c.shadowBlur = 8
      c.fillStyle = '#aaffff44'
      c.strokeStyle = '#00ffff'
      c.lineWidth = 1
      c.beginPath()
      c.ellipse(0, -h * 0.1, w * 0.2, h * 0.22, 0, 0, Math.PI * 2)
      c.fill(); c.stroke()

      // Center stripe
      c.shadowBlur = 0
      c.strokeStyle = '#00ccff66'
      c.lineWidth = 1
      c.beginPath()
      c.moveTo(0, -h * 0.4); c.lineTo(0, h * 0.4)
      c.stroke()

      // Shield ring
      if (player.shieldHP > 0) {
        c.shadowColor = '#0088ff'
        c.shadowBlur = 20
        c.strokeStyle = `rgba(0,170,255,${0.6 + 0.4 * Math.sin(Date.now() * 0.005)})`
        c.lineWidth = 3
        c.beginPath()
        c.arc(0, 0, Math.max(w, h) * 0.7, 0, Math.PI * 2)
        c.stroke()
      }

      c.restore()
    }
  }

  // Float texts
  c.save()
  for (const f of floats) {
    const a = f.life / f.maxLife
    c.globalAlpha = a
    c.shadowColor = f.color
    c.shadowBlur = 8
    c.font = 'bold 13px Orbitron, monospace'
    c.fillStyle = f.color
    c.textAlign = 'center'
    c.fillText(f.text, f.x, f.y)
  }
  c.globalAlpha = 1
  c.restore()

  c.restore() // end shake transform
}

// ─── Game loop ────────────────────────────────────────────────────────────────
function loop(ts) {
  raf = requestAnimationFrame(loop)
  const dt = Math.min(ts - lastTime, 50)
  lastTime = ts
  if (gstate.value === 'playing') update(dt)
  draw()
}

// ─── Canvas scaling ──────────────────────────────────────────────────────────
function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const scaleX = window.innerWidth / VW
  const scaleY = window.innerHeight / VH
  const scale = Math.min(scaleX, scaleY)
  canvas.style.width  = Math.round(VW * scale) + 'px'
  canvas.style.height = Math.round(VH * scale) + 'px'
  canvas.style.left   = Math.round((window.innerWidth  - VW * scale) / 2) + 'px'
  canvas.style.top    = Math.round((window.innerHeight - VH * scale) / 2) + 'px'
}

function getCanvasPos(clientX, clientY) {
  const r = canvasRef.value.getBoundingClientRect()
  return { x: (clientX - r.left) / r.width * VW, y: (clientY - r.top) / r.height * VH }
}

function onMouseMove(e) {
  if (!player || gstate.value !== 'playing') return
  player.targetX = getCanvasPos(e.clientX, e.clientY).x
}

function onTouchMove(e) {
  if (!player || gstate.value !== 'playing') return
  const t = e.touches[0]
  player.targetX = getCanvasPos(t.clientX, t.clientY).x
}

// ─── Game control ────────────────────────────────────────────────────────────
function startGame() {
  resetPlayer(); bullets = []; enemies = []; particles = []; powerups = []; floats = []
  activePU.length = 0
  score.value = 0; lives.value = MAX_LIVES; level.value = 1
  combo.value = 1; newRecord.value = false; shootTimer = 0
  bossActive = false
  gstate.value = 'playing'
  startWave()
}

function restartGame() {
  startGame()
}

function advanceLevel() {
  resetPlayer(); bullets = []; enemies = []; particles = []
  powerups = []; floats = []
  activePU.length = 0
  combo.value = 1; bossActive = false; shootTimer = 0
  gstate.value = 'playing'
  startWave()
}

function togglePause() {
  if (gstate.value === 'playing') gstate.value = 'paused'
  else if (gstate.value === 'paused') gstate.value = 'playing'
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = VW; canvas.height = VH
  ctx = canvas.getContext('2d')
  initStars()
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('keydown', e => {
    if (e.key === 'p' || e.key === 'Escape') togglePause()
  })
  raf = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
/* Boss overlay (needs keyframe animation — kept in CSS) */
.boss-overlay {
  animation: pulse-bg 0.4s ease-in-out infinite alternate;
}
@keyframes pulse-bg {
  from { background: rgba(30, 0, 0, 0.85); }
  to   { background: rgba(65, 0, 0, 0.93); }
}

/* Boss title flicker */
.boss-flicker {
  animation: flicker 0.4s infinite;
}
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.bounce-enter-active { animation: bounce-in 0.4s cubic-bezier(.68, -.55, .27, 1.55); }
.bounce-leave-active { animation: bounce-in 0.2s reverse; }
@keyframes bounce-in {
  from { transform: scale(0.7); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

/* Glow pulse on title */
.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
  text-shadow: 0 0 10px #00ccff, 0 0 20px rgba(0,204,255,0.4);
}
@keyframes glow-pulse {
  0%, 100% { text-shadow: 0 0 10px #00ccff, 0 0 20px rgba(0,204,255,0.4); }
  50%       { text-shadow: 0 0 22px #00ccff, 0 0 44px rgba(0,204,255,0.7), 0 0 66px rgba(0,204,255,0.3); }
}
</style>
