<template>
  <div class="bg-success-subtle mt-3 p-4 card">
    <div class="d-flex justify-content-end align-items-center mb-2">     
        <h5 class="mb-0 me-3">Всего в корзине: <strong>{{ Math.round(cartTotal) }} &#8381;</strong></h5>
        <button class="btn btn-danger" @click="$emit('clear-cart')">Очистить</button>
    </div>   
    <div class="text-end text-muted small">
      <span>
        Мотивация: Сборщик - <strong>{{ Math.round(totalAssemblerMotivation) }}</strong>,
        Монтажник - <strong>{{ Math.round(totalInstallerMotivation) }}</strong>
      </span>  
    </div>
  </div>
</template>

<script setup>
  defineProps({
    cartTotal: {
      type: Number,
      required: true,
    },
    totalAssemblerMotivation: {
      type: Number,
      required: true,
    },
    totalInstallerMotivation: {
      type: Number,
      required: true,
    },
  });

  defineEmits(['clear-cart']);
</script>
