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


defineProps({
  text: {
    type: String,
    required: true,
  },
});

defineEmits(['click']);
</script>
