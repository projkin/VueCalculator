<template>
  <div v-if="!isCartEmpty">
    <ProductCart />
    <ServiceCart />
    <CartTotal />
    <ProductionSummary />
    <OrderForm />
  </div>
</template>

<script setup>
import ProductCart from '@/features/cart/components/product/ProductCart.vue';
import ServiceCart from '@/features/cart/components/service/ServiceCart.vue';
import CartTotal from '@/features/cart/components/CartTotal.vue';
import OrderForm from '@/features/cart/components/OrderForm.vue';
import ProductionSummary from '@/features/production/components/ProductionSummary.vue';
import { useOrder } from '@/features/cart/composables/useOrder.js';

const { isCartEmpty } = useOrder();
</script>