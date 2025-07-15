<template>
  <div class="card p-4 mt-4">
    <h3 class="card-title mb-4">Оформление заказа</h3>
    <BaseForm class="row g-3">
      <!-- Доставка -->
      <div class="col-12">
        <RadioGroup
          legend="Доставка"
          name="delivery"
          v-model="form.delivery"
          :options="deliveryOptions"
        />
      </div>

      <!-- Расстояние от МКАД (условно) -->
      <div v-if="form.delivery === 'InMkad'" class="col-12">
        <InputNumber label="Расстояние от МКАД, км" v-model="form.distance" />
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
        <InputText label="Номер договора" v-model="form.contractNumber" />
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
        <InputText label="Телефон" placeholder="+7 (___) ___-__-__" v-model="form.phone" />
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
import { ref } from 'vue';
import BaseForm from '../../../components/ui/form/BaseForm.vue';
import RadioGroup from '../../../components/ui/form/RadioGroup.vue';
import InputNumber from '../../../components/ui/form/InputNumber.vue';
import InputSelect from '../../../components/ui/form/InputSelect.vue';
import InputText from '../../../components/ui/form/InputText.vue';
import Button from '../../../components/ui/Button.vue';
import { useCart } from '../composables/useCart.js';
import { useSubmitOrder } from '../composables/useSubmitOrder.js';

const { items, cartTotal, totalAssemblerMotivation, totalInstallerMotivation } = useCart();
const { isLoading, error, isSuccess, submit } = useSubmitOrder();

const form = ref({
  delivery: 'Pickup',
  distance: 0,
  discount: 0,
  orderType: 'Order',
  contractNumber: '',
  date: new Date().toISOString().slice(0, 10),
  name: '',
  phone: '',
  comment: '',
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
  const orderData = {
    orderForm: form.value,
    cart: {
      items: items.value,
      total: cartTotal.value,
      motivation: {
        assembler: totalAssemblerMotivation.value,
        installer: totalInstallerMotivation.value,
      },
    },
  };
  submit(orderData);
};
</script>
