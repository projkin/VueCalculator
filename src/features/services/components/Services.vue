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
import { useCart } from '@/features/cart/composables/useCart.js';

const { services } = useServices();
const { addItem } = useCart();

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
    totalPrice: service.price, // У услуг цена за единицу и есть итоговая цена
    type: 'service', // Добавляем тип для идентификации в корзине
    motivation: motivation,
  };
  addItem(cartItem);
};
</script>

