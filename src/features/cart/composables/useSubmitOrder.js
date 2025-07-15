import { ref } from 'vue';

export function useSubmitOrder() {
  const isLoading = ref(false);
  const error = ref(null);
  const isSuccess = ref(false);

  const submit = async (orderData) => {
    isLoading.value = true;
    error.value = null;
    isSuccess.value = false;

    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
        error.value = "URL API не настроен. Проверьте файл .env и переменную VITE_API_URL.";
        isLoading.value = false;
        return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Не удалось получить детали ошибки от сервера.' }));
        throw new Error(errorData.message || 'Ошибка при отправке заказа');
      }
      
      isSuccess.value = true;
    } catch (e) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  return { isLoading, error, isSuccess, submit };
}
