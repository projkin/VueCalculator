<template>
  <div v-if="productionList.length > 0" class="card p-4 mt-4">
    <h4 class="card-title">Производственная сводка (для проверки)</h4>
    <ul class="list-group list-group-flush">
      <li 
        v-for="(item, index) in productionList" 
        :key="index"
        class="list-group-item d-flex justify-content-between"
      >
        <span>{{ item.profile }} {{ item.frame_color }} ({{ item.size.width }}x{{ item.size.height }})</span>
        <span>{{ item.quantity }} шт.</span>
        <span>Площадь: {{ item.area }} (заглушка)</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useProduction } from '../composables/useProduction.js';

const { productionList } = useProduction();
</script>