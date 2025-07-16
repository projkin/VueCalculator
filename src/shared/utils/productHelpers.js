import { productConfiguration, allCanvases, allColors, allFrameColors, allRalColors } from '@/features/calculator/data/configuration.js';

export function getProfileNameById(id) {
  const profile = productConfiguration.find(p => p.id === id);
  return profile ? profile.name : 'Неизвестный профиль';
}

export function getCanvasNameById(id) {
  const canvas = allCanvases[id];
  return canvas ? canvas.name : 'Неизвестное полотно';
}

export function getColorNameById(id) {
  const color = allColors[id];
  return color ? color.name : 'Неизвестный цвет';
}

export function getFrameColorNameById(id) {
  const frameColor = allFrameColors[id];
  return frameColor ? frameColor.name : 'Неизвестный цвет рамки';
}


export function getAddonOptionNameById(profileId, groupId, optionId) {
  const profile = productConfiguration.find(p => p.id === profileId);
  if (!profile) return 'Неизвестный профиль';

  const group = profile.addons?.find(g => g.id === groupId);
  if (!group) return 'Неизвестная группа';

  const option = group.options.find(o => o.id === optionId);
  return option ? option.name : 'Нет';
}

export function getAddonGroupNameById(profileId, groupId) {
  const profile = productConfiguration.find(p => p.id === profileId);
  if (!profile) return 'Неизвестный профиль';

  const group = profile.addons?.find(g => g.id === groupId);
  return group ? group.name : 'Неизвестная группа';
}
