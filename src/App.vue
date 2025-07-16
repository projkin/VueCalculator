<template>
  <div class="container">
    <ul class="nav nav-tabs" id="main-tabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'constructor' }" 
          @click="activeTab = 'constructor'" 
          type="button"
        >
          Конструкция
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'services' }" 
          @click="activeTab = 'services'" 
          type="button"
        >
          Доп. услуги
        </button>
      </li>
    </ul>
    <div class="tab-content pt-3" id="main-tabs-content">
      <div class="tab-pane fade" :class="{ 'show active': activeTab === 'constructor' }">
        <Calculator @product-configured="addProductToCart" />
      </div>
      <div class="tab-pane fade" :class="{ 'show active': activeTab === 'services' }">
        <Services />
      </div>
    </div>
    <Cart />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Calculator from './features/calculator/components/Calculator.vue';
import Services from './features/services/components/Services.vue';
import Cart from './features/cart/components/Cart.vue';
import { useCart } from './features/cart/composables/useCart.js';

const activeTab = ref('constructor'); // 'constructor' or 'services'

const { addItem } = useCart();

const addProductToCart = (product) => {
  addItem(product);
};
</script>

<style>
  #app {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
</style>
