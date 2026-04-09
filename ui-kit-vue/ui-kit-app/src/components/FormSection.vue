<template>
  <section class="bg-white rounded-xl shadow-sm p-6">
    <h2 class="text-lg font-bold text-gray-800 mb-1">4. Form Controls</h2>
    <p class="text-sm text-gray-500 mb-4">Consistent form patterns with labels, helper text, and validation style.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Enter your full name"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
        <p class="text-xs text-blue-500 mt-1">Use a clear and complete student name.</p>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
        <input
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
        <p class="text-xs text-gray-400 mt-1">Example: student@mail.kmutt.ac.th</p>
      </div>
    </div>

    <div class="mt-4">
      <label class="block text-sm font-semibold text-gray-700 mb-1">Role</label>
      <select
        v-model="form.role"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="" disabled>Select your role</option>
        <option>Student</option>
        <option>Instructor</option>
        <option>Admin</option>
      </select>
    </div>

    <div class="mt-4">
      <label class="block text-sm font-semibold text-gray-700 mb-1">Message</label>
      <textarea
        v-model="form.message"
        rows="4"
        placeholder="Write your message here"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      ></textarea>
      <p class="text-xs text-red-500 mt-1">This is an example of validation/helper text styling.</p>
    </div>

    <div class="mt-4">
      <button
        @click="handleSubmit"
        class="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
      >
        Submit Form
      </button>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({ name: '', email: '', role: '', message: '' })

function handleSubmit() {
  alert(`Submitted!\nName: ${form.name}\nEmail: ${form.email}\nRole: ${form.role}`)
}
</script>
