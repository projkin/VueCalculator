<template>
  <div class="bg-light mt-3 p-4 card">
    <div class="d-flex justify-content-end align-items-center mb-2">     
        <h5 class="mb-0 me-3">Итого: <strong>{{ Math.round(grandTotal) }} &#8381;</strong></h5>
        <button class="btn btn-danger" @click="clearOrder">Очистить все</button>
    </div>   
    <div class="text-end text-muted small">
      <span>
        Общая мотивация: Сборщик - <strong>{{ totalAssemblerMotivation.toFixed(2) }}</strong>,
        Монтажник - <strong>{{ totalInstallerMotivation.toFixed(2) }}</strong>
      </span>  
    </div>
  </div>
</template>

<script setup>
import { useOrder } from '../composables/useOrder.js';

const { 
  grandTotal, 
  totalAssemblerMotivation, 
  totalInstallerMotivation, 
  clearOrder 
} = useOrder();
</script>
