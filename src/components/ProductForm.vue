<template>
  <div class="container">
    <div class="card p-4">
      <h2 class="card-title text-center mb-4">Конфигуратор</h2>
      <BaseForm class="row g-3">
        <!-- Выбор профиля -->
        <div class="col-md-6">
          <InputSelect id="profile-type" label="Тип профиля" v-model="selectedProfile" :options="profileOptions" />
        </div>
        <div class="col-md-6">
          <!-- Выбор полотна -->
          <div v-if="selectedProfile && canvasOptions.length > 0">
            <InputSelect id="canvas-type" label="Тип полотна" v-model="selectedCanvas" :options="canvasOptions" />
          </div>
        </div>
        <div class="col-md-6">
          <!-- Ширина -->
          <InputNumber id="product-width" label="Ширина, мм" v-model="width" />
        </div>
        <div class="col-md-6">
          <!-- Высота -->
          <InputNumber id="product-height" label="Высота, мм" v-model="height" />
        </div>
        <div class="col-md-6">
          <!-- Выбор цвета полотна (появляется после выбора полотна) -->
          <div v-if="selectedCanvas && colorOptions.length > 0">
            <RadioGroup legend="Цвет полотна" name="canvas-color" v-model="selectedColor" :options="colorOptions" />
          </div>
        </div>
        <div class="col-md-6">
          <!-- Выбор цвета рамки (появляется после выбора профиля) -->
          <div v-if="selectedProfile && frameColorOptions.length > 0">
            <RadioGroup legend="Цвет рамки" name="frame-color" v-model="selectedFrameColor" :options="frameColorOptions" />
          </div>
        </div>
      </BaseForm>
    </div>
    <div v-if="submittedValue" class="mt-4 alert alert-success">
      <h5>Ваша конфигурация:</h5>
      <p class="mb-1"><strong>Профиль:</strong> {{ submittedValue.profile }}</p>
      <p class="mb-1"><strong>Полотно:</strong> {{ submittedValue.canvas }}</p>
      <p class="mb-1"><strong>Цвет полотна:</strong> {{ submittedValue.color }}</p>
      <p class="mb-1"><strong>Цвет рамки:</strong> {{ submittedValue.frameColor }}</p>
      <p class="mb-0"><strong>Размер:</strong> {{ submittedValue.width }} x {{ submittedValue.height }} мм</p>
    </div>

    <!-- Панель выбора RAL -->
    <RalColorPicker 
      v-model:show="showRalPicker" 
      @select="onRalColorSelect"
    />

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import BaseForm from './ui/BaseForm.vue';
import InputSelect from './ui/InputSelect.vue';
import RadioGroup from './ui/RadioGroup.vue';
import InputNumber from './ui/InputNumber.vue';
import RalColorPicker from './ui/RalColorPicker.vue';
import { productConfiguration, allCanvases, allColors, allFrameColors } from '../data/productData.js';

// --- Реактивные переменные --- //
const selectedProfile = ref('');
const selectedCanvas = ref('');
const selectedColor = ref('');
const selectedFrameColor = ref('');
const selectedRal = ref('');
const showRalPicker = ref(false);
const width = ref(null);
const height = ref(null);
const submittedValue = ref(null);

// --- Исходные данные --- //
const rawData = ref(productConfiguration);

// --- Вычисляемые свойства (Computed) --- //
const profileOptions = computed(() => {
  return rawData.value.map(item => ({ value: item.id, text: item.name }));
});

const canvasOptions = computed(() => {
  if (!selectedProfile.value) return [];
  const selected = rawData.value.find(item => item.id === selectedProfile.value);
  if (!selected || !selected.canvases) return [];
  return selected.canvases.map(canvasId => ({ value: allCanvases[canvasId].id, text: allCanvases[canvasId].name }));
});

const colorOptions = computed(() => {
  if (!selectedCanvas.value) return [];
  const selected = allCanvases[selectedCanvas.value];
  if (!selected || !selected.colors) return [];
  return selected.colors.map(colorId => ({ value: allColors[colorId].id, label: allColors[colorId].name }));
});

const frameColorOptions = computed(() => {
  if (!selectedProfile.value) return [];
  const selected = rawData.value.find(item => item.id === selectedProfile.value);
  if (!selected || !selected.frameColors) return [];

  return selected.frameColors.map(colorId => {
    const color = allFrameColors[colorId];
    const option = { 
      value: color.id, 
      label: color.name 
    };

    // Если это опция RAL и код RAL уже выбран, добавляем его в `extra`
    if (color.id === 'Ral' && selectedRal.value) {
      option.extra = `(${selectedRal.value})`;
    }

    return option;
  });
});

// --- Логика расчета --- //
const calculate = () => {
  const profileData = rawData.value.find(p => p.id === selectedProfile.value);
  if (!profileData) { submittedValue.value = null; return; }

  const canvasData = allCanvases[selectedCanvas.value];
  const colorData = allColors[selectedColor.value];
  const frameColorData = allFrameColors[selectedFrameColor.value];

  // Если выбран RAL, но код еще не указан, просто выходим, не сбрасывая результат
  if (frameColorData?.id === 'Ral' && !selectedRal.value) {
    return;
  }

  const requiresCanvas = (profileData.canvases || []).length > 0;
  const requiresColor = canvasData && (canvasData.colors || []).length > 0;
  const requiresFrameColor = (profileData.frameColors || []).length > 0;

  if (requiresCanvas && !canvasData) { submittedValue.value = null; return; }
  if (requiresColor && !colorData) { submittedValue.value = null; return; }
  if (requiresFrameColor && !frameColorData) { submittedValue.value = null; return; }
  if (!width.value || !height.value) { submittedValue.value = null; return; }

  const finalFrameColor = frameColorData.id === 'Ral' ? `RAL ${selectedRal.value}` : frameColorData.name;

  submittedValue.value = {
    profile: profileData.name,
    canvas: canvasData?.name || 'Нет',
    color: colorData?.name || 'Нет',
    frameColor: finalFrameColor,
    width: width.value,
    height: height.value,
  };
};

// --- Обработчики событий --- //
const onRalColorSelect = (ralId) => {
  selectedRal.value = ralId;
  showRalPicker.value = false;
};

// --- Наблюдатели (Watchers) --- //
watch(selectedProfile, (newProfileId) => {
  const profile = rawData.value.find(p => p.id === newProfileId);
  if (!profile) return;

  width.value = profile.width || null;
  height.value = profile.height || null;
  selectedCanvas.value = (profile.canvases || []).length > 0 ? profile.canvases[0] : '';
  selectedFrameColor.value = (profile.frameColors || []).length > 0 ? profile.frameColors[0] : '';
});

watch(selectedCanvas, (newCanvasId) => {
  const canvas = allCanvases[newCanvasId];
  selectedColor.value = (canvas?.colors || []).length > 0 ? canvas.colors[0] : '';
});

watch(selectedFrameColor, (newFrameColor) => {
  if (newFrameColor === 'Ral') {
    showRalPicker.value = true;
  } else {
    selectedRal.value = '';
  }
});

watch([selectedProfile, selectedCanvas, selectedColor, selectedFrameColor, selectedRal, width, height], () => {
  calculate();
});

// --- Хук жизненного цикла --- //
onMounted(() => {
  const defaultProfile = rawData.value.find(p => p.default);
  if (defaultProfile) {
    selectedProfile.value = defaultProfile.id;
  }
});

</script>

<style>

</style>