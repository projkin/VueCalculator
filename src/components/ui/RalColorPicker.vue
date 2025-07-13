<template>
  <div 
    class="offcanvas offcanvas-end"
    :class="{ 'show': show }"
    tabindex="-1" 
    :style="{ visibility: show ? 'visible' : 'hidden' }"
    @click.self="close"
  >
    <div class="offcanvas-header border-bottom">
      <h5 class="offcanvas-title">Выберите цвет RAL</h5>
      <button type="button" class="btn-close" @click="close"></button>
    </div>
    <div class="offcanvas-body">
      <div class="list-group">
        <a 
          href="#" 
          v-for="color in ralColors" 
          :key="color.id" 
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
          @click.prevent="selectColor(color.id)"
        >
          {{ color.name }}
          <span class="ral-color-swatch" :style="{ backgroundColor: color.hex }"></span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { allRalColors } from '../../data';

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:show', 'select']);

const ralColors = allRalColors;

const close = () => {
  emit('update:show', false);
};

const selectColor = (ralId) => {
  emit('select', ralId);
  close();
};
</script>

<style scoped>
.ral-color-swatch {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
