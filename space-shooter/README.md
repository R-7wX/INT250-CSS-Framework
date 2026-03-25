# 🚀 Space Shooter

A Vue 3 + Vite space shooter with **Tailwind CSS** UI.

## Setup

```bash
npm install
npm run dev
```

## What changed (Tailwind migration)

- All scoped CSS replaced with Tailwind utility classes (arbitrary values, custom config)
- Tailwind loaded via CDN Play script in `index.html` with custom `fontFamily` and `keyframes` config
- Added CRT scanlines + vignette overlay for atmosphere
- Enhanced button glow effects, HUD panel styling, and overlay polish
- Kept `<style scoped>` only for keyframe animations (`bounce-in`, `pulse-bg`, `flicker`, `glow-pulse`) and Vue `<Transition>` helper classes — these can't be expressed as pure utility classes

## Controls

- 🖱️ Mouse move / 👆 Touch — move ship
- Auto-fires continuously
- `P` / `Esc` — pause
- Collect power-ups dropped by enemies
- ⚠️ Boss every 3 levels!
