<template>
  <div v-if="cartItems.length > 0">
    <CartList 
      :items="cartItems" 
      @remove-item="removeCartItem"
      @update-item-quantity="event => updateItemQuantity(event.id, event.quantity)"
    />
    <CartTotal 
      :cart-total="cartTotal" 
      @clear-cart="clearCart"
    />
  </div>
</template>

<script setup>
import CartList from './CartList.vue';
import CartTotal from './CartTotal.vue';
import { useCart } from '../composables/useCart.js';

const { 
  items: cartItems, 
  cartTotal, 
  removeItem: removeCartItem, 
  updateItemQuantity, 
  clearCart 
} = useCart();
</script>
