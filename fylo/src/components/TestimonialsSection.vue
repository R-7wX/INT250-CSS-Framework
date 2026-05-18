<template>
  <section
    id="testimonials"
    class="py-20 px-6 md:px-12 lg:px-20
           bg-white dark:bg-fylo-dark-blue
           transition-colors duration-300"
    aria-labelledby="testimonials-heading"
  >
    <h2 id="testimonials-heading" class="sr-only">Testimonials</h2>

    <div class="max-w-5xl mx-auto relative">
      <img
        src="/images/bg-quotes.png"
        alt=""
        aria-hidden="true"
        class="absolute -top-8 left-0 w-10 md:w-14"
      />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div v-for="t in testimonials" :key="t.id" class="testimonial-card">
          <p class="mb-6">{{ t.text }}</p>
          <div class="flex items-center gap-3">
            <img
              :src="t.avatar"
              :alt="t.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p class="font-heading font-bold text-sm text-gray-900 dark:text-white">{{ t.name }}</p>
              <p class="text-xs text-gray-400">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    id: 1,
    text: 'Fylo has improved our team productivity by an order of magnitudes. Since making the switch our team has become a well-oiled collaboration machine.',
    name: 'Satish Patel',
    role: 'Founder & CEO, Huddle',
    avatar: '/images/profile-1.jpg',
  },
  {
    id: 2,
    text: 'Fylo has improved our team productivity by an order of magnitudes. Since making the switch our team has become a well-oiled collaboration machine.',
    name: 'Bruce McKenzie',
    role: 'Founder & CEO, Huddle',
    avatar: '/images/profile-2.jpg',
  },
  {
    id: 3,
    text: 'Fylo has improved our team productivity by an order of magnitudes. Since making the switch our team has become a well-oiled collaboration machine.',
    name: 'Iva Boyd',
    role: 'Founder & CEO, Huddle',
    avatar: '/images/profile-3.jpg',
  },
]
</script>
