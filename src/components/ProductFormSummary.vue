<template>
  <div v-if="summary" class="mt-4 alert alert-success">
    <h5>Ваша конфигурация:</h5>
    <p class="mb-1"><strong>Профиль:</strong> {{ summary.profile }}</p>
    <p class="mb-1"><strong>Полотно:</strong> {{ summary.canvas }}</p>
    <p class="mb-1"><strong>Цвет полотна:</strong> {{ summary.color }}</p>
    <p class="mb-1"><strong>Цвет рамки:</strong> {{ summary.frameColor }}</p>
    <p class="mb-0"><strong>Размер:</strong> {{ summary.width }} x {{ summary.height }} мм</p>
    <template v-if="summary.addons && summary.addons.length > 0">
      <hr class="my-2">
      <div v-for="addon in summary.addons" :key="addon.group">
        <p class="mb-1"><strong>{{ addon.group }}:</strong> {{ addon.value }}</p>
      </div>
    </template>
    <hr class="my-2">
    <p class="mb-1"><strong>Комментарий:</strong> {{ summary.comment }}</p>
    <hr class="my-2">
    <h5 class="text-end">Итого: <strong>{{ summary.totalPrice }} &#8381;</strong></h5>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  summary: {
    type: Object,
    default: null,
  },
});
</script>
