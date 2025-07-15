// src/features/cart/composables/useCart.js
import { ref, computed, readonly, watch } from 'vue';
import { RAL_COST, DELIVERY_PRICING } from '@/features/calculator/data/pricing.js';

const CART_STORAGE_KEY = 'calculator-cart';
const RAL_PAINTING_COUNT_KEY = 'calculator-ral-count';

// --- Хелпер для определения товара с RAL ---
const isRalItem = (item) => item && item.frameColor === 'RAL';

// --- Инициализация состояния ---
const initialItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
const items = ref(initialItems);

const initialRalPaintingCount = JSON.parse(localStorage.getItem(RAL_PAINTING_COUNT_KEY) || '0');
const ralPaintingCount = ref(initialRalPaintingCount);

const deliveryDistance = ref(0); // Новая реактивная переменная для расстояния доставки
const deliveryType = ref('Pickup'); // Новая реактивная переменная для типа доставки, по умолчанию 'Pickup'
const discountPercentage = ref(0); // Новая реактивная переменная для процента скидки

// --- Вычисляемые свойства и наблюдатели ---
const hasRalItems = computed(() => items.value.some(isRalItem));

// Синхронизация с localStorage и управление логикой покраски
watch(items, () => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items.value));
  
  if (hasRalItems.value && ralPaintingCount.value === 0) {
    ralPaintingCount.value = 1;
  } else if (!hasRalItems.value) {
    ralPaintingCount.value = 0;
  }

  // Сбрасываем скидку, если корзина пуста
  if (items.value.length === 0) {
    discountPercentage.value = 0;
  }
}, { deep: true });

watch(ralPaintingCount, (newCount) => {
  localStorage.setItem(RAL_PAINTING_COUNT_KEY, JSON.stringify(newCount));
});

let nextItemId = (initialItems.reduce((maxId, item) => Math.max(item.cartItemId, maxId), 0) || 0) + 1;

export function useCart() {
  // --- Вычисляемые свойства (Getters) ---
  const cartCount = computed(() => items.value.length);

  const ralPaintingCost = computed(() => {
    if (!hasRalItems.value) {
      return 0;
    }
    return ralPaintingCount.value * RAL_COST;
  });

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

    return totalBeforeDiscount + deliveryPriceComputed.value;
  });

  const totalAssemblerMotivation = computed(() => {
    return items.value.reduce((total, item) => {
      const motivation = item.motivation?.assembler || 0;
      return total + (motivation * item.quantity);
    }, 0);
  });

  const totalInstallerMotivation = computed(() => {
    return items.value.reduce((total, item) => {
      const motivation = item.motivation?.installer || 0;
      return total + (motivation * item.quantity);
    }, 0);
  });

  // --- Методы (Actions) ---
  const addItem = (product) => {
    items.value.push({
      ...product,
      cartItemId: nextItemId++,
      quantity: 1,
    });
  };

  const removeItem = (cartItemId) => {
    items.value = items.value.filter(item => item.cartItemId !== cartItemId);
  };

  const updateItemQuantity = (cartItemId, quantity) => {
    const item = items.value.find(item => item.cartItemId === cartItemId);
    if (item && quantity >= 1) {
      item.quantity = quantity;
    }
  };
  
  const clearCart = () => {
    items.value = [];
    ralPaintingCount.value = 0; // Сбрасываем ralPaintingCount при очистке корзины
    discountPercentage.value = 0; // Сбрасываем скидку при очистке корзины
  };

  const setDeliveryDistance = (distance) => {
    deliveryDistance.value = distance;
  };

  const setDeliveryType = (type) => {
    deliveryType.value = type;
  };

  const setDiscountPercentage = (percentage) => {
    discountPercentage.value = percentage;
  };

  // --- Возвращаем публичный API ---
  return {
    items: readonly(items),
    ralPaintingCount,
    ralPaintingCost,
    hasRalItems,
    cartCount,
    cartTotal,
    totalAssemblerMotivation,
    totalInstallerMotivation,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    deliveryDistance,
    setDeliveryDistance,
    deliveryType,
    setDeliveryType,
    deliveryPriceComputed,
    discountPercentage,
    setDiscountPercentage,
  };
}
