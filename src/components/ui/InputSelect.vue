<template>
  <div>
    <label :for="id" class="form-label">{{ label }}</label>
    <select
      :id="id"
      class="form-select"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
    >
      <option disabled value="">Выберите...</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
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
    type: [String, Number],
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
/* Стили для компонента */
</style>
