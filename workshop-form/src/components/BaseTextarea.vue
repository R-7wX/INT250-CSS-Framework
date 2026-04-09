<template>
  <!--
    BaseTextarea — a reusable multi-line text input component
    ─────────────────────────────────────────────────────────
    Wraps a standard HTML <textarea> with a label, character
    counter, hint text, and error message.

    Usage in parent:
      <BaseTextarea
        v-model="form.bio"
        label="Short Bio"
        :maxlength="300"
        hint="Keep it brief!"
      />
  -->
  <div>
    <!-- Top row: label on the left, character counter on the right -->
    <div class="flex justify-between items-center mb-1">
      <label v-if="label" class="form-label mb-0">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>

      <!--
        Character counter: only shown when a maxlength prop is provided.
        Turns red when the user is approaching the limit.
      -->
      <span
        v-if="maxlength"
        class="text-xs font-medium"
        :class="modelValue.length > maxlength ? 'text-red-500' : 'text-gray-400'"
      >
        {{ modelValue.length }} / {{ maxlength }}
      </span>
    </div>

    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :maxlength="maxlength ? maxlength + 50 : undefined"
      :class="['form-input resize-y', { error: errorMessage }]"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur')"
    ></textarea>
    <!--
      maxlength + 50: We allow a little extra room so the counter
      can turn red as a warning before the hard browser limit cuts off typing.
    -->

    <!-- Hint text: optional helper text shown below the textarea -->
    <p v-if="hint" class="text-[11px] text-gray-400 mt-1">{{ hint }}</p>

    <!-- Error message -->
    <p v-if="errorMessage" class="err-msg">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue:   { type: String,  default: '' },
  label:        { type: String,  default: '' },
  placeholder:  { type: String,  default: '' },
  rows:         { type: Number,  default: 4 },      // Number of visible text lines
  maxlength:    { type: Number,  default: null },   // Maximum character count (null = no limit)
  required:     { type: Boolean, default: false },
  hint:         { type: String,  default: '' },     // Small helper text below the textarea
  errorMessage: { type: String,  default: '' },
})

defineEmits(['update:modelValue', 'blur'])
</script>
