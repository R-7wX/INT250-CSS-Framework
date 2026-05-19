<template>
  <footer style="background-color: var(--bg-primary); border-top: 1px solid var(--border)">
    <div class="max-w-6xl mx-auto px-6 py-10">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">

        <!-- Branding -->
        <div>
          <p class="font-mono text-sm font-medium accent mb-1">
            <span class="opacity-50">~/</span>atcharayu
          </p>
          <p class="font-mono text-xs text-secondary">
            © {{ new Date().getFullYear() }} Atcharayu Tunyakan · All rights reserved.
          </p>
        </div>

        <!-- Quick links -->
        <div class="flex items-center gap-6">
          <a
            v-for="link in quickLinks"
            :key="link.href"
            :href="link.href"
            class="font-mono text-xs text-secondary hover:accent transition-colors"
          >{{ link.label }}</a>
        </div>

        <!-- Social icons -->
        <div class="flex items-center gap-3">
          <a
            v-for="social in socials"
            :key="social.href"
            :href="social.href"
            target="_blank"
            :aria-label="social.label"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-primary transition-all duration-200 hover:-translate-y-0.5"
            style="border: 1px solid var(--border)"
          >
            <span class="flex items-center justify-center w-4 h-4" v-html="social.icon"></span>
          </a>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="mt-8 pt-6 flex items-center justify-center gap-2" style="border-top: 1px solid var(--border)">
        <span class="font-mono text-xs text-secondary">Built with</span>
        <span class="tag" style="font-size: 10px; padding: 2px 8px">Vue.js</span>
        <span class="tag" style="font-size: 10px; padding: 2px 8px">Tailwind CSS</span>
        <span class="tag" style="font-size: 10px; padding: 2px 8px">Vite</span>
        <span class="font-mono text-xs text-secondary">· Deployed on Vercel</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const quickLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

const socials = [
  {
    href: 'https://github.com/R-7wX',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    label: 'GitHub',
  },
  {
    href: 'mailto:atcharayu.contact@gmail.com',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    label: 'Email',
  },
]
</script>
