<template>
  <div v-if="!isCartEmpty">
    <ProductCart />
    <ServiceCart />
    <CartTotal />
    <OrderForm />
  </div>
</template>

<script setup>
import ProductCart from './ProductCart.vue';
import ServiceCart from './ServiceCart.vue';
import CartTotal from './CartTotal.vue';
import OrderForm from './OrderForm.vue';
import { useOrder } from '../composables/useOrder.js';

const { isCartEmpty } = useOrder();
</script>

