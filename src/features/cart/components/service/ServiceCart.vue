<template>
  <div v-if="serviceItems.length > 0" class="mt-4">
    <h4>Дополнительные услуги</h4>
    <ServiceCartList 
      :items="serviceItems" 
      @remove-item="removeService"
      @update-item-quantity="({ id, quantity }) => updateServiceQuantity(id, quantity)"
    />
  </div>
</template>

<script setup>
import ServiceCartList from './ServiceCartList.vue';
import { useServiceCart } from '@/features/cart/composables/useServiceCart.js';

const { 
  serviceItems, 
  removeService, 
  updateServiceQuantity 
} = useServiceCart();
</script>
