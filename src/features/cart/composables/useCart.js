// src/features/cart/composables/useCart.js
import { ref, computed, readonly, watch } from 'vue';

const CART_STORAGE_KEY = 'vue-calculator-cart';

// --- Инициализация состояния ---
// Пытаемся загрузить корзину из localStorage при первом запуске
const initialItems = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
const items = ref(initialItems);

// --- Синхронизация с localStorage ---
// Каждый раз, когда `items` меняются, сохраняем их в localStorage
watch(items, (newItems) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
}, { deep: true }); // deep: true, чтобы отслеживать изменения внутри объектов

let nextItemId = (initialItems.reduce((maxId, item) => Math.max(item.cartItemId, maxId), 0) || 0) + 1;

export function useCart() {
  // --- Вычисляемые свойства (Getters) ---
  const cartCount = computed(() => items.value.length);
  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => total + (parseFloat(item.totalPrice) * item.quantity), 0);
  });

  // --- Методы (Actions) ---
  const addItem = (product) => {
    items.value.push({
      ...product,
      cartItemId: nextItemId++,
      quantity: 1, // По умолчанию добавляем 1 штуку
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
  };

  // --- Возвращаем публичный API ---
  return {
    items: readonly(items),
    cartCount,
    cartTotal,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
  };
}
