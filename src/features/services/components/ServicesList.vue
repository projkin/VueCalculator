<template>
  <ul class="list-group">
    <ServiceItem
      v-for="service in services"
      :key="service.id"
      :service="service"
    />
  </ul>
</template>

<script setup>
import ServiceItem from './ServiceItem.vue';

defineProps({
  services: {
    type: Array,
    required: true,
  },
});
</script>
