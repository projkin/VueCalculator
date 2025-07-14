<template>
  <div>
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      type="text"
      :id="id"
      class="form-control"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);
</script>
