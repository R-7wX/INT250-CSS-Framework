<template>
  <!--
    TEMPLATE SECTION
    ─────────────────────────────────────────────────────────
    This is where we write the HTML for our page.
    Vue lets us use special attributes like:
      • v-model  → links an input to a variable (two-way binding)
      • v-if     → shows/hides an element based on a condition
      • v-for    → repeats an element for each item in a list
      • @submit  → listens for the form "submit" event
      • @click   → listens for a "click" event
  -->
  <div class="flex min-h-screen">

    <!-- ── Form Panel ── -->
    <main class="flex-1 overflow-y-auto bg-gray-50 flex items-start justify-center p-6 md:p-10">
      <div class="bg-white rounded-2xl shadow-sm w-full max-w-2xl p-8">

        <!-- Page Header -->
        <div class="mb-6">
          <span class="text-xs font-semibold tracking-widest uppercase text-teal">Hands-on Lab</span>
          <h2 class="text-xl font-bold text-gray-900 mt-1">Student Workshop Registration Form</h2>
          <p class="text-xs text-gray-400 mt-1">
            Practice styling form controls, focus states, and validation feedback with Vue.js and Tailwind CSS.
          </p>
        </div>

        <!--
          FORM ELEMENT
          ────────────────────────────────────────────────
          • novalidate      → turns off the browser's built-in validation
                              so we can show our own custom error messages
          • @submit.prevent → calls handleSubmit() when the user clicks
                              "Submit", and prevents the page from reloading
          • @reset.prevent  → calls handleReset() when the user clicks "Reset"
        -->
        <form novalidate @submit.prevent="handleSubmit" @reset.prevent="handleReset">

          <!-- ── Two-column grid for short fields ── -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <!--
              BaseInput is our reusable input component.
              • v-model="form.fullName"  → keeps the input in sync with form.fullName
              • label                    → the text shown above the input
              • :required="true"         → shows a red asterisk (*) on the label
              • :error-message           → shows an error below the input.
                We only show errors after the user has tried to submit (submitted === true)
            -->
            <BaseInput
              v-model="form.fullName"
              label="Full Name"
              placeholder="Enter your full name"
              :required="true"
              :error-message="submitted ? errors.fullName : ''"
            />

            <BaseInput
              v-model="form.studentId"
              label="Student ID"
              placeholder="e.g. 66012345678"
              :required="true"
              :error-message="submitted ? errors.studentId : ''"
            />

            <BaseInput
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="yourname@example.com"
              :required="true"
              :error-message="submitted ? errors.email : ''"
            />

            <BaseInput
              v-model="form.password"
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              :required="true"
              :error-message="submitted ? errors.password : ''"
            />

            <BaseSelect
              v-model="form.program"
              label="Program / Major"
              placeholder="Select your program"
              :options="programOptions"
              :required="true"
              :error-message="submitted ? errors.program : ''"
            />

            <BaseSelect
              v-model="form.track"
              label="Workshop Track"
              placeholder="Select a track"
              :options="trackOptions"
              :required="true"
              :error-message="submitted ? errors.track : ''"
            />
          </div>

          <!-- ── Year Level (radio buttons) ── -->
          <div class="mt-4">
            <BaseRadioGroup
              v-model="form.yearLevel"
              label="Year Level"
              :options="yearOptions"
              :required="true"
              :error-message="submitted ? errors.yearLevel : ''"
            />
          </div>

          <!-- ── Short Bio (textarea) ── -->
          <div class="mt-4">
            <BaseTextarea
              v-model="form.bio"
              label="Short Bio"
              placeholder="Tell us about your interests..."
              :maxlength="300"
              hint="Optional: briefly describe your interests or previous experience."
            />
          </div>

          <!-- ── Agreement Checkbox ── -->
          <div class="mt-4">
            <BaseCheckbox
              v-model="form.agree"
              :error-message="submitted ? errors.agree : ''"
            >
              I confirm that the information provided is correct and I agree to participate in the workshop activities.
            </BaseCheckbox>
          </div>

          <!-- Tip for students -->
          <p class="text-xs text-gray-400 mt-5">
            <strong class="text-gray-500">Tip:</strong> Try submitting the form with missing fields to see validation feedback.
          </p>

          <!-- ── Form Buttons ── -->
          <div class="flex justify-end gap-3 mt-5">
            <!-- type="reset" triggers the @reset.prevent handler above -->
            <button
              type="reset"
              class="text-sm font-semibold px-5 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Reset
            </button>
            <!-- type="submit" triggers the @submit.prevent handler above -->
            <button
              type="submit"
              class="text-sm font-semibold px-6 py-2 rounded-lg bg-teal text-white hover:bg-teal-dark active:scale-95 transition-all duration-200"
            >
              Submit Registration
            </button>
          </div>

        </form>
      </div>
    </main>

    <!-- ────────────────────────────────────────────────────
      SUCCESS MODAL
      Shown when the form is submitted successfully.
      • <Transition> animates it in/out with a fade effect
      • v-if="showModal" → only renders the modal when showModal is true
      • @click.self      → closes the modal when the dark overlay is clicked
    ──────────────────────────────────────────────────── -->
    <Transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-2xl p-10 text-center max-w-sm w-[90%] shadow-2xl">
          <!-- Green checkmark icon -->
          <div class="w-16 h-16 bg-teal rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-5">
            ✓
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
          <!--
            {{ submittedName }} and {{ submittedTrack }} display
            the values we saved just before clearing the form.
          -->
          <p class="text-sm text-gray-500 leading-relaxed mb-6">
            Thank you, <strong class="text-gray-800">{{ submittedName }}</strong>! Your registration for the
            <strong class="text-gray-800">{{ submittedTrack }}</strong> track has been received. We'll be in touch soon.
          </p>
          <button
            @click="showModal = false"
            class="text-sm font-semibold px-8 py-2.5 rounded-lg bg-teal text-white hover:bg-teal-dark transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
