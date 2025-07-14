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
            <RadioGroup 
              legend="Цвет рамки" 
              name="frame-color" 
              v-model="selectedFrameColor" 
              :options="frameColorOptions" 
              @option-click="onFrameColorClick"
            />
          </div>
        </div>

        <!-- Дополнительные опции -->
        <div v-for="addonGroup in addonGroups" :key="addonGroup.id" class="col-md-6">
          <RadioGroup
            :legend="addonGroup.name"
            :name="addonGroup.id"
            v-model="selectedAddons[addonGroup.id]"
            :options="addonGroup.options.map(opt => ({ value: opt.id, label: opt.name }))"
            :disabled-options="disabledAddons[addonGroup.id] || []"
          />
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
      <template v-if="submittedValue.addons && submittedValue.addons.length > 0">
        <hr class="my-2">
        <div v-for="addon in submittedValue.addons" :key="addon.group">
          <p class="mb-1"><strong>{{ addon.group }}:</strong> {{ addon.value }}</p>
        </div>
      </template>
      <hr class="my-2">
      <h5 class="text-end">Итого: <strong>{{ submittedValue.totalPrice }} &#8381;</strong></h5>
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
import { productConfiguration, allCanvases, allColors, allFrameColors } from '../data';
import { usePriceCalculator } from '../composables/usePriceCalculator';

// --- Реактивные переменные ---
const selectedProfile = ref('');
const selectedCanvas = ref('');
const selectedColor = ref('');
const selectedFrameColor = ref('');
const selectedRal = ref('');
const showRalPicker = ref(false);
const width = ref(null);
const height = ref(null);
const selectedAddons = ref({});
const submittedValue = ref(null);

// --- Исходные данные ---
const rawData = ref(productConfiguration);

// --- Использование нового композита для расчета цены ---
const { calculateTotalPrice } = usePriceCalculator();

// --- Вычисляемые свойства (Computed) ---
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
    if (color.id === 'Ral' && selectedRal.value) {
      option.extra = `(${selectedRal.value})`;
    }
    return option;
  });
});

const addonGroups = computed(() => {
  if (!selectedProfile.value) return [];
  const selected = rawData.value.find(item => item.id === selectedProfile.value);
  return selected?.addons || [];
});

const disabledAddons = computed(() => {
  const disabled = {};
  if (!selectedProfile.value) return disabled;

  const profile = rawData.value.find(p => p.id === selectedProfile.value);
  if (!profile || !profile.addons) return disabled;

  // Собираем все активные правила `disables`
  const allDisablingRules = [];
  for (const groupId in selectedAddons.value) {
    const selectedOptionId = selectedAddons.value[groupId];
    const group = profile.addons.find(g => g.id === groupId);
    const option = group?.options.find(o => o.id === selectedOptionId);
    if (option?.disables) {
      allDisablingRules.push(...option.disables);
    }
  }

  // Применяем правила
  allDisablingRules.forEach(rule => {
    if (!disabled[rule.groupId]) {
      disabled[rule.groupId] = [];
    }
    disabled[rule.groupId].push(rule.optionId);
  });

  return disabled;
});

// --- Логика расчета ---
const calculate = () => {
  const profileData = rawData.value.find(p => p.id === selectedProfile.value);
  if (!profileData) { submittedValue.value = null; return; }

  const canvasData = allCanvases[selectedCanvas.value];
  const colorData = allColors[selectedColor.value];

  const finalFrameColor = selectedFrameColor.value === 'Ral' ? `RAL ${selectedRal.value}` : allFrameColors[selectedFrameColor.value]?.name;

  const totalPrice = calculateTotalPrice(
    selectedProfile.value,
    selectedCanvas.value,
    selectedColor.value,
    selectedFrameColor.value,
    selectedRal.value,
    width.value,
    height.value,
    selectedAddons.value
  );

  const addons = (profileData.addons || []).map(group => {
    const selectedOptionId = selectedAddons.value[group.id];
    // Если ID опции null, значит, ничего не выбрано
    if (selectedOptionId === null) {
      return { group: group.name, value: 'Нет' };
    }
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

// --- Обработчики событий ---
const onFrameColorClick = (value) => {
  if (value === 'Ral') {
    showRalPicker.value = true;
  }
};

const onRalColorSelect = (ralId) => {
  selectedRal.value = ralId;
  showRalPicker.value = false;
};

// --- Наблюдатели (Watchers) ---
watch(selectedProfile, (newProfileId) => {
  const profile = rawData.value.find(p => p.id === newProfileId);
  if (!profile) return;

  width.value = profile.width || null;
  height.value = profile.height || null;
  selectedCanvas.value = (profile.canvases || []).length > 0 ? profile.canvases[0] : '';
  selectedFrameColor.value = (profile.frameColors || []).length > 0 ? profile.frameColors[0] : '';

  const newAddons = {};
  (profile.addons || []).forEach(group => {
    if (group.options.length > 0) {
      newAddons[group.id] = group.options[0].id;
    }
  });
  selectedAddons.value = newAddons;
});

watch(selectedCanvas, (newCanvasId) => {
  const canvas = allCanvases[newCanvasId];
  selectedColor.value = (canvas?.colors || []).length > 0 ? canvas.colors[0] : '';
});

watch(selectedFrameColor, (newFrameColor) => {
  if (newFrameColor !== 'Ral') {
    selectedRal.value = '';
  }
});

watch(disabledAddons, (newDisabled) => {
  const profile = rawData.value.find(p => p.id === selectedProfile.value);
  if (!profile || !profile.addons) return;

  profile.addons.forEach(group => {
    const groupId = group.id;
    const currentSelection = selectedAddons.value[groupId];
    const currentlyDisabled = newDisabled[groupId] || [];

    // Случай 1: Текущий выбор стал недоступен
    if (currentSelection && currentlyDisabled.includes(currentSelection)) {
      const firstAvailable = group.options.find(opt => !currentlyDisabled.includes(opt.id));
      selectedAddons.value[groupId] = firstAvailable ? firstAvailable.id : null;
    }

    // Случай 2: Группа была полностью отключена (выбор null), а теперь появились доступные опции
    if (currentSelection === null) {
      const firstAvailable = group.options.find(opt => !currentlyDisabled.includes(opt.id));
      if (firstAvailable) {
        selectedAddons.value[groupId] = firstAvailable.id;
      }
    }
  });
}, { deep: true });

watch([selectedProfile, selectedCanvas, selectedColor, selectedFrameColor, selectedRal, width, height, selectedAddons], () => {
  calculate();
}, { deep: true });

// --- Хук жизненного цикла ---
onMounted(() => {
  const defaultProfile = rawData.value.find(p => p.default);
  if (defaultProfile) {
    selectedProfile.value = defaultProfile.id;
  }
});

</script>

<style>

</style>