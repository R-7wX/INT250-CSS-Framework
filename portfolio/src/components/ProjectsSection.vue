<template>
  <section id="projects" class="py-28" style="background-color: var(--bg-secondary)">
    <div class="max-w-6xl mx-auto px-6">

      <div class="text-center mb-16 animate-on-scroll">
        <p class="section-label mb-4">03 / Projects</p>
        <h2 class="font-display font-bold text-4xl text-primary">
          Featured <span style="color: var(--accent)">Work</span>
        </h2>
        <p class="text-secondary mt-3 max-w-lg mx-auto">
          Projects I've built to apply and deepen my skills in frontend development and beyond.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(project, index) in projects"
          :key="project.title"
          class="group rounded-xl overflow-hidden animate-on-scroll transition-all duration-300 hover:-translate-y-2 flex flex-col"
          :style="`background: var(--bg-card); border: 1px solid var(--border); animation-delay: ${index * 0.1}s`"
        >
          <!-- Project image placeholder -->
          <div
            class="h-44 flex items-center justify-center relative overflow-hidden"
            :style="`background: linear-gradient(135deg, ${project.colorA} 0%, ${project.colorB} 100%)`"
          >
            <img v-if="project.image" :src="project.image" class="w-24 h-24 object-contain drop-shadow-lg" alt="project logo" />
            <span v-else class="text-5xl">{{ project.icon }}</span>
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3"
                 style="background: rgba(0,0,0,0.5)">
              <a
                v-if="project.demo"
                :href="project.demo"
                target="_blank"
                class="px-4 py-2 rounded font-mono text-xs font-medium"
                style="background: var(--accent); color: #0A0A0F"
              >Live Demo</a>
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                class="px-4 py-2 rounded font-mono text-xs font-medium border"
                style="border-color: white; color: white"
              >GitHub</a>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 flex flex-col flex-1">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-display font-bold text-primary text-lg">{{ project.title }}</h3>
              <span
                class="font-mono text-xs px-2 py-0.5 rounded"
                :style="`background: var(--accent-glow); color: var(--accent)`"
              >{{ project.type }}</span>
            </div>

            <p class="text-secondary text-sm leading-relaxed mb-4 flex-1">{{ project.description }}</p>

            <!-- Role badge -->
            <p class="font-mono text-xs text-secondary mb-3">
              <span style="color: var(--accent)">Role:</span> {{ project.role }}
            </p>

            <!-- Tech stack -->
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tech in project.tech"
                :key="tech"
                class="font-mono text-xs px-2 py-0.5 rounded"
                style="background: var(--bg-secondary); color: var(--text-secondary)"
              >{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
const projects = [
  {
    title: 'Travelaroha',
    type: 'Web App',
    icon: null,
    image: '/travelaroha-logo.png',
    colorA: 'rgba(0,100,180,0.7)',
    colorB: 'rgba(0,212,255,0.4)',
    description:
      'A travel planning web application featuring a discovery page, trip dashboard, and storyboard. Includes multi-language support (6 languages), real-time currency exchange, and responsive design.',
    role: 'Lead Developer',
    tech: ['Vue.js', 'Tailwind CSS', 'JavaScript', 'i18n', 'REST API'],
    demo: 'https://travelaroha.space',
    github: null,
  },
  {
    title: 'TripTab',
    type: 'Web App',
    icon: null,
    image: '/triptab-logo.png',
    colorA: 'rgba(245,158,11,0.7)',
    colorB: 'rgba(251,191,36,0.35)',
    description:
      'A group expense splitting app for trips — add expenses, assign payers and participants, track by category with charts, and auto-calculate who owes who. Supports multi-currency, dark/light mode, export, and Thai/English language.',
    role: 'Developer',
    tech: ['Vue.js', 'Tailwind CSS', 'JavaScript', 'Vite'],
    demo: 'https://triptab.space',
</script>
