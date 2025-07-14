import { motivationMatrix } from '../data/motivation.js';

export function useMotivationCalculator() {
  const calculateMotivation = (profileId, canvasId) => {
    const defaultMotivation = { assembler: 0, installer: 0 };
    
    if (!profileId || !canvasId) {
      return defaultMotivation;
    }

    const motivation = motivationMatrix[profileId]?.[canvasId] || defaultMotivation;

    return motivation;
  };

  return { calculateMotivation };
}
