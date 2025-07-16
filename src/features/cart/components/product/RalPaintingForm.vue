<template>
  <div class="card p-3 mb-1">
    <h5>Стоимость покраски RAL</h5>
    <div class="row align-items-center">
      <div class="col">
        <InputSpinner v-model="ralPaintingCount" :min="1" />
      </div>
      <div class="col-auto">
        <span class="price fw-bold">{{ ralPaintingCost }} ₽</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputSpinner from "@/shared/ui/form/InputSpinner.vue";
import { useProductCart } from "@/features/cart/composables/useProductCart";

const { ralPaintingCount, ralPaintingCost } = useProductCart();

</script>

<style scoped>
.card {
  border-radius: 0.25rem;
}
</style>
