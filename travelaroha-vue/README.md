# Travelaroha — Vue 3 + Vite

Travel discovery and trip planning app converted from vanilla HTML prototype to Vue 3 + Vite.

## Tech Stack
- **Vue 3** — Composition API + `<script setup>`
- **Vite 5** — fast dev server & build
- **Vue Router 4** — SPA routing with hash history
- **Pinia** — state management (saved places, language, storyboard, checklist)
- **Tailwind CSS 3** — utility-first styling with dark mode

## Project Structure
```
src/
├── App.vue               # Root layout
├── main.js               # Entry point
├── style.css             # Tailwind + shared component styles
├── router/index.js       # Vue Router config
├── stores/useAppStore.js # Pinia store (lang, dark, savedPlaces, board, checklist)
├── composables/
│   └── useI18n.js        # t() translation composable
├── data/
│   ├── i18n.js           # All 6-language translations (th/en/zh/es/ar/fr)
│   ├── places.js         # PLACES, PLACE_NAMES, PLACE_DESCS, ALL_PLACES
│   ├── countries.js      # DB_COUNTRIES (Dashboard trip data)
│   └── checklist.js      # Packing list sections
├── components/
│   ├── NavBar.vue        # Top nav + mobile bottom nav + lang switcher
│   └── SbCard.vue        # Storyboard drag card
└── views/
    ├── Discovery.vue     # Place browsing with vibe filters + save
    ├── Storyboard.vue    # Day-by-day trip planner with drag & drop
    ├── Dashboard.vue     # Exchange rates + trip summary + cost calculator
    └── Checklist.vue     # Packing checklist + itinerary + plan download
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features
- 🌍 **Discovery** — Browse 100+ destinations, filter by vibe, save favourites
- 🗺️ **Storyboard** — Drag & drop trip planner with time scheduling and day boards
- 📊 **Dashboard** — Live exchange rates, trip summaries, cost calculator
- 📋 **Checklist** — Auto-generated packing list + itinerary from Storyboard
- 🌙 **Dark mode** — Persisted via localStorage
- 🌐 **6 Languages** — Thai, English, Chinese, Spanish, Arabic, French (with RTL support)
- 💾 **Auto-save** — All data persisted to localStorage via Pinia
