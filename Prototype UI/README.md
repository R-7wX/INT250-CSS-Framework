# Travelaroha — Vue 3 + Vite

Travel discovery and trip planning app. Browse 129 destinations across 20 countries, build day-by-day itineraries, track budgets and pack for the trip — all in 6 languages.

## Tech Stack

| | |
|---|---|
| **Vue 3.4** | Composition API + `<script setup>` |
| **Vite 5.2** | Dev server & build |
| **Vue Router 4.3** | SPA routing (hash history) |
| **Pinia 2.1** | Global state — saved places, board, checklist, trip meta |
| **Tailwind CSS 3.4** | Utility-first styling + dark mode |

## Project Structure

```
src/
├── App.vue                  # Root layout + toast outlet + modals
├── main.js                  # Entry point
├── style.css                # Tailwind directives + shared styles
├── router/
│   └── index.js             # Route definitions (hash history)
├── stores/
│   └── useAppStore.js       # Pinia store — lang, dark, saved, board, checklist, trip meta
├── composables/
│   └── useI18n.js           # t() helper + reactive lang ref
├── data/
│   ├── places.js            # PLACES (129 destinations), PLACE_NAMES, PLACE_DESCS, ALL_PLACES
│   ├── i18n.js              # UI string translations (th / en / zh / es / ar / fr)
│   ├── countries.js         # DB_COUNTRIES — exchange rates & trip cost data
│   └── checklist.js         # Packing list sections & items
├── components/
│   ├── NavBar.vue           # Top nav + mobile bottom nav + language switcher
│   ├── SbCard.vue           # Storyboard drag card with time stepper
│   ├── TimeStepper.vue      # 12h / 24h time input widget
│   ├── ToastStack.vue       # Toast notification stack (with undo support)
│   ├── ConfirmModal.vue     # Reusable confirm / danger dialog
│   ├── DatePicker.vue       # Travel date picker
│   └── OnboardingModal.vue  # First-run welcome flow
└── views/
    ├── Discovery.vue        # Destination grid — vibe filters, save, gradient image skeleton
    ├── Storyboard.vue       # Day-by-day planner — drag & drop, time scheduling
    ├── Dashboard.vue        # Exchange rates, trip summary, cost calculator
    └── Checklist.vue        # Packing checklist + itinerary + JSON export
```

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

## Features

- 🌍 **Discovery** — 129 destinations across 20 countries, filter by 5 vibes (Urban Adventure, Slow Living, Nature Retreat, Foodie Tour, Beach Getaway), save favourites, gradient skeleton while images load
- 🗺️ **Storyboard** — drag & drop day planner, 12h/24h time scheduling, multi-day boards, export to Checklist
- 📊 **Dashboard** — live exchange rates, trip cost summary, per-category budget calculator
- 📋 **Checklist** — auto-generated packing list from Storyboard, itinerary view, JSON export
- 🌐 **6 Languages** — Thai, English, Chinese, Spanish, Arabic, French (RTL support for Arabic)
- 🌙 **Dark mode** — system-aware default, toggled and persisted via localStorage
- 💾 **Auto-save** — all state (board, saved places, checklist, trip name, date) persisted to localStorage via Pinia
- 🔔 **Toast notifications** — undo support on destructive actions
- 📅 **Trip metadata** — trip name and travel date saved and shown across views

## Data Notes

`places.js` exports three main objects:

- **`PLACES`** — array of 129 place objects `{ name, country, vibe, emoji, img, desc }`  
  `name` is always the Thai key used throughout the app
- **`PLACE_NAMES`** — multilingual display names keyed by Thai name `{ th, en, zh, es, ar, fr }`
- **`PLACE_DESCS`** — multilingual descriptions keyed by Thai name `{ th, en, zh, es, ar, fr }`

When adding a new place, add an entry to all three objects to ensure full translation support.