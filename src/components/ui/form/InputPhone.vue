<template>
  <div>
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      :id="id"
      type="text"
      class="form-control"
      :placeholder="placeholder"
      v-mask="'+7 (###) ###-##-##'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'Телефон',
  },
  placeholder: {
    type: String,
    default: '+7 (___) ___-__-__',
  },
  id: {
    type: String,
    default: () => `input-phone-${Math.random().toString(36).substring(2, 9)}`,
  },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
/* Ваши стили, если нужны */
</style>
