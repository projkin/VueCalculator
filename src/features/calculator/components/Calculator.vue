<template>
  <div>
    <div class="card p-4">
      <h2 class="card-title text-center mb-4">Конфигуратор</h2>
      <BaseForm class="row g-3">
        <div class="col-md-6">
          <InputSelect id="profile-type" label="Тип профиля" v-model="selectedProfile" :options="profileOptions" />
        </div>
        <div class="col-md-6">
          <div v-if="selectedProfile && canvasOptions.length > 0">
            <InputSelect id="canvas-type" label="Тип полотна" v-model="selectedCanvas" :options="canvasOptions" />
          </div>
        </div>
        <div class="col-md-6">
          <InputNumber id="product-width" label="Ширина, мм" v-model="width" />
        </div>
        <div class="col-md-6">
          <InputNumber id="product-height" label="Высота, мм" v-model="height" />
        </div>
        <div class="col-sm-6 col-md-4">
          <div v-if="selectedCanvas && colorOptions.length > 0">
            <RadioGroup legend="Цвет полотна" name="canvas-color" v-model="selectedColor" :options="colorOptions" />
          </div>
        </div>
        <div class="col-sm-6 col-md-4">
          <div v-if="selectedProfile && frameColorOptions.length > 0">
            <RadioGroup 
              legend="Цвет рамки" 
              name="frame-color" 
              v-model="selectedFrameColor"
              :options="frameColorOptions" 
              @option-click="onFrameColorOptionClick"
            />
          </div>
        </div>
        <div v-for="addonGroup in addonGroups" :key="addonGroup.id" class="col-sm-6 col-md-4">
          <RadioGroup
            :legend="addonGroup.name"
            :name="addonGroup.id"
            v-model="selectedAddons[addonGroup.id]"
            :options="addonGroup.options.map(opt => ({ value: opt.id, label: opt.name }))"
            :disabled-options="disabledAddons[addonGroup.id] || []"
          />
        </div>
        <div class="col-12">
          <InputText id="comment" label="Комментарий" v-model="comment" />
        </div>
      </BaseForm>
    </div>

    <ProductFormSummary :summary="submittedValue" @add-to-cart="handleAddToCart" />

    <RalColorPicker 
      v-model:show="showRalPicker" 
      @select="onRalColorSelect"
      @close="onRalPickerClose"
    />

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import BaseForm from '@/shared/ui/form/BaseForm.vue';
import InputSelect from '@/shared/ui/form/InputSelect.vue';
import RadioGroup from '@/shared/ui/form/RadioGroup.vue';
import InputNumber from '@/shared/ui/form/InputNumber.vue';
import InputText from '@/shared/ui/form/InputText.vue';
import RalColorPicker from '@/shared/ui/RalColorPicker.vue';
import ProductFormSummary from '@/features/calculator/components/ProductFormSummary.vue';
import { productConfiguration, allCanvases, allColors, allFrameColors } from '@/features/calculator/data/configuration.js';
import { usePriceCalculator } from '@/features/calculator/composables/usePriceCalculator.js';
import { useRaspilCalculator } from '@/features/calculator/composables/useRaspilCalculator.js';
import { useMotivationCalculator } from '@/features/calculator/composables/useMotivationCalculator.js';

const emit = defineEmits(['product-configured']);

// --- State ---
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
const comment = ref('');
const previousFrameColor = ref(''); // For RAL selection rollback

// --- Data ---
const rawData = ref(productConfiguration);

// --- Composables ---
const { calculateTotalPrice } = usePriceCalculator();
const { calculateRaspil } = useRaspilCalculator();
const { calculateMotivation } = useMotivationCalculator();

// --- Computed Properties ---
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

  const allDisablingRules = [];
  for (const groupId in selectedAddons.value) {
    const selectedOptionId = selectedAddons.value[groupId];
    const group = profile.addons.find(g => g.id === groupId);
    const option = group?.options.find(o => o.id === selectedOptionId);
    if (option?.disables) {
      allDisablingRules.push(...option.disables);
    }
  }

  allDisablingRules.forEach(rule => {
    if (!disabled[rule.groupId]) {
      disabled[rule.groupId] = [];
    }
    disabled[rule.groupId].push(rule.optionId);
  });

  return disabled;
});

// --- Logic ---
const calculate = () => {
  const profileData = rawData.value.find(p => p.id === selectedProfile.value);
  if (!profileData) { submittedValue.value = null; return; }

  const canvasData = allCanvases[selectedCanvas.value];
  const colorData = allColors[selectedColor.value];

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
    if (selectedOptionId === null) {
      return { group: group.name, value: 'Нет' };
    }
    const selectedOption = group.options.find(opt => opt.id === selectedOptionId);
    return { group: group.name, value: selectedOption?.name || 'Нет' };
  });

  const motivation = calculateMotivation({
    profileId: selectedProfile.value,
    canvasId: selectedCanvas.value,
    addons: selectedAddons.value,
  });

  const submissionData = {
    profile: profileData.name,
    canvas: canvasData?.name || 'Нет',
    color: colorData?.name || 'Нет',
    frameColor: allFrameColors[selectedFrameColor.value]?.name || 'Нет',
    width: width.value,
    height: height.value,
    addons: addons,
    comment: comment.value,
    totalPrice: totalPrice,
    motivation: motivation,
  };

  if (selectedFrameColor.value === 'Ral' && selectedRal.value) {
    submissionData.frameColor = 'RAL';
    submissionData.ralCode = selectedRal.value;
  }

  submittedValue.value = submissionData;
};

// --- Event Handlers ---
const onFrameColorOptionClick = (colorId) => {
  if (colorId === 'Ral') {
    showRalPicker.value = true;
  }
};

const onRalColorSelect = (ralId) => {
  selectedRal.value = ralId;
  showRalPicker.value = false;
};

const onRalPickerClose = () => {
  if (!selectedRal.value) {
    selectedFrameColor.value = previousFrameColor.value;
  }
};

const handleAddToCart = (summary) => {
  const raspil = calculateRaspil(selectedProfile.value, summary.width, summary.height);
  const motivation = calculateMotivation({
    profileId: selectedProfile.value,
    canvasId: selectedCanvas.value,
    addons: selectedAddons.value,
  });
  const productWithDetails = { ...summary, raspil, motivation };
  emit('product-configured', productWithDetails);
};

// --- Watchers ---
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

watch(selectedFrameColor, (newFrameColor, oldFrameColor) => {
  if (newFrameColor === 'Ral') {
    previousFrameColor.value = oldFrameColor;
    showRalPicker.value = true;
  } else {
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

    if (currentSelection && currentlyDisabled.includes(currentSelection)) {
      const firstAvailable = group.options.find(opt => !currentlyDisabled.includes(opt.id));
      selectedAddons.value[groupId] = firstAvailable ? firstAvailable.id : null;
    }

    if (currentSelection === null) {
      const firstAvailable = group.options.find(opt => !currentlyDisabled.includes(opt.id));
      if (firstAvailable) {
        selectedAddons.value[groupId] = firstAvailable.id;
      }
    }
  });
}, { deep: true });

watch([selectedProfile, selectedCanvas, selectedColor, selectedFrameColor, selectedRal, width, height, selectedAddons, comment], () => {
  calculate();
}, { deep: true });

// --- Lifecycle Hooks ---
onMounted(() => {
  const defaultProfile = rawData.value.find(p => p.default);
  if (defaultProfile) {
    selectedProfile.value = defaultProfile.id;
  }
});
</script>
