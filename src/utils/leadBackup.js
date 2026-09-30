/**
 * Lead ingest client.
 *
 * Production flow:
 * browser -> Yandex Cloud Function -> YDB -> MAX
 * browser -> Google Apps Script -> existing email delivery
 */

const LEAD_INGEST_URL = import.meta.env.VITE_YANDEX_FUNCTION_URL
  || 'https://functions.yandexcloud.net/d4e4cvesch2fiq2hpsts';
const BACKUP_URL = import.meta.env.VITE_BACKUP_LEADS_URL || '';

const LEAD_INGEST_TIMEOUT_MS = 10000;
const BACKUP_TIMEOUT_MS = 10000;
const STATUS_TIMEOUT_MS = 5000;
const MAX_UI_WAIT_MS = 12000;

export function generateLeadId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const random = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `lead_${date}_${time}_${random}`;
}

function collectUtmParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
      yclid: params.get('yclid') || '',
    };
  } catch {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      utm_term: '',
      yclid: '',
    };
  }
}

export function buildLeadPayload(formData, leadId) {
  const utm = collectUtmParams();

  return {
    lead_id: leadId,
    name: formData.name,
    phone: formData.phone,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    ...utm,
    website: formData.website || '',
  };
}

export async function sendLeadIngest(payload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LEAD_INGEST_TIMEOUT_MS);

  try {
    const response = await fetch(LEAD_INGEST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.ok && data.saved) {
      console.info('[leadIngest] Lead saved:', {
        lead_id: data.lead_id,
        max_status: data.max_status,
        mail_status: data.mail_status,
      });
      return data;
    }

    console.warn('[leadIngest] Server rejected lead:', data.error || response.status);
    return {
      ok: false,
      saved: false,
      error: data.error || `HTTP ${response.status}`,
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('[leadIngest] Timeout after', LEAD_INGEST_TIMEOUT_MS, 'ms');
      return { ok: false, saved: false, error: 'timeout' };
    }
    console.error('[leadIngest] Network error:', err.message);
    return { ok: false, saved: false, error: 'network' };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function sendLeadBackup(payload) {
  if (!BACKUP_URL) {
    return { ok: false, error: 'Backup URL not configured' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKUP_TIMEOUT_MS);

  try {
    const response = await fetch(BACKUP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      keepalive: true,
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.ok) return data;
    return { ok: false, error: data.error || `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, error: error.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function checkLeadBackup(leadId) {
  if (!BACKUP_URL) return { ok: false, saved: false, error: 'Backup URL not configured' };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), STATUS_TIMEOUT_MS);
  try {
    const url = new URL(BACKUP_URL);
    url.searchParams.set('lead_id', leadId);
    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok && data.ok, saved: Boolean(response.ok && data.ok && data.saved) };
  } catch (error) {
    return { ok: false, saved: false, error: error.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timeoutId);
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Resolve as soon as either server confirms persistence. All retries reuse lead_id. */
export async function submitLeadWithConfirmation(payload, onLateSuccess) {
  const ingest = sendLeadIngest(payload).then((result) => {
    if (result.ok && result.saved) return { saved: true, channel: 'ydb', result };
    throw new Error(result.error || 'YDB not confirmed');
  });

  const backup = (async () => {
    const first = await sendLeadBackup(payload);
    if (first.ok && !first.spam_filtered) return { saved: true, channel: 'google', result: first };
    const checked = await checkLeadBackup(payload.lead_id);
    if (checked.saved) return { saved: true, channel: 'google', result: checked };
    // A network failure may have happened before the first POST reached Google.
    // The server locks the lookup and insert, so this retry cannot add a second row.
    const second = await sendLeadBackup(payload);
    if (second.ok && !second.spam_filtered) return { saved: true, channel: 'google', result: second };
    const finalCheck = await checkLeadBackup(payload.lead_id);
    if (finalCheck.saved) return { saved: true, channel: 'google', result: finalCheck };
    throw new Error(second.error || first.error || 'Google not confirmed');
  })();

  const status = (async () => {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      await delay(2000);
      const checked = await checkLeadBackup(payload.lead_id);
      if (checked.saved) return { saved: true, channel: 'google', result: checked };
    }
    throw new Error('Status not confirmed');
  })();

  const confirmation = Promise.any([ingest, backup, status]).catch(() => null);
  const quickResult = await Promise.race([confirmation, delay(MAX_UI_WAIT_MS).then(() => null)]);
  if (quickResult) return quickResult;
  // The browser is free to retry with the same ID while slow requests finish.
  confirmation.then((lateResult) => {
    if (lateResult && typeof onLateSuccess === 'function') onLateSuccess(lateResult);
  });
  return { saved: false, error: 'unconfirmed' };
}
