import { raspilMatrix } from '@/features/calculator/data/raspil.js';
import { productConfiguration } from '@/features/calculator/data/configuration.js';

export function mapProductsForProduction(productItems) {
  if (!productItems || productItems.length === 0) {
    return [];
  }

  const aggregatedProducts = new Map();

  productItems.forEach(item => {
    const frameColor = item.frameColor === 'Ral' ? `RAL ${item.ralCode}` : item.frameColor;
    const key = `${item.profile}_${frameColor}_${item.width}x${item.height}`;
    console.log(item);
    

    // Находим ID профиля по его названию
    const profileConfig = productConfiguration.find(p => p.name === item.profile);
    const profileId = profileConfig ? profileConfig.id : null;

    // Получаем данные для распила по ID профиля
    const raspilData = profileId ? raspilMatrix[profileId] : undefined;
    
    if (aggregatedProducts.has(key)) {
      const existing = aggregatedProducts.get(key);
      existing.quantity += item.quantity;
      // Пересчитываем area для существующей группы с новым агрегированным количеством
      if (raspilData) {
        const effectiveWidth = item.width - raspilData.width;
        const effectiveHeight = item.height - raspilData.height;
        existing.area = (((effectiveWidth * 2) + (effectiveHeight * 2)) * existing.quantity) / 1000; // Переводим в метры
      }
    } else {
      let area = 0;
      if (raspilData) {
        const effectiveWidth = item.width - raspilData.width;
        const effectiveHeight = item.height - raspilData.height;
        area = (((effectiveWidth * 2) + (effectiveHeight * 2)) * item.quantity) / 1000; // Переводим в метры
      }
      aggregatedProducts.set(key, {
        profile: item.profile,
        frame_color: frameColor,
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