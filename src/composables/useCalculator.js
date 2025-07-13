// src/composables/useCalculator.js

import { ref, watch } from 'vue';
import { productConfiguration, allCanvases, allColors, allFrameColors, priceMatrix } from '../data';

export function useCalculator(
  selectedProfile,
  selectedCanvas,
  selectedColor,
  selectedFrameColor,
  selectedRal,
  width,
  height,
  selectedAddons
) {
  const submittedValue = ref(null);

  const calculate = () => {
    const profileData = productConfiguration.find(p => p.id === selectedProfile.value);
    if (!profileData) { submittedValue.value = null; return; }

    const canvasData = allCanvases[selectedCanvas.value];
    const colorData = allColors[selectedColor.value];
    let frameColorForPrice = selectedFrameColor.value;

    if (frameColorForPrice === 'Ral') {
      frameColorForPrice = 'White';
    }

    const requiresCanvas = (profileData.canvases || []).length > 0;
    const requiresColor = canvasData && (canvasData.colors || []).length > 0;
    const requiresFrameColor = (profileData.frameColors || []).length > 0;

    if (requiresCanvas && !canvasData) { submittedValue.value = null; return; }
    if (requiresColor && !colorData) { submittedValue.value = null; return; }
    if (requiresFrameColor && !selectedFrameColor.value) { submittedValue.value = null; return; }
    if (selectedFrameColor.value === 'Ral' && !selectedRal.value) { return; }
    if (!width.value || !height.value) { submittedValue.value = null; return; }

    let pricePerSqm = 0;
    try {
      const foundPrice = priceMatrix[selectedProfile.value]?.[selectedCanvas.value]?.[frameColorForPrice];
      if (foundPrice !== undefined) {
        pricePerSqm = foundPrice;
      }
    } catch (e) {
      console.warn('Цена для комбинации не найдена, будет использован 0.');
    }

    const area = (width.value * height.value) / 1000000;
    const totalPrice = area * pricePerSqm;

    const finalFrameColor = selectedFrameColor.value === 'Ral' ? `RAL ${selectedRal.value}` : allFrameColors[selectedFrameColor.value]?.name;

    const addons = (profileData.addons || []).map(group => {
      const selectedOptionId = selectedAddons.value[group.id];
      const selectedOption = group.options.find(opt => opt.id === selectedOptionId);
      return { group: group.name, value: selectedOption?.name || 'Нет' };
    });

    submittedValue.value = {
      profile: profileData.name,
      canvas: canvasData?.name || 'Нет',
      color: colorData?.name || 'Нет',
      frameColor: finalFrameColor || 'Нет',
      width: width.value,
      height: height.value,
      addons: addons,
      totalPrice: totalPrice.toFixed(2),
    };
  };

  // Переносим наблюдатели сюда
  watch([selectedProfile, selectedCanvas, selectedColor, selectedFrameColor, selectedRal, width, height, selectedAddons], () => {
    calculate();
  }, { deep: true });

  return { submittedValue };
}
