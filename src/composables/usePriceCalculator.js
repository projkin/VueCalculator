import { productConfiguration, allCanvases, allColors, allFrameColors, priceMatrix } from '../data';

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

    // Правило: если выбран RAL, для поиска цены используем White
    if (frameColorForPrice === 'Ral') {
      frameColorForPrice = 'White';
    }

    const requiresCanvas = (profileData.canvases || []).length > 0;
    const requiresColor = canvasData && (canvasData.colors || []).length > 0;
    const requiresFrameColor = (profileData.frameColors || []).length > 0;

    if (requiresCanvas && !canvasData) { return 0; }
    if (requiresColor && !colorData) { return 0; }
    if (requiresFrameColor && !selectedFrameColorId) { return 0; }
    if (selectedFrameColorId === 'Ral' && !selectedRalId) { return 0; }
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
    const totalPrice = area * pricePerSqm;

    return totalPrice;
  };

  return {
    calculateTotalPrice,
  };
}
