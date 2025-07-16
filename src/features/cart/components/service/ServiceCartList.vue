<template>
  <div class="list-group">
    <ServiceCartItem 
      v-for="item in items" 
      :key="item.cartItemId" 
      :item="item"
      @remove="$emit('remove-item', item.cartItemId)"
      @update-quantity="$emit('update-item-quantity', { id: item.cartItemId, quantity: $event })"
    />
  </div>
</template>

<script setup>
import ServiceCartItem from '@/features/cart/components/service/ServiceCartItem.vue';

defineProps({ items: Array });
defineEmits(['remove-item', 'update-item-quantity']);
</script>
