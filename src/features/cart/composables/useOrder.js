import { ref, computed, watch } from 'vue';
import { DELIVERY_PRICING } from '@/features/calculator/data/pricing.js';
import { useCart } from './useCart.js';

// --- Реактивные переменные состояния заказа ---
const deliveryDistance = ref(0);
const deliveryType = ref('Pickup');
const discountPercentage = ref(0);

export function useOrder() {
  const { items, ralPaintingCost, isEmpty } = useCart();

  // --- Вычисляемые свойства ---
  const deliveryPriceComputed = computed(() => {
    let cost = 0;
    if (deliveryType.value === 'InMkad') {
      cost = DELIVERY_PRICING.MIN + (deliveryDistance.value * DELIVERY_PRICING.DISTANCE);
    }
    return cost;
  });

  const cartTotal = computed(() => {
    const itemsTotal = items.value.reduce((total, item) => total + (parseFloat(item.totalPrice) * item.quantity), 0);
    let totalBeforeDiscount = itemsTotal + ralPaintingCost.value;
    
    // Применяем скидку
    if (discountPercentage.value > 0) {
      totalBeforeDiscount *= (1 - discountPercentage.value / 100);
    }

    const finalTotal = totalBeforeDiscount + deliveryPriceComputed.value;
    return finalTotal;
  });

  // --- Методы для обновления состояния ---
  const setDeliveryDistance = (distance) => {
    deliveryDistance.value = distance;
  };

  const setDeliveryType = (type) => {
    deliveryType.value = type;
  };

  const setDiscountPercentage = (percentage) => {
    discountPercentage.value = percentage;
  };

  // --- Наблюдатель для сброса состояния заказа при пустой корзине ---
  watch(isEmpty, (isCartEmpty) => {
    if (isCartEmpty) {
      deliveryDistance.value = 0;
      deliveryType.value = 'Pickup';
      discountPercentage.value = 0;
    }
  });

  // --- Возвращаем публичный API ---
  return {
    deliveryDistance,
    deliveryType,
    discountPercentage,
    deliveryPriceComputed,
    cartTotal,
    setDeliveryDistance,
    setDeliveryType,
    setDiscountPercentage,
  };
}
