<template>
  <li class="list-group-item d-flex justify-content-between align-items-center">
    <div>
      <span>{{ service.name }}</span>
      <small class="d-block text-muted">{{ service.price }} &#8381; / {{ service.unit }}</small>
    </div>
    <div class="d-flex align-items-center">
      <InputSpinner v-model="quantity" class="me-3" style="width: 120px;" />
      <Button :text="'Добавить'" @click="onAddToCart" />
    </div>
  </li>
</template>

<script setup>
import { ref } from 'vue';
import Button from '@/components/ui/Button.vue';
import InputSpinner from '@/components/ui/form/InputSpinner.vue';

const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['add-to-cart']);

const quantity = ref(1);

const onAddToCart = () => {
  emit('add-to-cart', { ...props.service, quantity: quantity.value });
  quantity.value = 1; // Сбрасываем количество после добавления
};
</script>
