<template>
  <div class="border-top mt-3 pt-3">
    <div class="d-flex justify-content-end">
      <div class="text-end">
        <h5 class="mb-2">Всего в корзине: <strong>{{ Math.round(cartTotal) }} &#8381;</strong></h5>
        <div class="text-muted mb-3">
          <div>Мотивация сборщика: <strong>{{ Math.round(totalAssemblerMotivation) }}</strong></div>
          <div>Мотивация монтажника: <strong>{{ Math.round(totalInstallerMotivation) }}</strong></div>
        </div>
        <button class="btn btn-danger" @click="$emit('clear-cart')">Очистить корзину</button>
      </div>
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
