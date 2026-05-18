<template>
  <section
    id="faq"
    class="py-20 px-6 md:px-12 lg:px-20
           bg-gray-50 dark:bg-fylo-dark-blue-2
           transition-colors duration-300"
    aria-labelledby="faq-heading"
  >
    <div class="max-w-3xl mx-auto">
      <h2 id="faq-heading" class="section-heading text-gray-900 dark:text-white mb-4">
        Frequently Asked Questions
      </h2>
      <p class="text-center text-gray-500 dark:text-gray-300 text-sm mb-10 max-w-xl mx-auto">
        Here are some of our FAQs. If you have any other questions you'd like answered please
        feel free to email us.
      </p>

      <div >
        <FaqItem
          v-for="faq in faqs"
          :key="faq.id"
          :faq="faq"
          
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { faqs } from '../data/faqs.js'
import FaqItem from './FaqItem.vue'
</script>
