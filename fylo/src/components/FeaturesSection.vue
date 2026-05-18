<template>
  <section
    id="features"
    class="py-20 px-6 md:px-12 lg:px-20
           bg-gray-50 dark:bg-fylo-dark-blue-2
           transition-colors duration-300"
    aria-label="Features"
  >
    <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
      <div v-for="f in features" :key="f.title" class="feature-card">
        <img :src="f.icon" :alt="f.title" aria-hidden="true" class="w-16 h-16 mb-6" />
        <h3 class="font-heading font-bold text-lg text-gray-900 dark:text-white mb-3">
          {{ f.title }}
        </h3>
        <p class="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
          {{ f.desc }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon:  '/images/icon-access-anywhere.svg',
    title: 'Access your files from anywhere',
    desc:  'The ability to use a smartphone, tablet, or computer to access your account means your files follow you everywhere.',
  },
  {
    icon:  '/images/icon-security.svg',
    title: 'Security you can trust',
    desc:  '2-factor authentication and user-controlled encryption are just a couple of the security features we allow to help secure your files.',
  },
  {
    icon:  '/images/icon-collaboration.svg',
    title: 'Real-time collaboration',
    desc:  'Securely share files and folders with friends, family, and colleagues for live collaboration. No email attachments required.',
  },
  {
    icon:  '/images/icon-any-file.svg',
    title: 'Any file, anywhere',
    desc:  'Upload any type of file — regardless of size and share it to anyone in just a few clicks. Access from any device at any time.',
  },
]
</script>
