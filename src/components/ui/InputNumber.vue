<template>
  <div>
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :id="id"
      type="number"
      class="form-control"
      :value="modelValue"
      :placeholder="placeholder"
      @input="handleInput"
      v-bind="$attrs"
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
    type: [Number, String], // Может быть строкой, когда поле пустое
    default: null,
  },
  placeholder: {
    type: String,
    default: '0',
  },
});

const emit = defineEmits(['update:modelValue']);

const handleInput = (event) => {
  const value = event.target.value;
  // Отправляем null, если поле пустое, иначе — числовое значение
  emit('update:modelValue', value === '' ? null : parseFloat(value));
};
</script>

<style scoped>
/* Стили для компонента */
</style>
