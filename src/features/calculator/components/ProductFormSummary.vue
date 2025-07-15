<template>
  <div v-if="summary" class="mt-4 alert alert-success">
    <div class="d-flex justify-content-end align-items-center mb-2">
      <h5 class="mb-0 me-3">Стоимость конструкции: <strong>{{ Math.round(summary.totalPrice) }} &#8381;</strong></h5>
      <Button text="Добавить в расчет" @click="onAddToCart" />
    </div>
    <div v-if="summary.motivation" class="text-end text-muted small">
      <span>Мотивация: Сборщик - <strong>{{ summary.motivation.assembler }}</strong>, Монтажник - <strong>{{ summary.motivation.installer }}</strong></span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import Button from '../../../components/ui/Button.vue';

const props = defineProps({
  summary: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['add-to-cart']);

const onAddToCart = () => {
  emit('add-to-cart', props.summary);
};
</script>
