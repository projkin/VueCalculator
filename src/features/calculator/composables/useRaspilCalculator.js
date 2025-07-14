import { raspilMatrix } from '../data/raspil.js';

export function useRaspilCalculator() {
  const calculateRaspil = (profileId, width, height) => {
    const raspilData = raspilMatrix[profileId];
    
    if (!raspilData) {
      return { raspilWidth: 0, raspilHeight: 0, impost: 0 };
    }

    const raspilWidth = Number(width) - raspilData.width;
    const raspilHeight = Number(height) - raspilData.height;
    const impost = raspilWidth + raspilData.impost;

    return { raspilWidth, raspilHeight, impost };
  };

  return { calculateRaspil };
}
