<template>
  <!--
    BaseRadioGroup — a reusable group of radio buttons
    ─────────────────────────────────────────────────────────
    Renders a styled set of radio buttons from an options array.
    Only one option can be selected at a time.

    Usage in parent:
      <BaseRadioGroup
        v-model="form.yearLevel"
        label="Year Level"
        :options="yearOptions"
      />

    Each option object: { value: "1", label: "Year 1" }
  -->
  <div>
    <!-- Group label -->
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Radio button list (horizontal with wrapping) -->
    <div class="flex flex-wrap gap-2 mt-1">
      <!--
        v-for loops through every option and creates one styled button per item.
        The button is actually a <label> wrapping a hidden <input type="radio">.
        This lets us style it however we want while keeping it accessible.
      -->
      <label
        v-for="option in options"
        :key="option.value ?? option"
        class="flex items-center gap-2 cursor-pointer border rounded-lg px-4 py-2 transition-all duration-200 select-none"
        :class="
          modelValue === (option.value ?? option)
            ? 'border-teal bg-teal-light text-teal font-semibold'
            : 'border-gray-300 bg-white text-gray-700 hover:border-teal'
        "
      >
        <!--
          The radio input is hidden (class="hidden").
          We draw our own custom circle indicator below instead.
          The @change event still fires normally when the user clicks the label.
        -->
        <input
          type="radio"
          :value="option.value ?? option"
          :checked="modelValue === (option.value ?? option)"
          class="hidden"
          @change="$emit('update:modelValue', option.value ?? option)"
        />

        <!-- Custom circle indicator: filled when this option is selected -->
        <span
          class="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
          :class="modelValue === (option.value ?? option) ? 'border-teal' : 'border-gray-400'"
        >
          <!-- Inner filled dot: only shown when this option is selected -->
          <span
            v-if="modelValue === (option.value ?? option)"
            class="w-2 h-2 rounded-full bg-teal"
          ></span>
        </span>

        <!-- Option label text -->
        <span class="text-sm">{{ option.label ?? option }}</span>
      </label>
    </div>

    <!-- Error message -->
    <p v-if="errorMessage" class="err-msg mt-1">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue:   { type: String,  default: '' },
  label:        { type: String,  default: '' },
  required:     { type: Boolean, default: false },
  options:      { type: Array,   default: () => [] }, // Array of { label, value } objects
  errorMessage: { type: String,  default: '' },
})

defineEmits(['update:modelValue'])
</script>
