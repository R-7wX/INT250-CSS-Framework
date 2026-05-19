<template>
  <section id="hero" class="relative min-h-screen flex items-center overflow-hidden grid-bg">
    <!-- Decorative glow blob -->
    <div class="absolute top-1/3 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
         style="background: radial-gradient(circle, var(--hero-blob-accent) 0%, transparent 70%); transform: translate(30%, -30%)"></div>
    <div class="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl pointer-events-none"
         style="background: radial-gradient(circle, var(--hero-blob-warm) 0%, transparent 70%); transform: translate(-30%, 30%)"></div>

    <div class="max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
      <div class="grid lg:grid-cols-2 gap-16 items-center">

        <!-- Left content -->
        <div>
          <p class="section-label mb-6 animate-fade-up" style="animation-delay: 0.1s">
            <span class="opacity-50">▶</span> Hello, World!
          </p>

          <h1 class="font-display font-extrabold leading-none mb-4 animate-fade-up" style="font-size: clamp(2.5rem, 6vw, 5rem); animation-delay: 0.2s">
            <span class="block text-primary">Atcharayu</span>
            <span class="block" style="color: var(--accent)">Tunyakan</span>
          </h1>

          <div class="flex items-center gap-3 mb-6 animate-fade-up" style="animation-delay: 0.3s">
            <div class="h-px w-8" style="background-color: var(--accent)"></div>
            <span class="font-mono text-sm text-secondary">IT Student · Fullstack Developer</span>
          </div>

          <p class="text-secondary leading-relaxed mb-8 max-w-md animate-fade-up" style="font-size: 1.05rem; animation-delay: 0.4s">
            A passionate IT student at KMUTT, building modern web experiences with
            Vue.js and Tailwind CSS. Focused on clean code, great UX, and continuous learning.
          </p>

          <div class="flex flex-wrap gap-4 animate-fade-up" style="animation-delay: 0.5s">
            <a
              href="#projects"
              class="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm font-medium rounded-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
              style="background-color: var(--accent); color: var(--btn-on-accent)"
            >
              View Projects
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a
              href="#contact"
              class="inline-flex items-center gap-2 px-6 py-3 font-mono text-sm font-medium rounded-sm transition-all duration-200 hover:-translate-y-0.5"
              style="border: 1px solid var(--border); color: var(--text-secondary); background: var(--bg-card);"
              onmouseover="this.style.borderColor='var(--accent)'; this.style.color='var(--text-primary)'"
              onmouseout="this.style.borderColor='var(--border)'; this.style.color='var(--text-secondary)'"
            >
              Contact Me
            </a>
          </div>

          <!-- Badges -->
          <div class="flex flex-wrap gap-2 mt-8 animate-fade-up" style="animation-delay: 0.6s">
            <span class="tag">Vue.js</span>
            <span class="tag">JavaScript</span>
            <span class="tag">Python</span>
            <span class="tag">HTML/CSS</span>
          </div>
        </div>

        <!-- Right: Avatar / Visual -->
        <div class="flex justify-center lg:justify-end animate-fade-up" style="animation-delay: 0.3s">
          <div class="relative">
            <!-- Profile image -->
            <div
              class="w-80 h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden glow-accent"
              style="border: 1px solid var(--border)"
            >
              <img
                src="/profile.png"
                alt="Atcharayu Tunyakan"
                class="w-full h-full object-cover object-top"
              />
            </div>

            <!-- Floating tag -->
            <div
              class="absolute -bottom-4 -left-4 px-4 py-2 rounded-lg font-mono text-xs"
              style="background: var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary)"
            >
              <span style="color: var(--accent)">const</span> role = <span style="color: var(--code-string)">"Fullstack Dev"</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Scroll indicator -->
      <div class="flex justify-center mt-20 animate-fade-up" style="animation-delay: 0.8s">
        <div class="flex flex-col items-center gap-2">
          <span class="font-mono text-xs text-secondary tracking-widest">SCROLL</span>
          <div class="w-px h-10 animate-pulse" style="background: linear-gradient(to bottom, var(--accent), transparent)"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>
