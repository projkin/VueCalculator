/**
 * @file Этот модуль отвечает за преобразование внутренних данных приложения
 * в объект для передачи на сервер (DTO - Data Transfer Object).
 */

/**
 * Преобразует данные из формы и корзины в готовый для отправки на сервер объект.
 * @param {object} form - Реактивный объект form.value из компонента OrderForm.
 * @param {object} cart - Объект с данными корзины (items, totals, motivation).
 * @param {object} options - Списки опций для нахождения текстовых меток.
 * @returns {object} Готовый DTO для отправки на сервер.
 */
export function createOrderPayload(form, cart, options) {
  const { deliveryOptions, orderTypeOptions, discountOptions } = options;

  const selectedDelivery = deliveryOptions.find(opt => opt.value === form.delivery_type);
  const selectedOrderType = orderTypeOptions.find(opt => opt.value === form.orderType);
  const selectedDiscount = discountOptions.find(opt => opt.value === form.discount);

  const formToSend = { ...form };

  // Заменяем значения на текстовые метки
  formToSend.delivery_type = selectedDelivery ? selectedDelivery.label : form.delivery_type;
  formToSend.discount = selectedDiscount ? selectedDiscount.text : `${form.discount}%`;

  // Заменяем orderType на order_type
  formToSend.order_type = selectedOrderType ? selectedOrderType.text : form.orderType;
  delete formToSend.orderType; // Удаляем старый ключ

  if (formToSend.delivery_type === 'Самовывоз') {
    delete formToSend.delivery_distance;
  }

  // Собираем итоговый объект с ключом order
  return {
    order: formToSend,
    cart: {
      items: cart.items,
      total: cart.total,
      ral_cost: cart.ralPaintingCost, // Переименовываем только это поле
      motivation: cart.motivation,
    },
  };
}
