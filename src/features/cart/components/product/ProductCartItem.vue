<template>
  <div class="list-group-item">
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <strong>{{ getProfileNameById(item.profile) }}</strong> ({{ item.width }}x{{ item.height }}мм)
        <small class="d-block text-muted">Полотно: {{ getCanvasNameById(item.canvas) }} ({{ getColorNameById(item.color) }}). Рамка: {{ getFrameColorNameById(item.frameColor) }}<span v-if="item.ralCode"> ({{ item.ralCode }})</span></small>
      </div>
      <div class="d-flex align-items-center">
        <InputSpinner 
          :model-value="item.quantity"
          @update:model-value="$emit('update-quantity', $event)"
          class="mx-3"
        />
        <strong class="me-3 text-nowrap">{{ Math.round(item.totalPrice * item.quantity) }} &#8381;</strong>
        <button class="btn btn-danger btn-sm" @click="$emit('remove')">Удалить</button>
      </div>
    </div>
    <div class="mt-2 small text-muted">
      <div v-if="item.addons && item.addons.length > 0">
        <div v-for="addon in item.addons" :key="addon.groupId">
          <span>{{ getAddonGroupNameById(item.profile, addon.groupId) }}: {{ getAddonOptionNameById(item.profile, addon.groupId, addon.optionId) }}</span>
        </div>
      </div>
      <div v-if="item.comment">
        <span>Комментарий: {{ item.comment }}</span>
      </div>
      <div v-if="item.raspil" class="mt-1 border-top pt-1">
        <span>Распил: {{ item.raspil.raspilWidth }}x{{ item.raspil.raspilHeight }}мм, Импост: {{ item.raspil.impost }}мм</span>
      </div>
      <div v-if="item.motivation" class="mt-1 border-top pt-1">
        <span>Мотивация: Сборщик {{ (item.motivation.assembler * item.quantity).toFixed(2) }}, Монтажник {{ (item.motivation.installer * item.quantity).toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputSpinner from '@/shared/ui/form/InputSpinner.vue';
import { getProfileNameById, getCanvasNameById, getColorNameById, getFrameColorNameById, getAddonOptionNameById, getAddonGroupNameById } from '@/shared/utils/productHelpers.js';

defineProps({ item: Object });
defineEmits(['remove', 'update-quantity']);
</script>
