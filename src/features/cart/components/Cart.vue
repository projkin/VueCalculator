<template>
  <CartList 
    :items="cartItems" 
    :cart-total="cartTotal" 
    @remove-item="removeCartItem"
    @update-item-quantity="event => updateItemQuantity(event.id, event.quantity)"
    @clear-cart="clearCart"
  />
</template>

<script setup>
import CartList from '../components/CartList.vue';
import { useCart } from '../composables/useCart.js';

const { 
  items: cartItems, 
  cartTotal, 
  removeItem: removeCartItem, 
  updateItemQuantity, 
  clearCart 
} = useCart();
</script>
