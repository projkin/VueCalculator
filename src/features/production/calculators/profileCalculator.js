import { raspilMatrix } from '@/features/calculator/data/raspil.js';

const calcPerimeter = (effectiveWidth, effectiveHeight, quantity) => {
  return (((effectiveWidth * 2) + (effectiveHeight * 2)) * quantity) / 1000; // Переводим в метры
};

export function mapProductsForProduction(productItems) {
  if (!productItems || productItems.length === 0) {
    return [];
  }

  const aggregatedProducts = new Map();

  productItems.forEach(item => {
    const key = `${item.profile}_${item.frameColor}_${item.ralCode || ''}_${item.width}x${item.height}`;

    // Используем profileId напрямую из элемента корзины
    const profileId = item.profile;

    // Получаем данные для распила по ID профиля
    const raspilData = profileId ? raspilMatrix[profileId] : undefined;

    let effectiveWidth = item.width;
    let effectiveHeight = item.height;

    if (raspilData) {
      effectiveWidth = item.width - raspilData.width;
      effectiveHeight = item.height - raspilData.height;
    }
    
    if (aggregatedProducts.has(key)) {
      const existing = aggregatedProducts.get(key);
      existing.quantity += item.quantity;
      // Пересчитываем area для существующей группы с новым агрегированным количеством
      existing.area = calcPerimeter(effectiveWidth, effectiveHeight, existing.quantity);
    } else {
      let area = calcPerimeter(effectiveWidth, effectiveHeight, item.quantity);
      aggregatedProducts.set(key, {
        profile: item.profile,
        frameColorId: item.frameColor,
        ralCode: item.ralCode,
        size: {
          width: item.width,
          height: item.height,
        },
        quantity: item.quantity,
        area: area,
      });
    }
  });

  return Array.from(aggregatedProducts.values());
}