<template>
  <!--
    BaseSelect — a reusable dropdown component
    ─────────────────────────────────────────────────────────
    Wraps a standard HTML <select> with a label and error message.

    Usage in parent:
      <BaseSelect
        v-model="form.program"
        label="Program"
        :options="programOptions"
      />

    The "options" prop accepts an array of objects: { label, value }
      label → text shown to the user in the dropdown
      value → the actual data stored when selected
  -->
  <div>
    <!-- Label: only shown when a label prop is provided -->
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <select
      :value="modelValue"
      :class="['form-input', { error: errorMessage }]"
      @change="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    >
      <!--
        Placeholder option: shown as the first item when nothing is selected yet.
        Its value is "" (empty string) so that validation catches it as "not selected".
      -->
      <option v-if="placeholder" value="">{{ placeholder }}</option>

      <!--
        v-for loops through the options array and creates one <option> per item.
        The "?? option" fallback handles both:
          • Array of objects: { value: "CS", label: "Computer Science" }
          • Array of plain strings: ["Option A", "Option B"]
      -->
      <option
        v-for="option in options"
        :key="option.value ?? option"
        :value="option.value ?? option"
      >
        {{ option.label ?? option }}
      </option>
    </select>

    <!-- Error message: only shown when errorMessage is not empty -->
    <p v-if="errorMessage" class="err-msg">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue:   { type: String,  default: '' },
  label:        { type: String,  default: '' },
  placeholder:  { type: String,  default: 'Select an option' }, // Default placeholder text
  required:     { type: Boolean, default: false },
  options:      { type: Array,   default: () => [] }, // Array of { label, value } objects
  errorMessage: { type: String,  default: '' },
})

defineEmits(['update:modelValue', 'blur'])
</script>
