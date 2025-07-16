<template>
  <li class="list-group-item d-flex justify-content-between align-items-center">
    <span>{{ service.name }}</span>
    <span class="fw-bold">{{ service.price }} &#8381; / {{ service.unit }}</span>
  </li>
</template>

<script setup>
defineProps({
  service: {
    type: Object,
    required: true,
  },
});
</script>