/*
  SCRIPT SECTION
  ─────────────────────────────────────────────────────────
  This is where we write the JavaScript logic for our page.

  Key Vue concepts used here:
    • reactive()  → creates a reactive object. When any property changes,
                    Vue automatically updates the template.
    • ref()       → creates a single reactive value (not an object).
                    Access its value with .value in JavaScript.
    • computed()  → creates a value that is automatically recalculated
                    whenever the data it depends on changes.
*/
import { computed, reactive, ref } from "vue"

// Import our reusable components from the components folder
import BaseInput      from "./components/BaseInput.vue"
import BaseSelect     from "./components/BaseSelect.vue"
import BaseTextarea   from "./components/BaseTextarea.vue"
import BaseRadioGroup from "./components/BaseRadioGroup.vue"
import BaseCheckbox   from "./components/BaseCheckbox.vue"


// ─────────────────────────────────────────────────────────
// FORM STATE
// ─────────────────────────────────────────────────────────
// reactive() creates a single object that holds all our form values.
// We pre-fill some fields with mock data to make testing easier.
// In a real app, these would all start as empty strings ("").
const form = reactive({
  fullName:  "Thanatat Wongabut",
  studentId: "66012345678",
  email:     "thanatat@example.com",
  password:  "secret123",
  program:   "CS",
  yearLevel: "3",
  bio:       "I love building web applications and exploring AI tools. Interested in full-stack development.",
  track:     "frontend",
  agree:     false,
})

// ref() creates individual reactive values.
// submitted      → tracks whether the user has clicked "Submit" at least once.
//                  We use this to only show errors after the first submit attempt.
// showModal      → controls whether the success popup is visible.
// submittedName  → stores the submitted name to display in the modal.
// submittedTrack → stores the submitted track label to display in the modal.
const submitted      = ref(false)
const showModal      = ref(false)
const submittedName  = ref("")
const submittedTrack = ref("")


// ─────────────────────────────────────────────────────────
// DROPDOWN & RADIO OPTIONS
// ─────────────────────────────────────────────────────────
// These arrays power the <select> dropdowns and radio buttons.
// Each object has:
//   label → what the user sees in the UI
//   value → what we store internally in the form object
const programOptions = [
  { label: "Computer Science",           value: "CS"  },
  { label: "Digital Service Innovation", value: "DSI" },
  { label: "Information Technology",     value: "IT"  },
  { label: "Software Engineering",       value: "SE"  },
]

const trackOptions = [
  { label: "Frontend UI Development", value: "frontend" },
  { label: "Backend API Design",      value: "backend"  },
  { label: "UX/UI Design",            value: "ux"       },
  { label: "AI for Productivity",     value: "ai"       },
]

