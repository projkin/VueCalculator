<template>
  <div>
    <Calculator @product-configured="addProductToCart" />
    <Cart />
  </div>
</template>

<script setup>
import Calculator from './features/calculator/components/Calculator.vue';
import Cart from './features/cart/components/Cart.vue';
import { useCart } from './features/cart/composables/useCart.js';

const { addItem } = useCart();

const addProductToCart = (product) => {
  addItem(product);
};
</script>

<style>
  #app {
    display: flex;
    min-height: 100vh;
    width: 100vw;
    place-items: start;
    justify-content: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
</style>
