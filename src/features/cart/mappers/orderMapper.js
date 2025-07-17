/**
 * @file Этот модуль отвечает за преобразование внутренних данных приложения
 * в объект для передачи на сервер (DTO - Data Transfer Object).
 */
import {
  getProfileNameById,
  getCanvasNameById,
  getColorNameById,
  getFrameColorNameById,
  getAddonOptionNameById,
  getAddonGroupNameById,
} from '@/shared/utils/productHelpers';

// --- Хелперы для преобразования ключей ---

/**
 * Преобразует строку из camelCase в snake_case.
 * @param {string} str - Исходная строка.
 * @returns {string} Строка в snake_case.
 */
const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Рекурсивно преобразует все ключи в объекте или массиве в snake_case.
 * @param {*} obj - Исходный объект или массив.
 * @returns {*} Новый объект или массив с ключами в snake_case.
 */
const convertKeysToSnakeCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => convertKeysToSnakeCase(v));
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = toSnakeCase(key);
      acc[snakeKey] = convertKeysToSnakeCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};


/**
 * Преобразует данные из формы и корзины в готовый для отправки на сервер объект.
 * @param {object} form - Реактивный объект form.value из компонента OrderForm.
 * @param {object} cart - Объект с данными корзины (items, totals, motivation).
 * @param {object} options - Списки опций для нахождения текстовых меток.
 * @returns {object} Готовый DTO для отправки на сервер.
 */
export function createOrderPayload(form, cart, options) {
  const { deliveryOptions, orderTypeOptions, discountOptions } = options;
  console.log(cart);
  
  // 1. Создаем промежуточный объект с правильными текстовыми значениями
  // и уже с некоторыми snake_case ключами, которые мы явно задали ранее
  const payload = {
    order: {
      ...form,
      delivery_type: deliveryOptions.find(opt => opt.value === form.delivery_type)?.label || form.delivery_type,
      order_type: orderTypeOptions.find(opt => opt.value === form.orderType)?.text || form.orderType,
      discount: discountOptions.find(opt => opt.value === form.discount)?.text || `${form.discount}`,
    },
    cart: {
      ...(() => {
        const { ralPaintingCost, ralPaintingCount, ...restOfCart } = cart;
        return restOfCart;
      })(),
      items: cart.items.map(item => ({
        ...item,
        profile: getProfileNameById(item.profile),
        canvas: getCanvasNameById(item.canvas),
        color: getColorNameById(item.color),
        frame_color: getFrameColorNameById(item.frameColor),
        addons: (item.addons || []).map(addon => ({
          group_id: getAddonGroupNameById(item.profile, addon.groupId),
          option_id: getAddonOptionNameById(item.profile, addon.groupId, addon.optionId),
        })),
        ral_color: item.ralCode || ''
      })),
      ral_cost: cart.ralPaintingCost,
      ral_count: cart.ralPaintingCount,
      delivery_price: cart.deliveryPrice,
    },
  };


  // Удаляем старые camelCase ключи, чтобы не было дублирования
  delete payload.order.orderType;


  // 2. Рекурсивно конвертируем ВСЕ ключи в snake_case и возвращаем результат
  return convertKeysToSnakeCase(payload);
}