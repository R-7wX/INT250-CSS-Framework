<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="course"
        class="fixed inset-0 z-[90] flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close')" />

        <!-- Modal Panel -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
        >
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
            <!-- Header gradient -->
            <div class="px-6 pt-6 pb-5" style="background: linear-gradient(135deg, #5b4ef8 0%, #7c3aed 100%)">
              <div class="flex items-start justify-between">
                <div>
                  <span class="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full">
                    {{ course.code }}
                  </span>
                  <h2 class="text-xl font-bold text-white mt-2">{{ course.title }}</h2>
                </div>
                <button
                  @click="$emit('close')"
                  class="text-white/70 hover:text-white transition-colors mt-0.5"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 py-5 space-y-4">
              <p class="text-sm text-text-muted leading-relaxed">{{ course.description }}</p>

              <!-- Progress -->
              <div>
                <div class="flex justify-between text-xs text-text-muted mb-1.5">
                  <span class="font-medium">Progress</span>
                  <span :class="course.progress === 100 ? 'text-green-600 font-bold' : 'text-primary font-bold'">
                    {{ course.progress }}%
                  </span>
                </div>
                <div class="progress-bar-track">
                  <div
                    class="progress-bar-fill"
                    :style="{
                      width: course.progress + '%',
                      background: course.progress === 100
                        ? 'linear-gradient(90deg,#16a34a,#4ade80)'
                        : 'linear-gradient(90deg,#5b4ef8,#7c3aed)'
                    }"
                  />
                </div>
              </div>

              <!-- Meta info -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-primary-muted rounded-xl p-3">
                  <p class="text-xs text-text-muted">Status</p>
                  <p class="text-sm font-semibold text-text-main mt-0.5">{{ course.status }}</p>
                </div>
                <div class="bg-primary-muted rounded-xl p-3">
                  <p class="text-xs text-text-muted">Assignments</p>
                  <p class="text-sm font-semibold text-text-main mt-0.5">
                    {{ course.progress === 100 ? 'All Done' : '2 Pending' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 pb-6 flex gap-2">
              <button class="btn-primary flex-1" @click="$emit('close')">Close</button>
              <button
                v-if="course.progress < 100"
                class="btn-secondary flex-1"
                @click="$emit('submit', course)"
              >
                Submit Assignment
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({ course: Object })
defineEmits(['close', 'submit'])
</script>
