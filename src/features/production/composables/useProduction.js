import { computed } from 'vue';
import { useProductCart } from '@/features/cart/composables/useProductCart.js';
import { mapProductsForProduction } from '../calculators/profileCalculator.js';

export function useProduction() {
  const { productItems } = useProductCart();

  const productionList = computed(() => {
    return mapProductsForProduction(productItems.value);
  });

  return {
    productionList,
  };
}
