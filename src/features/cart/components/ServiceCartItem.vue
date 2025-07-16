<template>
  <div class="list-group-item">
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <strong>{{ item.name }}</strong>
        <small class="d-block text-muted">Услуга</small>
      </div>
      <div class="d-flex align-items-center">
        <InputSpinner 
          :model-value="item.quantity"
          @update:model-value="$emit('update-quantity', $event)"
          class="mx-3"
        />
        <strong class="me-3 text-nowrap">{{ Math.round(item.price * item.quantity) }} &#8381;</strong>
        <button class="btn btn-danger btn-sm" @click="$emit('remove')">Удалить</button>
      </div>
    </div>
    <div v-if="item.motivation" class="mt-1 small text-muted border-top pt-1">
      <span>Мотивация: Сборщик {{ (item.motivation.assembler * item.quantity).toFixed(2) }}, Монтажник {{ (item.motivation.installer * item.quantity).toFixed(2) }}</span>
    </div>
  </div>
</template>

<script setup>
import InputSpinner from '@/components/ui/form/InputSpinner.vue';

defineProps({ item: Object });
defineEmits(['remove', 'update-quantity']);
</script>
