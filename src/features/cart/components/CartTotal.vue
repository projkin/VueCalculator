<template>
  <div class="d-flex justify-content-end align-items-center mt-3">
    <h5 class="mb-0 me-3">Всего в корзине: <strong>{{ Math.round(cartTotal) }} &#8381;</strong></h5>
    <button class="btn btn-danger" @click="$emit('clear-cart')">Очистить корзину</button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  cartTotal: {
    type: Number,
    required: true,
  },
});

defineEmits(['clear-cart']);
</script>
