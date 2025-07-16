<template>
  <div v-if="!isCartEmpty">
    <ProductCart />
    <ServiceCart />
    <CartTotal />
    <OrderForm />
  </div>
</template>

<script setup>
import ProductCart from '@/features/cart/components/product/ProductCart.vue';
import ServiceCart from '@/features/cart/components/service/ServiceCart.vue';
import CartTotal from './CartTotal.vue';
import OrderForm from './OrderForm.vue';
import { useOrder } from '@/features/cart/composables/useOrder.js';

const { isCartEmpty } = useOrder();
</script>

