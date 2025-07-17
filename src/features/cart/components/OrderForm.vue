<template>
  <div class="card p-4 mt-4">
    <h3 class="card-title mb-4">Оформление заказа</h3>
    <BaseForm class="row g-3">
      <!-- Доставка -->
      <div class="col-12">
        <RadioGroup
          legend="Доставка"
          name="delivery_type"
          v-model="form.delivery_type"
          :options="deliveryOptions"
        />
      </div>

      <!-- Расстояние от МКАД (условно) -->
      <div v-if="form.delivery_type === 'InMkad'" class="col-12">
        <InputNumber label="Расстояние от МКАД, км" v-model="form.delivery_distance" />
      </div>

      <!-- Скидка -->
      <div class="col-12">
        <InputSelect label="Скидка" v-model="form.discount" :options="discountOptions" />
      </div>

      <!-- Дополнительно -->
      <div class="col-12">
        <h4 class="mt-4">Дополнительно</h4>
      </div>
      <div class="col-12">
        <InputSelect label="Заказ" v-model="form.orderType" :options="orderTypeOptions" />
      </div>
      <div class="col-12">
        <InputText label="Номер договора" v-model="form.contract" />
      </div>
      <div class="col-12">
        <label for="order-date" class="form-label">Дата</label>
        <input type="date" id="order-date" class="form-control" v-model="form.date" />
      </div>

      <!-- Ваши контакты -->
      <div class="col-12">
        <h4 class="mt-4">Ваши контакты</h4>
      </div>
      <div class="col-12">
        <InputText label="Имя" placeholder="Введите имя" v-model="form.name" />
      </div>
      <div class="col-12">
        <InputPhone label="Телефон" v-model="form.phone" />
      </div>
      <div class="col-12">
        <label for="order-comment" class="form-label">Комментарий</label>
        <textarea id="order-comment" class="form-control" placeholder="Комментарий" v-model="form.comment"></textarea>
      </div>

      <!-- Кнопка -->
      <div class="col-12 text-end">
        <Button text="Отправить заявку" @click="submitOrder" :disabled="isLoading" />
        <p v-if="isLoading" class="text-muted small mt-2">Отправка...</p>
        <p v-if="isSuccess" class="text-success small mt-2">Заказ успешно отправлен!</p>
        <p v-if="error" class="text-danger small mt-2">{{ error }}</p>
      </div>
    </BaseForm>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseForm from '@/shared/ui/form/BaseForm.vue';
import RadioGroup from '@/shared/ui/form/RadioGroup.vue';
import InputNumber from '@/shared/ui/form/InputNumber.vue';
import InputSelect from '@/shared/ui/form/InputSelect.vue';
import InputText from '@/shared/ui/form/InputText.vue';
import InputPhone from '@/shared/ui/form/InputPhone.vue';
import Button from '@/shared/ui/Button.vue';
import { useProductCart } from '@/features/cart/composables/useProductCart.js';
import { useServiceCart } from '@/features/cart/composables/useServiceCart.js';
import { useOrder } from '@/features/cart/composables/useOrder.js';
import { useSubmitOrder } from '@/features/cart/composables/useSubmitOrder.js';
import { createOrderPayload } from '@/features/cart/mappers/orderMapper.js';

// Carts Data
const { productItems, ralPaintingCost, ralPaintingCount } = useProductCart();
const { serviceItems } = useServiceCart();

// Order Logic
const { 
  deliveryDistance, 
  deliveryType, 
  discountPercentage, 
  deliveryPrice, 
  grandTotal, 
  totalAssemblerMotivation, 
  totalInstallerMotivation,
  isCartEmpty
} = useOrder();

// Submission Logic
const { isLoading, error, isSuccess, submit } = useSubmitOrder();

const initialFormState = {
  delivery_type: 'Pickup',
  delivery_distance: 0,
  discount: 0,
  orderType: 'Order',
  contract: '',
  date: new Date().toISOString().slice(0, 10),
  name: '',
  phone: '',
  comment: '',
};

const form = ref({ ...initialFormState });

watch(isCartEmpty, (isEmpty) => {
  if (isEmpty) {
    form.value = { ...initialFormState };
  }
});

watch(() => form.value.delivery_type, (newVal) => {
  deliveryType.value = newVal;
  if (newVal === 'Pickup') {
    form.value.delivery_distance = 0;
  }
  deliveryDistance.value = form.value.delivery_distance;
});

watch(() => form.value.delivery_distance, (newVal) => {
  deliveryDistance.value = newVal;
});

watch(() => form.value.discount, (newVal) => {
  discountPercentage.value = newVal;
});

const deliveryOptions = [
  { value: 'Pickup', label: 'Самовывоз' },
  { value: 'InMkad', label: 'В пределах МКАД (за МКАД +40р/км)' },
];

const discountOptions = [
  { value: 0, text: 'Нет' },
  { value: 5, text: '5%' },
  { value: 7, text: '7%' },
  { value: 10, text: '10%' },
  { value: 15, text: '15%' },
  { value: 20, text: '20%' },
  { value: 25, text: '25%' },
  { value: 30, text: '30%' },
];

const orderTypeOptions = [
  { value: 'Order', text: 'Заказ' },
  { value: 'Quote', text: 'Выставить КП' },
  { value: 'Archive', text: 'Архив' },
];

const submitOrder = () => {
  const cartData = {
    items: productItems.value,
    services: serviceItems.value,
    total: grandTotal.value,
    ralPaintingCost: ralPaintingCost.value,
    ralPaintingCount: ralPaintingCount.value,
    deliveryPrice: deliveryPrice.value,
    motivation: {
      assembler: totalAssemblerMotivation.value,
      installer: totalInstallerMotivation.value,
    },
  };

  const options = { deliveryOptions, orderTypeOptions, discountOptions };

  const orderPayload = createOrderPayload(form.value, cartData, options);
  
  submit(orderPayload);
};
</script>
