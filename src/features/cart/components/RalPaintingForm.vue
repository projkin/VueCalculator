<template>
  <div class="ral-painting-form">
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
import InputSpinner from "@/components/ui/form/InputSpinner.vue";
import { useCart } from "@/features/cart/composables/useCart";

const { ralPaintingCount, ralPaintingCost } = useCart();

</script>

<style scoped>
.ral-painting-form {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}
</style>
