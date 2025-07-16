import { ref, computed, readonly, watch } from 'vue';

const SERVICE_CART_STORAGE_KEY = 'calculator-service-cart';

const initialItems = JSON.parse(localStorage.getItem(SERVICE_CART_STORAGE_KEY) || '[]');
const items = ref(initialItems);

let nextItemId = (initialItems.reduce((maxId, item) => Math.max(item.cartItemId, maxId), 0) || 0) + 1;

watch(items, (newItems) => {
  localStorage.setItem(SERVICE_CART_STORAGE_KEY, JSON.stringify(newItems));
}, { deep: true });

export function useServiceCart() {
  const servicesSubtotal = computed(() => 
    items.value.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0)
  );

  const totalAssemblerMotivation = computed(() => 
    items.value.reduce((total, item) => total + (item.motivation?.assembler || 0) * item.quantity, 0)
  );

  const totalInstallerMotivation = computed(() => 
    items.value.reduce((total, item) => total + (item.motivation?.installer || 0) * item.quantity, 0)
  );

  const addItem = (service) => {
    const existingItem = items.value.find(item => item.id === service.id);
    if (existingItem) {
      existingItem.quantity += service.quantity;
    } else {
      items.value.push({ ...service, cartItemId: nextItemId++ });
    }
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
  };

  return {
    serviceItems: readonly(items),
    servicesSubtotal,
    totalAssemblerMotivation,
    totalInstallerMotivation,
    addService: addItem,
    removeService: removeItem,
    updateServiceQuantity: updateItemQuantity,
    clearServiceCart: clearCart,
  };
}
