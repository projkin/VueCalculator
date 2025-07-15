import { ref } from 'vue';

export function useSubmitOrder() {
  const isLoading = ref(false);
  const error = ref(null);
  const isSuccess = ref(false);

  const submit = async (orderData) => {
    isLoading.value = true;
    error.value = null;
    isSuccess.value = false;

    try {
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Вместо отправки на сервер, выводим в консоль
      console.log('Отправляемые данные заказа:', orderData);

      // Здесь будет POST-запрос с использованием fetch, например:
      /*
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке заказа');
      }
      */

      isSuccess.value = true;
    } catch (e) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  return { isLoading, error, isSuccess, submit };
}
