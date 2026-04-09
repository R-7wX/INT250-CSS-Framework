<template>
  <!--
    BaseInput — a reusable text input component
    ─────────────────────────────────────────────────────────
    This component wraps a standard HTML <input> with a label
    and an optional error message underneath.

    It works with v-model in the parent like this:
      <BaseInput v-model="form.name" label="Full Name" />

    How v-model works here (two steps):
      1. :value="modelValue"   → displays the current value
      2. @input="$emit(...)"   → tells the parent when the value changes
  -->
  <div>
    <!-- Label: only shown when a label prop is provided -->
    <label v-if="label" class="form-label">
      {{ label }}
      <!-- Red asterisk shown next to required fields -->
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="['form-input', { error: errorMessage }]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    />
    <!--
      :class="['form-input', { error: errorMessage }]"
      This adds the "error" CSS class only when errorMessage is not empty.
      The form-input and error classes are defined in style.css.
    -->

    <!-- Error message: only shown when errorMessage is not empty -->
    <p v-if="errorMessage" class="err-msg">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
/*
  Props are the values passed in from the parent component.
  For example: <BaseInput label="Full Name" type="email" />

  Each prop has:
    • type    → the JavaScript type (String, Boolean, etc.)
    • default → the fallback value when the parent doesn't pass it
*/
defineProps({
  modelValue:   { type: String,  default: '' },  // The current input value (used by v-model)
  label:        { type: String,  default: '' },  // Text shown above the input
  type:         { type: String,  default: 'text' }, // Input type: text, email, password, etc.
  placeholder:  { type: String,  default: '' },  // Greyed-out hint text inside the input
  required:     { type: Boolean, default: false }, // Shows a red asterisk on the label
  errorMessage: { type: String,  default: '' },  // Error text shown below the input
})

/*
  Emits are events this component can send UP to the parent.
  • 'update:modelValue' → this is what makes v-model work
  • 'blur'             → fired when the user leaves the input field
*/
defineEmits(['update:modelValue', 'blur'])
</script>
