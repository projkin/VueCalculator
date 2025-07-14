<template>
  <button 
    type="button" 
    class="btn btn-primary"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  text: {
    type: String,
    required: true,
  },
});

defineEmits(['click']);
</script>
