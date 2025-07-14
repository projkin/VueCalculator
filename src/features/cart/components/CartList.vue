<template>
  <div v-if="items.length > 0" class="mt-4">
    <h4>Корзина</h4>
    <ul class="list-group">
      <CartItem 
        v-for="item in items" 
        :key="item.cartItemId" 
        :item="item"
        @remove="$emit('remove-item', item.cartItemId)"
        @update-quantity="$emit('update-item-quantity', { id: item.cartItemId, quantity: $event })"
      />
    </ul>
    <div class="d-flex justify-content-end align-items-center mt-3">
      <h5 class="mb-0 me-3">Всего в корзине: <strong>{{ cartTotal.toFixed(2) }} &#8381;</strong></h5>
      <button class="btn btn-danger" @click="$emit('clear-cart')">Очистить корзину</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import CartItem from './CartItem.vue';

defineProps({
  items: {
    type: Array,
    required: true,
  },
  cartTotal: {
    type: Number,
    required: true,
  },
});

defineEmits(['remove-item', 'clear-cart', 'update-item-quantity']);
</script>
