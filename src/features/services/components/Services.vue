<template>
  <div class="container mt-5">
    <div class="card p-4">
      <h2 class="card-title text-center mb-4">Услуги</h2>
      <ServicesList :services="services" />
    </div>
  </div>
</template>

<script setup>
import ServicesList from './ServicesList.vue';
import { useServices } from '../composables/useServices.js';

const { services } = useServices();
</script>
