import { ref, computed, readonly, watch } from 'vue';
import { RAL_COST } from '@/features/calculator/data/pricing.js';

const PRODUCT_CART_STORAGE_KEY = 'calculator-product-cart';
const RAL_PAINTING_COUNT_KEY = 'calculator-ral-count';

const isRalItem = (item) => item && item.frameColor === 'Ral';

const initialItems = JSON.parse(localStorage.getItem(PRODUCT_CART_STORAGE_KEY) || '[]');
const items = ref(initialItems);

const initialRalPaintingCount = JSON.parse(localStorage.getItem(RAL_PAINTING_COUNT_KEY) || '0');
const ralPaintingCount = ref(initialRalPaintingCount);

let nextItemId = (initialItems.reduce((maxId, item) => Math.max(item.cartItemId, maxId), 0) || 0) + 1;

watch(items, (newItems) => {
  localStorage.setItem(PRODUCT_CART_STORAGE_KEY, JSON.stringify(newItems));
  const hasRal = newItems.some(isRalItem);
  if (hasRal && ralPaintingCount.value === 0) {
    ralPaintingCount.value = 1;
  } else if (!hasRal) {
    ralPaintingCount.value = 0;
  }
}, { deep: true });

watch(ralPaintingCount, (newCount) => {
  localStorage.setItem(RAL_PAINTING_COUNT_KEY, JSON.stringify(newCount));
});

export function useProductCart() {
  const hasRalItems = computed(() => items.value.some(isRalItem));

  const ralPaintingCost = computed(() => {
    return hasRalItems.value ? ralPaintingCount.value * RAL_COST : 0;
  });

  const productsSubtotal = computed(() => 
    items.value.reduce((total, item) => total + (parseFloat(item.totalPrice) * item.quantity), 0)
  );

  const totalAssemblerMotivation = computed(() => 
    items.value.reduce((total, item) => total + (item.motivation?.assembler || 0) * item.quantity, 0)
  );

  const totalInstallerMotivation = computed(() => 
    items.value.reduce((total, item) => total + (item.motivation?.installer || 0) * item.quantity, 0)
  );

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
    if (item && quantity >= 1) item.quantity = quantity;
  };

  const clearCart = () => {
    items.value = [];
    ralPaintingCount.value = 0;
  };

  return {
    productItems: readonly(items),
    ralPaintingCount,
    ralPaintingCost,
    hasRalItems,
    productsSubtotal,
    totalAssemblerMotivation,
    totalInstallerMotivation,
    addProduct: addItem,
    removeProduct: removeItem,
    updateProductQuantity: updateItemQuantity,
    clearProductCart: clearCart,
  };
}
