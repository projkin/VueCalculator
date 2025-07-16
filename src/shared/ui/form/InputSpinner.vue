<template>
  <div class="input-group" style="width: 120px;">
    <button class="btn btn-outline-secondary" type="button" @click="decrement">-</button>
    <input 
      type="number" 
      class="form-control text-center" 
      :value="modelValue" 
      @input="onInput"
      min="1"
    />
    <button class="btn btn-outline-secondary" type="button" @click="increment">+</button>
  </div>
</template>

<script setup>


const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
    default: 1,
  },
});

const emit = defineEmits(['update:modelValue']);

const increment = () => {
  emit('update:modelValue', props.modelValue + 1);
};

const decrement = () => {
  if (props.modelValue > 1) {
    emit('update:modelValue', props.modelValue - 1);
  }
};

const onInput = (event) => {
  const value = parseInt(event.target.value, 10);
  if (!isNaN(value) && value >= 1) {
    emit('update:modelValue', value);
  } else if (event.target.value === '') {
    // Позволяем временно очищать поле, но не эмитим невалидное значение
  } else {
    // Если введено что-то невалидное, возвращаем значение в инпут
    event.target.value = props.modelValue;
  }
};
</script>

<style scoped>
/* Убираем стандартные стрелки у инпута */
input[type='number']::-webkit-inner-spin-button, 
input[type='number']::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