const yearOptions = [
  { value: "1", label: "Year 1" },
  { value: "2", label: "Year 2" },
  { value: "3", label: "Year 3" },
  { value: "4", label: "Year 4" },
]


// ─────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────
/*
  computed() recalculates "errors" automatically every time
  any form field changes. It returns a plain object where:
    • The key   = the field name  (e.g. "fullName")
    • The value = the error text  (e.g. "Full name is required.")

  If a field is valid, we simply don't add a key for it.
  When errors is an empty object {}, the whole form is valid.

  VALIDATION RULES:
    fullName  → must not be blank
    studentId → must not be blank AND must be exactly 11 digits
    email     → must not be blank AND must look like an email
    password  → must not be blank AND must be at least 8 characters
    program   → a program must be selected
    yearLevel → a year level must be selected
    track     → a workshop track must be selected
    agree     → the checkbox must be checked
*/
const errors = computed(() => {
  // Start with an empty errors object — no errors yet
  const e = {}

  // ── Full Name ──────────────────────────────────────
  // .trim() removes leading/trailing spaces before checking if empty
  if (!form.fullName.trim()) {
    e.fullName = "Full name is required."
  }

  // ── Student ID ────────────────────────────────────
  if (!form.studentId.trim()) {
    e.studentId = "Student ID is required."
  } else if (!/^\d{11}$/.test(form.studentId)) {
    // Regex explained: ^\d{11}$
    //   ^      → start of the string
    //   \d{11} → exactly 11 digit characters (0–9)
    //   $      → end of the string
    e.studentId = "Student ID must be 11 digits."
  }

  // ── Email ─────────────────────────────────────────
  if (!form.email.trim()) {
    e.email = "Email is required."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    // This regex checks for the basic shape: something@something.something
    e.email = "Please enter a valid email address."
  }

  // ── Password ──────────────────────────────────────
  if (!form.password.trim()) {
    e.password = "Password is required."
  } else if (form.password.length < 8) {
    e.password = "Password must be at least 8 characters."
  }

  // ── Dropdowns & Radio ─────────────────────────────
  if (!form.program)   e.program   = "Please select your program."
  if (!form.yearLevel) e.yearLevel = "Please select your year level."
  if (!form.track)     e.track     = "Please choose a workshop track."

  // ── Checkbox ──────────────────────────────────────
  if (!form.agree) e.agree = "You must accept the terms before submitting."

  return e
})

// A simple helper: the form is valid only when there are zero error keys.
// Object.keys(obj) returns an array of all the keys in an object.
const isFormValid = computed(() => Object.keys(errors.value).length === 0)


// ─────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────

// Called when the user clicks "Submit Registration"
function handleSubmit() {
  // Step 1: Mark that a submit attempt has happened.
  //         This makes all error messages visible in the template.
  submitted.value = true

  // Step 2: Stop here if there are any errors. Do not continue.
  if (!isFormValid.value) return

  // Step 3: Save the name and track BEFORE clearing the form,
  //         so we can show them in the success modal.
  submittedName.value = form.fullName

  // Find the matching track option to get its human-readable label.
  // For example: form.track = "frontend" → label = "Frontend UI Development"
  const matchedTrack   = trackOptions.find(function(option) {
    return option.value === form.track
  })
  submittedTrack.value = matchedTrack ? matchedTrack.label : form.track

  // Step 4: Show the success modal.
  showModal.value = true

  // Step 5: Clear all form fields back to empty defaults.
  clearForm()
}

// Called when the user clicks "Reset"
function handleReset() {
  clearForm()
}

// A helper function to reset every field to its empty default.
// Keeping this in one place means we don't repeat the same code
// in both handleSubmit and handleReset.
function clearForm() {
  form.fullName  = ""
  form.studentId = ""
  form.email     = ""
  form.password  = ""
  form.program   = ""
  form.yearLevel = ""
  form.bio       = ""
  form.track     = ""
  form.agree     = false
  submitted.value = false
}
</script>

<style>
/*
  STYLE SECTION
  ─────────────────────────────────────────────────────────
  These styles control the fade animation for the success modal.
  Vue's <Transition> component automatically applies these
  CSS classes at the right moments:
    • modal-enter-active / modal-leave-active → applied while animating in/out
    • modal-enter-from  / modal-leave-to      → the starting/ending invisible state
*/
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
