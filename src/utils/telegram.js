// Утилита отправки в Telegram через Яндекс.Облако (текущий основной канал).
// НЕ используй токен бота во фронтенде — он должен быть только в окружении YC/Cloudflare.
// Яндекс.Облако функция (d4em7sms8701tente7ba) сейчас недоступна из РФ (504 timeout).
// Этот модуль оставлен для обратной совместимости — он вызывается параллельно с backup.

const YANDEX_FUNCTION_URL = import.meta.env.VITE_YANDEX_FUNCTION_URL
  || 'https://functions.yandexcloud.net/d4em7sms8701tente7ba';

/** Таймаут для Telegram-канала. Если YC не отвечает — не блокируем форму. */
const TELEGRAM_TIMEOUT_MS = 8000;

/**
 * Попытка отправить уведомление через Яндекс.Облако → Telegram.
 * Возвращает { success, error } — никогда не бросает исключение.
 *
 * @param {Object} formData - { name, phone }
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendTelegramMessage = async (formData) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

  try {
    const response = await fetch(YANDEX_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = await response.json();

    if (data.ok) {
      console.info('[telegram] ✅ Сообщение отправлено в Telegram');
      return { success: true };
    }

    console.warn('[telegram] ⚠️ YC/Telegram error:', data.error);
    return { success: false, error: data.error || 'Ошибка отправки' };

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn('[telegram] ⏱️ Timeout — YC функция не ответила за', TELEGRAM_TIMEOUT_MS, 'мс');
      return { success: false, error: 'timeout' };
    }
    console.error('[telegram] ❌ Network Error:', error.message);
    return { success: false, error: 'Проверьте соединение' };
  }
};
