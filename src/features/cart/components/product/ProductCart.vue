<template>
  <div v-if="productItems.length > 0" class="mt-4">
    <h4>Конструкции</h4>
    <RalPaintingForm v-if="hasRalItems" />
    <ProductCartList 
      :items="productItems" 
      @remove-item="removeProduct"
      @update-item-quantity="({ id, quantity }) => updateProductQuantity(id, quantity)"
    />
  </div>
</template>

<script setup>
import ProductCartList from './ProductCartList.vue';
import RalPaintingForm from './RalPaintingForm.vue';
import { useProductCart } from '@/features/cart/composables/useProductCart.js';

const { 
  productItems, 
  hasRalItems, 
  removeProduct, 
  updateProductQuantity 
} = useProductCart();
</script>
