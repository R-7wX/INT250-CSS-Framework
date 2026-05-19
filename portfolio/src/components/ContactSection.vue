<template>
  <section id="contact" class="py-28 relative overflow-hidden" style="background-color: var(--bg-secondary)">
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
         style="background: radial-gradient(circle, #00D4FF 0%, transparent 70%)"></div>

    <div class="max-w-4xl mx-auto px-6">
      <div class="text-center mb-14 animate-on-scroll">
        <p class="section-label mb-4">05 / Contact</p>
        <h2 class="font-display font-bold text-4xl text-primary mb-4">
          Let's <span style="color: var(--accent)">Connect</span>
        </h2>
        <p class="text-secondary max-w-md mx-auto">
          I'm open to internship opportunities, collaborative projects, or just a friendly chat about tech.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">

        <!-- Contact info cards -->
        <div class="space-y-4 animate-on-scroll">
          <a
            v-for="contact in contacts"
            :key="contact.label"
            :href="contact.href"
            target="_blank"
            class="flex items-center gap-4 p-5 rounded-xl transition-all duration-200 hover:-translate-y-1 group block"
            style="background: var(--bg-card); border: 1px solid var(--border)"
          >
            <div
              class="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
              style="background: var(--accent-glow)"
            >
              <span class="flex items-center justify-center w-5 h-5" style="color: var(--accent)" v-html="contact.icon"></span>
            </div>
            <div>
              <p class="font-mono text-xs text-secondary mb-0.5">{{ contact.label }}</p>
              <p class="font-display font-medium text-primary group-hover:text-accent transition-colors" style="--tw-text-opacity:1">
                {{ contact.value }}
              </p>
            </div>
            <svg class="w-4 h-4 text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>

        <!-- Quick message form -->
        <div
          class="p-6 rounded-xl animate-on-scroll"
          style="background: var(--bg-card); border: 1px solid var(--border)"
        >
          <p class="font-mono text-xs mb-5" style="color: var(--accent)">// send a message</p>

          <div class="space-y-4">
            <div>
              <label class="font-mono text-xs text-secondary block mb-1.5">Your Name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="John Doe"
                class="w-full px-4 py-2.5 rounded-lg font-mono text-sm text-primary outline-none focus:ring-1 transition-all"
                style="background: var(--bg-secondary); border: 1px solid var(--border); focus-ring-color: var(--accent)"
                :style="focusStyle"
                @focus="focusedField='name'"
                @blur="focusedField=null"
              />
            </div>
            <div>
              <label class="font-mono text-xs text-secondary block mb-1.5">Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                class="w-full px-4 py-2.5 rounded-lg font-mono text-sm text-primary outline-none transition-all"
                style="background: var(--bg-secondary); border: 1px solid var(--border)"
              />
            </div>
            <div>
              <label class="font-mono text-xs text-secondary block mb-1.5">Message</label>
              <textarea
                v-model="form.message"
                rows="4"
                placeholder="Hi Atcharayu, I'd like to..."
                class="w-full px-4 py-2.5 rounded-lg font-mono text-sm text-primary outline-none transition-all resize-none"
                style="background: var(--bg-secondary); border: 1px solid var(--border)"
              ></textarea>
            </div>
            <a
              :href="mailtoLink"
              class="w-full inline-flex justify-center items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-medium transition-all duration-200 hover:opacity-90"
              style="background: var(--accent); color: #0A0A0F"
            >
              Send Message
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const form = ref({ name: '', email: '', message: '' })
const focusedField = ref(null)

const focusStyle = computed(() =>
  focusedField.value === 'name'
    ? { border: '1px solid var(--accent)' }
    : { border: '1px solid var(--border)' }
)

const mailtoLink = computed(() => {
  const subject = encodeURIComponent(`Portfolio Contact from ${form.value.name || 'Visitor'}`)
  const body = encodeURIComponent(form.value.message || '')
  return `mailto:atcharayu.contact@gmail.com?subject=${subject}&body=${body}`
})

const contacts = [
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    label: 'Email',
    value: 'atcharayu.contact@gmail.com',
    href: 'mailto:atcharayu.contact@gmail.com',
  },
  {
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    label: 'GitHub',
    value: 'github.com/R-7wX',
    href: 'https://github.com/R-7wX',
  },
]
</script>
