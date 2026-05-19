<template>
  <section id="experience" class="py-28" style="background-color: var(--bg-primary)">
    <div class="max-w-6xl mx-auto px-6">

      <div class="text-center mb-16 animate-on-scroll">
        <p class="section-label mb-4">04 / Experience & Activities</p>
        <h2 class="font-display font-bold text-4xl text-primary">
          Learning <span style="color: var(--accent)">Journey</span>
        </h2>
      </div>

      <div class="grid lg:grid-cols-2 gap-10">

        <!-- Education & Courses -->
        <div class="animate-on-scroll">
          <h3 class="font-display font-semibold text-primary mb-6 flex items-center gap-2">
            <span style="color: var(--accent)">▸</span> Education & Coursework
          </h3>

          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-4 top-0 bottom-0 w-px" style="background: var(--border)"></div>

            <div class="space-y-6">
              <div
                v-for="item in education"
                :key="item.title"
                class="pl-10 relative"
              >
                <!-- Dot -->
                <div
                  class="absolute left-2.5 top-1.5 w-3 h-3 rounded-full -translate-x-1/2"
                  style="background: var(--accent)"
                ></div>

                <div
                  class="p-4 rounded-xl"
                  style="background: var(--bg-card); border: 1px solid var(--border)"
                >
                  <div class="flex items-start justify-between flex-wrap gap-2 mb-1">
                    <p class="font-display font-semibold text-primary">{{ item.title }}</p>
                    <span class="font-mono text-xs text-secondary">{{ item.period }}</span>
                  </div>
                  <p class="text-secondary text-sm mb-2">{{ item.subtitle }}</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span
                      v-for="tag in item.tags"
                      :key="tag"
                      class="font-mono text-xs px-2 py-0.5 rounded"
                      style="background: var(--bg-secondary); color: var(--text-secondary)"
                    >{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Certifications & Activities -->
        <div class="animate-on-scroll">
          <h3 class="font-display font-semibold text-primary mb-6 flex items-center gap-2">
            <span style="color: var(--accent)">▸</span> Activities & Achievements
          </h3>

          <div class="space-y-4">
            <div
              v-for="item in activities"
              :key="item.title"
              class="p-4 rounded-xl flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5"
              style="background: var(--bg-card); border: 1px solid var(--border)"
            >
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style="background: var(--accent-glow); color: var(--accent)"
                v-html="item.icon"
              ></div>
              <div>
                <p class="font-display font-semibold text-primary text-sm">{{ item.title }}</p>
                <p class="text-secondary text-xs mt-0.5">{{ item.description }}</p>
                <span class="font-mono text-xs mt-1 block" style="color: var(--accent)">{{ item.year }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
const education = [
  {
    title: 'B.Sc. Information Technology',
    subtitle: 'King Mongkut\'s University of Technology Thonburi (KMUTT) · School of IT',
    period: '2024 – Present',
    tags: ['2nd Year', 'GPAX: In Progress'],
  },
  {
    title: 'INT250: CSS Framework',
    subtitle: 'Vue.js & Tailwind CSS — SPA development, responsive design, component architecture',
    period: 'Sem 2 / 2025',
    tags: ['Vue.js', 'Tailwind CSS', 'SPA'],
  },
]

const activities = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    title: 'Travelaroha — Travel App Project',
    description: 'Developed a full-featured Vue.js travel planning application with multi-language i18n and exchange rate integration.',
    year: '2026',
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    title: 'KMUTT School of IT Student',
    description: 'Active student in the School of Information Technology, participating in coursework and collaborative projects.',
    year: '2024 – Present',
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    title: 'Self-Directed Learning',
    description: 'Continuously expanding skills in frontend frameworks, Python scripting, and UI/UX through independent projects.',
    year: 'Ongoing',
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    title: 'Collaborative Academic Projects',
    description: 'Worked with peers on technical assignments including data analysis, system design, and web development.',
    year: '2024 – Present',
  },
]
</script>
