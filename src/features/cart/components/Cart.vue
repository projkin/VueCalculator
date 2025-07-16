<template>
  <div>
    <div v-if="cartItems.length > 0">
      <RalPaintingForm v-if="hasRalItems" />
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
import RalPaintingForm from './RalPaintingForm.vue';
import CartList from './CartList.vue';
import CartTotal from './CartTotal.vue';
import OrderForm from './OrderForm.vue';
import { useCart } from '../composables/useCart.js';
import { useOrder } from '../composables/useOrder.js';

const { 
  items: cartItems, 
  hasRalItems,
  totalAssemblerMotivation,
  totalInstallerMotivation,
  removeItem: removeCartItem, 
  updateItemQuantity, 
  clearCart 
} = useCart();

const { cartTotal } = useOrder();
</script>
