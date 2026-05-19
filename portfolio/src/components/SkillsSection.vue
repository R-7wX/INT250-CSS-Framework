<template>
  <section id="skills" class="py-28" style="background-color: var(--bg-primary)">
    <div class="max-w-6xl mx-auto px-6">

      <div class="text-center mb-16 animate-on-scroll">
        <p class="section-label mb-4">02 / Skills</p>
        <h2 class="font-display font-bold text-4xl text-primary">
          Technical <span style="color: var(--accent)">Toolkit</span>
        </h2>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div
          v-for="(group, index) in skillGroups"
          :key="group.category"
          class="p-6 rounded-xl animate-on-scroll transition-all duration-300 hover:-translate-y-1"
          :style="`background: var(--bg-card); border: 1px solid var(--border); animation-delay: ${index * 0.1}s`"
        >
          <div class="flex items-center gap-3 mb-5">
            <span class="flex items-center justify-center w-6 h-6" style="color: var(--accent)" v-html="group.icon"></span>
            <div>
              <p class="font-display font-semibold text-primary">{{ group.category }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <div
              v-for="skill in group.skills"
              :key="skill.name"
              class="flex items-center gap-2"
            >
              <span class="tag">{{ skill.name }}</span>
            </div>
          </div>

          <!-- Progress bars for key skills -->
          <div v-if="group.showBars" class="mt-5 space-y-3">
            <template v-for="skill in group.skills" :key="skill.name + '-bar'">
              <div v-if="skill.level">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-mono text-xs text-secondary">{{ skill.name }}</span>
                  <span class="font-mono text-xs" style="color: var(--accent)">{{ skill.level }}%</span>
                </div>
                <div class="h-1 rounded-full" style="background: var(--border)">
                  <div
                    class="h-1 rounded-full transition-all duration-1000"
                    :style="`width: ${skill.level}%; background: var(--accent)`"
                  ></div>
                </div>
              </div>
            </template>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
const skillGroups = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    category: 'Frontend',
    showBars: true,
    skills: [
      { name: 'Vue.js', level: 65 },
      { name: 'JavaScript', level: 62 },
      { name: 'HTML/CSS', level: 68 },
      { name: 'Tailwind CSS', level: 64 },
    ],
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 22 22 7 12 2"/><line x1="12" y1="22" x2="12" y2="7"/><polyline points="2 7 12 12 22 7"/></svg>',
    category: 'Programming',
    showBars: true,
    skills: [
      { name: 'Python', level: 58 },
      { name: 'SQL', level: 52 },
      { name: 'C#', level: 45 },
    ],
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    category: 'Tools & Workflow',
    showBars: false,
    skills: [
      { name: 'Git & GitHub' },
      { name: 'VS Code' },
      { name: 'Figma' },
      { name: 'Vite' },
      { name: 'Node.js' },
      { name: 'npm' },
    ],
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    category: 'Concepts',
    showBars: false,
    skills: [
      { name: 'Data Structures' },
      { name: 'Algorithms' },
      { name: 'REST APIs' },
      { name: 'Responsive Design' },
      { name: 'Component-Based Dev' },
    ],
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    category: 'Soft Skills',
    showBars: false,
    skills: [
      { name: 'Problem Solving' },
      { name: 'Team Collaboration' },
      { name: 'Self-Learning' },
      { name: 'Attention to Detail' },
      { name: 'Adaptability' },
    ],
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    category: 'Languages',
    showBars: false,
    skills: [
      { name: 'Thai (Native)' },
      { name: 'English (B2)' },
    ],
  },
]
</script>
