<template>
  <section id="about" class="py-28" style="background-color: var(--bg-secondary)">
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid lg:grid-cols-2 gap-16 items-center">

        <!-- Left: Text -->
        <div class="animate-on-scroll">
          <p class="section-label mb-4">01 / About Me</p>
          <h2 class="font-display font-bold text-4xl text-primary mb-6">
            Crafting digital<br/>
            <span style="color: var(--accent)">experiences</span> with purpose
          </h2>
          <p class="text-secondary leading-relaxed mb-5">
            I'm <strong class="text-primary font-semibold">Atcharayu Tunyakan</strong> — a 2nd-year IT student at
            King Mongkut's University of Technology Thonburi (KMUTT), School of Information Technology.
            I'm passionate about building beautiful, functional web applications that solve real problems.
          </p>
          <p class="text-secondary leading-relaxed mb-5">
            My journey in tech started with curiosity about how websites work, and quickly grew into
            a deep interest in frontend development, data structures, and user experience design.
            I enjoy the process of turning ideas into polished, accessible interfaces.
          </p>
          <p class="text-secondary leading-relaxed">
            When I'm not coding, I'm exploring new technologies, working on creative side projects,
            and collaborating with fellow students on interesting challenges.
          </p>
        </div>

        <!-- Right: Info cards -->
        <div class="grid grid-cols-1 gap-4 animate-on-scroll">
          <div
            v-for="card in cards"
            :key="card.title"
            class="p-5 rounded-xl flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5"
            style="background: var(--bg-card); border: 1px solid var(--border)"
          >
            <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                 style="background: var(--accent-glow)">
              <span class="flex items-center justify-center w-5 h-5" style="color: var(--accent)" v-html="card.icon"></span>
            </div>
            <div>
              <p class="font-display font-semibold text-primary text-sm mb-1">{{ card.title }}</p>
              <p class="text-secondary text-sm leading-relaxed">{{ card.value }}</p>
            </div>
          </div>

          <!-- Career goal highlight -->
          <div
            class="p-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
            style="background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,102,255,0.08) 100%); border: 1px solid rgba(0,212,255,0.2)"
          >
            <p class="font-mono text-xs mb-2" style="color: var(--accent)">// career_goal</p>
            <p class="text-primary font-semibold">Aspiring Frontend Developer</p>
            <p class="text-secondary text-sm mt-1">
              Seeking internship / coop opportunities in web development, UI/UX, or full-stack engineering.
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
const cards = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    title: 'Education',
    value: 'B.Sc. Information Technology · KMUTT, School of IT · 2nd Year (2024–Present)',
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    title: 'Location',
    value: 'Bangkok, Thailand',
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
    title: 'Interests',
    value: 'Frontend Development · UI/UX Design · Data Structures · Open Source',
  },
]
</script>
