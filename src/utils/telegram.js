// Новый эндпоинт в Яндекс.Облаке для стабильной работы из РФ
const YANDEX_FUNCTION_URL = 'https://functions.yandexcloud.net/d4em7sms8701tente7ba';

export const sendTelegramMessage = async (formData) => {
  try {
    const response = await fetch(YANDEX_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
      }),
    });

    const data = await response.json();
    if (data.ok) return { success: true };
    return { success: false, error: data.error || 'Ошибка отправки' };
  } catch (error) {
    console.error('Network Error:', error);
    return { success: false, error: 'Проверьте соединение' };
  }
};
