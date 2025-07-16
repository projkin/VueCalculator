<template>
  <div v-if="productItems.length > 0" class="mt-4">
    <h4>Конструкции</h4>
    <ProductCartList 
      :items="productItems" 
      @remove-item="removeProduct"
      @update-item-quantity="({ id, quantity }) => updateProductQuantity(id, quantity)"
    />
    <RalPaintingForm v-if="hasRalItems" />
  </div>
</template>

<script setup>
import ProductCartList from './ProductCartList.vue';
import RalPaintingForm from './RalPaintingForm.vue';
import { useProductCart } from '../composables/useProductCart.js';

const { 
  productItems, 
  hasRalItems, 
  removeProduct, 
  updateProductQuantity 
} = useProductCart();
</script>
