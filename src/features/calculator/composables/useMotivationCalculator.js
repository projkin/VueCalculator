import { motivationMatrix, addonMotivation } from '../data/motivation.js';

export function useMotivationCalculator() {
  const calculateMotivation = (product) => {
    const { profileId, canvasId, addons } = product;
    const defaultMotivation = { assembler: 0, installer: 0 };

    if (!profileId || !canvasId) {
      return defaultMotivation;
    }

    const baseMotivation = motivationMatrix[profileId]?.[canvasId] || defaultMotivation;

    const addonMotivationResult = {
      assembler: 0,
      installer: 0,
    };

    if (addons) {
      for (const addonGroupId in addons) {
        const selectedOptionId = addons[addonGroupId];
        if (selectedOptionId) {
          addonMotivationResult.assembler += addonMotivation.assembler[addonGroupId]?.[selectedOptionId] || 0;
          addonMotivationResult.installer += addonMotivation.installer[addonGroupId]?.[selectedOptionId] || 0;
        }
      }
    }

    return {
      assembler: baseMotivation.assembler + addonMotivationResult.assembler,
      installer: baseMotivation.installer + addonMotivationResult.installer,
    };
  };

  return { calculateMotivation };
}
