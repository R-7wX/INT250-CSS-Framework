<template>
  <div class="min-h-screen" style="background:#f4f4f8;">
    <AppNavbar />

    <main class="max-w-7xl mx-auto px-6 py-8">

      <!-- Hero Banner -->
      <section
        class="relative overflow-hidden rounded-2xl px-10 py-12 text-white"
        style="background: linear-gradient(135deg, #5b4ef8 0%, #7c3aed 60%, #6d28d9 100%)"
      >
        <!-- decorative circles -->
        <div class="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none" style="background:rgba(255,255,255,0.05);" />
        <div class="absolute -bottom-16 right-28 w-40 h-40 rounded-full pointer-events-none" style="background:rgba(255,255,255,0.04);" />

        <p class="text-sm mb-3" style="color:rgba(255,255,255,0.8);">Welcome back, Student 👋</p>
        <h1 class="text-4xl font-bold leading-tight mb-3">
          Continue your learning journey today.
        </h1>
        <p class="text-sm mb-8 max-w-lg leading-relaxed" style="color:rgba(255,255,255,0.7);">
          Track your courses, review assignments, and monitor your learning progress in one place.
        </p>
        <button
          class="bg-white font-semibold text-sm px-8 py-3 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          style="color:#5b4ef8;"
        >
          View My Courses
        </button>
      </section>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StarCard v-for="stat in stats" :key="stat.label" :stat="stat" />
      </div>

      <!-- My Courses -->
      <section class="mt-8">
        <h2 class="text-xl font-bold" style="color:#1a1a2e;">My Courses</h2>
        <p class="text-sm mt-1 mb-5" style="color:#888;">Review your course progress and assignment status.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CourseCard
            v-for="course in courses"
            :key="course.code"
            :course="course"
            @view="openModal"
            @submit="handleSubmit"
          />
        </div>
      </section>

    </main>

    <!-- Modal -->
    <CourseModal
      :course="selectedCourse"
      @close="selectedCourse = null"
      @submit="handleSubmitFromModal"
    />

    <!-- Toast -->
    <ToastNotification ref="toast" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppNavbar         from './components/AppNavbar.vue'
import StarCard          from './components/StarCard.vue'
import CourseCard        from './components/CourseCard.vue'
import CourseModal       from './components/CourseModal.vue'
import ToastNotification from './components/ToastNotification.vue'

const toast          = ref(null)
const selectedCourse = ref(null)

function openModal(course)  { selectedCourse.value = course }
function handleSubmit(course) {
  toast.value?.show({ type: 'success', title: 'Assignment Submitted!', message: course.title })
}
function handleSubmitFromModal(course) {
  selectedCourse.value = null
  handleSubmit(course)
}

const stats = [
  { label: 'Active Courses',      value: '3'   },
  { label: 'Pending Assignments', value: '2'   },
  { label: 'Completed Tasks',     value: '8'   },
  { label: 'Overall Progress',    value: '72%' },
]

const courses = [
  {
    code: 'INT250',
    title: 'CSS Framework',
    description: 'Learn how to build responsive and interactive web applications using Vue.js and Tailwind CSS.',
    progress: 72,
    status: 'In Progress',
    statusColor: 'bg-amber-100 text-amber-600',
  },
  {
    code: 'INT161',
    title: 'Object-Oriented Programming',
    description: 'Practice Java programming, object-oriented design, and software development principles.',
    progress: 58,
    status: 'In Progress',
    statusColor: 'bg-amber-100 text-amber-600',
  },
  {
    code: 'INT300',
    title: 'Database Systems',
    description: 'SQL, relational design, and database management fundamentals.',
    progress: 100,
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-700',
  },
]
</script>
