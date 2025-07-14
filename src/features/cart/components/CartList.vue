<template>
  <div v-if="items.length > 0" class="mt-4">
    <h4>Корзина</h4>
    <div class="list-group">
      <CartItem 
        v-for="item in [...items].reverse()" 
        :key="item.cartItemId" 
        :item="item"
        @remove="$emit('remove-item', item.cartItemId)"
        @update-quantity="$emit('update-item-quantity', { id: item.cartItemId, quantity: $event })"
      />
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
});

defineEmits(['remove-item', 'update-item-quantity']);
</script>
