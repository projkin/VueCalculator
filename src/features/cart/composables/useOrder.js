import { ref, computed, watch } from 'vue';
import { DELIVERY_PRICING } from '@/features/calculator/data/pricing.js';
import { useProductCart } from './useProductCart.js';
import { useServiceCart } from './useServiceCart.js';

// --- Order-specific state ---
const deliveryDistance = ref(0);
const deliveryType = ref('Pickup');
const discountPercentage = ref(0);

export function useOrder() {
  const { 
    productItems, 
    productsSubtotal, 
    ralPaintingCost, 
    totalAssemblerMotivation: productAssemblerMotivation,
    totalInstallerMotivation: productInstallerMotivation,
    clearProductCart
  } = useProductCart();

  const { 
    serviceItems, 
    servicesSubtotal, 
    totalAssemblerMotivation: serviceAssemblerMotivation,
    totalInstallerMotivation: serviceInstallerMotivation,
    clearServiceCart
  } = useServiceCart();

  const deliveryPrice = computed(() => {
    if (deliveryType.value === 'InMkad') {
      return DELIVERY_PRICING.MIN + (deliveryDistance.value * DELIVERY_PRICING.DISTANCE);
    }
    return 0;
  });

  const grandTotal = computed(() => {
    const totalBeforeDiscount = productsSubtotal.value + servicesSubtotal.value + ralPaintingCost.value;
    const discountedTotal = totalBeforeDiscount * (1 - discountPercentage.value / 100);
    return discountedTotal + deliveryPrice.value;
  });

  const totalAssemblerMotivation = computed(() => 
    productAssemblerMotivation.value + serviceAssemblerMotivation.value
  );

  const totalInstallerMotivation = computed(() => {
    const total = productInstallerMotivation.value + serviceInstallerMotivation.value;
    return total * (1 - discountPercentage.value / 100);
  });

  const isCartEmpty = computed(() => productItems.value.length === 0 && serviceItems.value.length === 0);

  const clearOrder = () => {
    clearProductCart();
    clearServiceCart();
    // Resetting order state is handled by the watcher below
  };

  watch(isCartEmpty, (isEmpty) => {
    if (isEmpty) {
      deliveryDistance.value = 0;
      deliveryType.value = 'Pickup';
      discountPercentage.value = 0;
    }
  });

  return {
    // State
    deliveryDistance,
    deliveryType,
    discountPercentage,
    // Computed
    deliveryPrice,
    grandTotal,
    totalAssemblerMotivation,
    totalInstallerMotivation,
    isCartEmpty,
    // Methods
    clearOrder,
  };
}
