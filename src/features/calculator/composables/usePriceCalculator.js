import { productConfiguration, allCanvases, allColors } from '../data/configuration.js';
import { priceMatrix, optionsPriceMatrix } from '../data/pricing.js';

export function usePriceCalculator() {
  const calculateTotalPrice = (
    selectedProfileId,
    selectedCanvasId,
    selectedColorId,
    selectedFrameColorId,
    selectedRalId,
    width,
    height,
    selectedAddons
  ) => {
    const profileData = productConfiguration.find(p => p.id === selectedProfileId);
    if (!profileData) {
      return 0;
    }

    const canvasData = allCanvases[selectedCanvasId];
    const colorData = allColors[selectedColorId];
    let frameColorForPrice = selectedFrameColorId;

    const requiresCanvas = (profileData.canvases || []).length > 0;
    const requiresColor = canvasData && (canvasData.colors || []).length > 0;
    const requiresFrameColor = (profileData.frameColors || []).length > 0;

    if (requiresCanvas && !canvasData) { return 0; }
    if (requiresColor && !colorData) { return 0; }
    if (requiresFrameColor && !selectedFrameColorId) { return 0; }
    if (!width || !height) { return 0; }

    let pricePerSqm = 0;
    try {
      const foundPrice = priceMatrix[selectedProfileId]?.[selectedCanvasId]?.[frameColorForPrice];
      if (foundPrice !== undefined) {
        pricePerSqm = foundPrice;
      }
    } catch (e) {
      console.warn('Цена для комбинации не найдена, будет использован 0.');
    }

    const area = (width * height) / 1000000;
    let totalPrice = area * pricePerSqm;

    // Добавляем стоимость опций
    if (selectedAddons) {
      for (const groupId in selectedAddons) {
        const optionId = selectedAddons[groupId];
        if (optionId) {
          const addonPrice = optionsPriceMatrix[selectedProfileId]?.[groupId]?.[optionId] || 0;
          totalPrice += addonPrice;
        }
      }
    }

    return totalPrice;
  };

  return {
    calculateTotalPrice,
  };
}
