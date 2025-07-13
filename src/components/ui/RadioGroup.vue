<template>
  <fieldset>
    <legend class="form-label fs-6">{{ legend }}</legend>
    <div 
      v-for="option in options" 
      :key="option.value" 
      class="form-check"
    >
      <input 
        class="form-check-input" 
        type="radio" 
        :name="name" 
        :id="`${name}-${option.value}`" 
        :value="option.value" 
        :checked="modelValue === option.value"
        @change="$emit('update:modelValue', option.value)"
      />
      <label 
        class="form-check-label" 
        :for="`${name}-${option.value}`"
      >
        {{ option.label }}
        <span v-if="option.extra" class="text-muted ms-1">{{ option.extra }}</span>
      </label>
    </div>
  </fieldset>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  legend: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
    // Проверка, что каждая опция имеет value и label
    validator: (options) => options.every(opt => 'value' in opt && 'label' in opt),
  },
  modelValue: {
    type: [String, Number],
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
fieldset {
  border: none;
  padding: 0;
}
legend {
  font-weight: 500;
}
</style>
