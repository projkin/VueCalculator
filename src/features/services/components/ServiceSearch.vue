<template>
  <div class="mb-4">
    <input
      type="text"
      class="form-control"
      placeholder="Поиск по названию..."
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>
