<template>
  <section
    class="py-16 px-6 md:px-12
           bg-gray-100 dark:bg-fylo-desaturated-blue
           transition-colors duration-300"
    aria-labelledby="early-access-heading"
  >
    <div class="max-w-2xl mx-auto text-center">
      <h2
        id="early-access-heading"
        class="font-heading font-bold text-2xl md:text-3xl text-gray-900 dark:text-white mb-4"
      >
        Get early access today
      </h2>
      <p class="text-gray-500 dark:text-gray-200 text-sm md:text-base leading-relaxed mb-8">
        It only takes a minute to sign up and our free starter tier is extremely generous.
        If you have any questions, our support team would be happy to help you.
      </p>

      <form
        class="flex flex-col sm:flex-row gap-4"
        @submit.prevent="handleSubmit"
        novalidate
        aria-label="Email sign up form"
      >
        <div class="flex-1 relative">
          <input
            v-model="email"
            type="email"
            placeholder="email@example.com"
            class="input-field"
            :class="{ 'border-fylo-error': error }"
            aria-label="Email address"
            aria-describedby="email-error"
            required
          />
          <p v-if="error" id="email-error" role="alert" class="text-fylo-error text-xs mt-1 text-left pl-4">
            {{ error }}
          </p>
        </div>
        <button type="submit" class="btn-primary whitespace-nowrap">
          Get Started For Free
        </button>
      </form>

      <p v-if="success" role="status" class="mt-4 text-fylo-cyan text-sm">
        You're on the list! We'll be in touch soon.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const email   = ref('')
const error   = ref('')
const success = ref(false)

function handleSubmit() {
  error.value   = ''
  success.value = false
  if (!email.value) {
    error.value = 'Please enter your email address.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  success.value = true
  email.value   = ''
}
</script>
