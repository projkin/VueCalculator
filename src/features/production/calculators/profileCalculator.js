export function mapProductsForProduction(productItems) {
  if (!productItems || productItems.length === 0) {
    return [];
  }

  const aggregatedProducts = new Map(); // Используем Map для агрегации

  productItems.forEach(item => {
    const frameColor = item.frameColor === 'Ral' ? `RAL ${item.ralCode}` : item.frameColor;
    // Ключ для агрегации: профиль + цвет + ширина + высота
    const key = `${item.profile}_${frameColor}_${item.width}x${item.height}`;

    if (aggregatedProducts.has(key)) {
      const existing = aggregatedProducts.get(key);
      existing.quantity += item.quantity; // Суммируем количество
    } else {
      aggregatedProducts.set(key, {
        profile: item.profile,
        frame_color: frameColor,
        size: {
          width: item.width,
          height: item.height,
        },
        quantity: item.quantity, // Начальное количество
        area: 0, // TODO: Implement area calculation formula
      });
    }
  });

  return Array.from(aggregatedProducts.values()); // Преобразуем значения Map в массив
}
