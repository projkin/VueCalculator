<template>
  <div class="container mt-5">
    <div class="card p-4">
      <h2 class="card-title text-center mb-4">Услуги</h2>
      <ServicesList :services="services" @add-to-cart="handleAddToCart" />
    </div>
  </div>
</template>

<script setup>
import ServicesList from './ServicesList.vue';
import { useServices } from '../composables/useServices.js';
import { useServiceCart } from '@/features/cart/composables/useServiceCart.js';

const { services } = useServices();
const { addService } = useServiceCart();

const handleAddToCart = (service) => {
  // Рассчитываем мотивацию для услуги
  let motivation = { assembler: 0, installer: 0 };
  if (service.motivation) {
    if (service.motivation.type === 'fixed') {
      motivation = service.motivation.values;
    } else if (service.motivation.type === 'multiplier') {
      motivation.installer = service.price * service.motivation.values.installer;
      motivation.assembler = service.price * service.motivation.values.assembler;
    }
  }

  const cartItem = {
    id: service.id,
    name: service.name,
    price: service.price,
    quantity: service.quantity,
    motivation: motivation,
  };
  addService(cartItem);
};
</script>

