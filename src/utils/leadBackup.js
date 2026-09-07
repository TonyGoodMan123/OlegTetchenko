/**
 * leadBackup.js
 * Независимый резервный канал сохранения заявок — Google Apps Script → Google Sheets.
 * Не зависит от Telegram, Yandex Cloud и любых других внешних сервисов.
 */

// URL Google Apps Script Web App.
// Задаётся через переменную окружения VITE_BACKUP_LEADS_URL в .env
// Никогда не хардкодить здесь напрямую — чтобы не коммитить в Git.
const BACKUP_URL = import.meta.env.VITE_BACKUP_LEADS_URL || '';

/** Таймаут для backup-запроса в миллисекундах */
const BACKUP_TIMEOUT_MS = 12000;

/**
 * Генерирует уникальный lead_id на клиенте.
 * Формат: lead_YYYYMMDD_HHMMSS_random
 */
export function generateLeadId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `lead_${date}_${time}_${random}`;
}

/**
 * Читает UTM-метки и yclid из текущего URL страницы.
 * @returns {Object} объект с utm-полями
 */
function collectUtmParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source:   params.get('utm_source')   || '',
      utm_medium:   params.get('utm_medium')   || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content:  params.get('utm_content')  || '',
      utm_term:     params.get('utm_term')     || '',
      yclid:        params.get('yclid')        || '',
    };
  } catch {
    return {
      utm_source: '', utm_medium: '', utm_campaign: '',
      utm_content: '', utm_term: '', yclid: '',
    };
  }
}

/**
 * Собирает полный payload для backup.
 * @param {Object} formData - данные из формы: { name, phone }
 * @param {string} leadId - уникальный ID заявки
 * @param {string} telegramStatus - результат отправки в Telegram ('sent' | 'failed' | 'unknown')
 * @returns {Object}
 */
export function buildLeadPayload(formData, leadId, telegramStatus = 'unknown') {
  const utm = collectUtmParams();

  return {
    lead_id:          leadId,
    name:             formData.name,
    phone:            formData.phone,
    page_url:         typeof window !== 'undefined' ? window.location.href : '',
    referrer:         typeof document !== 'undefined' ? document.referrer : '',
    telegram_status:  telegramStatus,
    user_agent:       typeof navigator !== 'undefined' ? navigator.userAgent : '',
    ...utm,
    // Honeypot — если бот заполнил это поле, оно передастся в Apps Script и скрипт тихо отклонит заявку
    website: formData.website || '',
  };
}

/**
 * Отправляет резервную копию заявки в Google Sheets через Apps Script Web App.
 *
 * @param {Object} payload - данные лида (buildLeadPayload)
 * @returns {Promise<{ok: boolean, lead_id?: string, error?: string, duplicate?: boolean}>}
 */
export async function sendLeadBackup(payload) {
  if (!BACKUP_URL) {
    console.warn('[leadBackup] VITE_BACKUP_LEADS_URL не задан. Backup отключён.');
    return { ok: false, error: 'Backup URL not configured' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKUP_TIMEOUT_MS);

  try {
    const response = await fetch(BACKUP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // Apps Script не принимает application/json через CORS без preflight
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      console.error('[leadBackup] HTTP error', response.status, text.slice(0, 200));
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    if (data.ok) {
      console.info('[leadBackup] ✅ Saved to Google Sheets. lead_id:', data.lead_id);
    } else {
      console.warn('[leadBackup] ⚠️ Server returned not-ok:', data.error);
    }
    return data;

  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.error('[leadBackup] ⏱️ Timeout after', BACKUP_TIMEOUT_MS, 'ms');
      return { ok: false, error: 'timeout' };
    }
    console.error('[leadBackup] ❌ Network error:', err.message);
    return { ok: false, error: err.message };
  }
}
