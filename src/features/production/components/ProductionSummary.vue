<template>
  <div v-if="productionList.length > 0" class="card p-4 mt-4">
    <h4 class="card-title">Профили</h4>
    <ul class="list-group list-group-flush">
      <li 
        v-for="(item, index) in productionList" 
        :key="index"
        class="list-group-item d-flex justify-content-between"
      >
        <span>
          {{ getProfileNameById(item.profile) }} 
          {{ getFrameColorNameById(item.frameColorId) }}
          <span v-if="item.ralCode"> ({{ item.ralCode }})</span> 
          ({{ item.size.width }}x{{ item.size.height }})
        </span>
        <span>{{ item.quantity }} шт.</span>
        <span>Площадь: {{ item.area.toFixed(2) }} м.п.</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useProduction } from '../composables/useProduction.js';
import { getProfileNameById, getFrameColorNameById } from '@/shared/utils/productHelpers.js';

const { productionList } = useProduction();
</script>