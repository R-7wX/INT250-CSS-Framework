<template>
  <!--
    BaseCheckbox — a reusable checkbox component
    ─────────────────────────────────────────────────────────
    Wraps a standard HTML checkbox with a clickable label and
    an optional error message.

    Usage in parent:
      <BaseCheckbox v-model="form.agree" :error-message="errors.agree">
        I agree to the terms and conditions.
      </BaseCheckbox>

    The text between the opening and closing tags is the "slot" content —
    it becomes the label text next to the checkbox.
  -->
  <div>
    <!--
      We wrap both the checkbox AND the label text in a <label> element.
      This means clicking anywhere on the label text also toggles the checkbox.
    -->
    <label class="flex items-start gap-2 cursor-pointer">
      <input
        type="checkbox"
        :checked="modelValue"
        class="mt-0.5 w-4 h-4 accent-teal cursor-pointer flex-shrink-0"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <!--
        @change sends the new checked state (true or false) to the parent.
        $event.target.checked is a boolean: true when checked, false when not.
      -->

      <!-- <slot /> renders whatever text the parent put between the component tags -->
      <span class="text-xs text-gray-600 leading-relaxed">
        <slot />
      </span>
    </label>

    <!-- Error message: only shown when errorMessage is not empty -->
    <p v-if="errorMessage" class="err-msg mt-1">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue:   { type: Boolean, default: false }, // Whether the checkbox is checked (true/false)
  errorMessage: { type: String,  default: '' },
})

defineEmits(['update:modelValue'])
</script>
