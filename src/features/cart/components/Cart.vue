<template>
  <div class="container">
    <div v-if="cartItems.length > 0">
      <CartList 
        :items="cartItems" 
        @remove-item="removeCartItem"
        @update-item-quantity="event => updateItemQuantity(event.id, event.quantity)"
      />
      <CartTotal 
        :cart-total="cartTotal" 
        :total-assembler-motivation="totalAssemblerMotivation"
        :total-installer-motivation="totalInstallerMotivation"
        @clear-cart="clearCart"
      />
      <OrderForm />
    </div>
  </div>
</template>

<script setup>
import CartList from './CartList.vue';
import CartTotal from './CartTotal.vue';
import OrderForm from './OrderForm.vue';
import { useCart } from '../composables/useCart.js';

const { 
  items: cartItems, 
  cartTotal, 
  totalAssemblerMotivation,
  totalInstallerMotivation,
  removeItem: removeCartItem, 
  updateItemQuantity, 
  clearCart 
} = useCart();
</script>
