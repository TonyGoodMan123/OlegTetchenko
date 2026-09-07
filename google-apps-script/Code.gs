// =================================================================
// Google Apps Script — Lead Backup для сайта Олег Тетченко
// Таблица: "Заявки сайта Олег"
// SPREADSHEET_ID: 12LH2dc64FZxdMoFNalnfikAfVOWGiCIPs52C_9FI2Fs
// =================================================================

// ── Базовая конфигурация ──────────────────────────────────────────
const CONFIG = {
  SPREADSHEET_ID: '12LH2dc64FZxdMoFNalnfikAfVOWGiCIPs52C_9FI2Fs',
  EMAIL_TO: 'Olegt68@mail.ru',
  TIMEZONE: 'Asia/Yekaterinburg',
  
  SHEET_NAME_LEADS: 'Leads',
  SHEET_NAME_LOGS: 'Logs',
  SHEET_NAME_CONFIG: 'Config',

  // Максимальная длина текстового поля
  MAX_FIELD_LENGTH: 500,

  // Honeypot-поле для защиты от ботов
  HONEYPOT_FIELD: 'website',
};

// ── Ожидаемые колонки Leads (порядок по умолчанию) ────────────────
const DEFAULT_LEADS_COLUMNS = [
  'lead_id',
  'created_at',
  'name',
  'phone',
  'page_url',
  'referrer',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'yclid',
  'user_agent',
  'telegram_status',
];

// ── Ожидаемые колонки Logs ────────────────────────────────────────
const DEFAULT_LOGS_COLUMNS = [
  'timestamp',
  'lead_id',
  'event',
  'status',
  'details',
];

// ── Вспомогательные функции ───────────────────────────────────────

/**
 * Получить рабочий Spreadsheet (по ID или активный).
 */
function getSpreadsheet() {
  if (CONFIG.SPREADSHEET_ID) {
    try {
      return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    } catch (e) {
      console.warn('Cannot open by SPREADSHEET_ID, falling back to active:', e.toString());
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Получить настройки из листа Config (если он существует).
 */
function loadConfigFromSheet(ss) {
  const configSheet = ss.getSheetByName(CONFIG.SHEET_NAME_CONFIG);
  if (!configSheet) return CONFIG;

  try {
    const data = configSheet.getDataRange().getValues();
    for (let i = 0; i < data.length; i++) {
      const key = String(data[i][0] || '').trim().toUpperCase();
      const val = String(data[i][1] || '').trim();
      if (key === 'EMAIL_TO' && val) CONFIG.EMAIL_TO = val;
      if (key === 'TIMEZONE' && val) CONFIG.TIMEZONE = val;
      if (key === 'SPREADSHEET_ID' && val) CONFIG.SPREADSHEET_ID = val;
    }
  } catch (e) {
    console.warn('Error reading Config sheet:', e.toString());
  }
  return CONFIG;
}

/**
 * Получить или создать лист по имени с заголовками.
 */
function getOrCreateSheet(ss, name, defaultHeaders) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (defaultHeaders && defaultHeaders.length > 0) {
      sheet.getRange(1, 1, 1, defaultHeaders.length).setValues([defaultHeaders]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, defaultHeaders.length)
        .setBackground('#591d81')
        .setFontColor('#ffffff')
        .setFontWeight('bold');
    }
  }
  return sheet;
}

/**
 * Очистка значений от инъекций формул и ограничение длины.
 */
function sanitize(value) {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  // Экранирование формульных инъекций Google Sheets
  if (/^[=+\-@\t\r]/.test(str)) return "'" + str;
  return str.slice(0, CONFIG.MAX_FIELD_LENGTH);
}

/**
 * Записать событие в лист Logs.
 * Колонки: timestamp | lead_id | event | status | details
 */
function writeLog(ss, leadId, event, status, details) {
  try {
    const logsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAME_LOGS, DEFAULT_LOGS_COLUMNS);
    const ts = new Date().toISOString();
    const detailsStr = typeof details === 'object' ? JSON.stringify(details).slice(0, 1000) : String(details || '');
    logsSheet.appendRow([ts, leadId || '', event, status, detailsStr]);
  } catch (e) {
    console.error('writeLog failed:', e.toString());
  }
}

/**
 * Ответ в формате JSON.
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Главный обработчик POST (приём заявки с сайта) ───────────────

function doPost(e) {
  const ss = getSpreadsheet();
  loadConfigFromSheet(ss);

  let body = {};
  let leadId = '';

  try {
    const rawContent = e && e.postData ? e.postData.contents : '';
    if (!rawContent) {
      writeLog(ss, '', 'INVALID_REQUEST', 'FAILED', 'Empty body');
      return jsonResponse({ ok: false, error: 'Empty body' });
    }

    try {
      body = JSON.parse(rawContent);
    } catch (parseErr) {
      writeLog(ss, '', 'INVALID_REQUEST', 'FAILED', 'JSON parse error: ' + parseErr.message);
      return jsonResponse({ ok: false, error: 'Invalid JSON' });
    }

    // ── 1. Проверка Honeypot ────────────────────────────────────────
    if (body[CONFIG.HONEYPOT_FIELD] && String(body[CONFIG.HONEYPOT_FIELD]).trim().length > 0) {
      writeLog(ss, body.lead_id || '', 'INVALID_REQUEST', 'REJECTED', 'Honeypot triggered');
      // Возвращаем ok: true чтобы бот не предпринимал повторных попыток
      return jsonResponse({ ok: true, spam_filtered: true });
    }

    // ── 2. Валидация обязательных полей ─────────────────────────────
    const name = sanitize(body.name);
    const phone = sanitize(body.phone);
    leadId = sanitize(body.lead_id) || ('lead_' + Utilities.getUuid());

    if (!name || name.length < 2) {
      writeLog(ss, leadId, 'INVALID_REQUEST', 'FAILED', 'Missing name');
      return jsonResponse({ ok: false, error: 'Имя обязательно' });
    }

    if (!phone || phone.length < 5) {
      writeLog(ss, leadId, 'INVALID_REQUEST', 'FAILED', 'Missing phone');
      return jsonResponse({ ok: false, error: 'Телефон обязателен' });
    }

    // ── 3. Подготовка данных лида ───────────────────────────────────
    const createdAt = new Date().toISOString();
    const leadData = {
      lead_id: leadId,
      created_at: createdAt,
      name: name,
      phone: phone,
      page_url: sanitize(body.page_url),
      referrer: sanitize(body.referrer),
      utm_source: sanitize(body.utm_source),
      utm_medium: sanitize(body.utm_medium),
      utm_campaign: sanitize(body.utm_campaign),
      utm_content: sanitize(body.utm_content),
      utm_term: sanitize(body.utm_term),
      yclid: sanitize(body.yclid),
      user_agent: sanitize(body.user_agent),
      telegram_status: sanitize(body.telegram_status) || 'unknown',
    };

    // ── 4. Защита от дублей по lead_id ──────────────────────────────
    const leadsSheet = getOrCreateSheet(ss, CONFIG.SHEET_NAME_LEADS, DEFAULT_LEADS_COLUMNS);
    const existingValues = leadsSheet.getDataRange().getValues();

    if (existingValues.length > 1) {
      const headerRow = existingValues[0];
      const leadIdCol = headerRow.indexOf('lead_id');
      if (leadIdCol >= 0) {
        for (let i = 1; i < existingValues.length; i++) {
          if (String(existingValues[i][leadIdCol]) === leadId) {
            writeLog(ss, leadId, 'DUPLICATE_REJECTED', 'SUCCESS', { lead_id: leadId });
            return jsonResponse({ ok: true, duplicate: true, lead_id: leadId });
          }
        }
      }
    }

    // ── 5. Запись строки в лист Leads (сопоставление по колонкам) ───
    // Считываем фактические заголовки листа
    const actualHeaders = existingValues[0] && existingValues[0].length > 0
      ? existingValues[0]
      : DEFAULT_LEADS_COLUMNS;

    const rowToWrite = actualHeaders.map(function(colName) {
      const key = String(colName).trim();
      return leadData[key] !== undefined ? leadData[key] : '';
    });

    leadsSheet.appendRow(rowToWrite);
    writeLog(ss, leadId, 'LEAD_SAVED', 'SUCCESS', { name: name, phone: phone.slice(0, 5) + '***' });

    // ── 6. Отправка Email Олегу (только ПОСЛЕ успешной записи) ──────
    let emailStatus = 'skipped';
    if (CONFIG.EMAIL_TO) {
      try {
        let formattedTime = createdAt;
        try {
          formattedTime = Utilities.formatDate(new Date(createdAt), CONFIG.TIMEZONE, 'dd.MM.yyyy HH:mm:ss');
        } catch (_) {}

        const subject = 'Новая заявка с сайта — ' + name;
        
        const plainText = [
          'Новая заявка с сайта кинезиолог-ноябрьск.рф',
          '',
          'Имя: ' + name,
          'Телефон: ' + phone,
          'Дата и время: ' + formattedTime + ' (' + CONFIG.TIMEZONE + ')',
          'Страница: ' + (leadData.page_url || '—'),
          '',
          '--- Источник / UTM ---',
          'utm_source: ' + (leadData.utm_source || '—'),
          'utm_medium: ' + (leadData.utm_medium || '—'),
          'utm_campaign: ' + (leadData.utm_campaign || '—'),
          'utm_content: ' + (leadData.utm_content || '—'),
          'utm_term: ' + (leadData.utm_term || '—'),
          'yclid: ' + (leadData.yclid || '—'),
          'referrer: ' + (leadData.referrer || '—'),
          '',
          'lead_id: ' + leadId,
          'telegram_status: ' + leadData.telegram_status,
        ].join('\n');

        const htmlBody = [
          '<div style="font-family: Arial, sans-serif; max-width: 600px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">',
          '  <h2 style="color: #591d81; margin-top: 0;">🔔 Новая заявка с сайта</h2>',
          '  <table style="width: 100%; border-collapse: collapse; font-size: 15px;">',
          '    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; color: #718096; width: 130px;">Имя:</td><td style="padding: 10px 0; font-weight: bold; color: #1a202c; font-size: 18px;">' + name + '</td></tr>',
          '    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; color: #718096;">Телефон:</td><td style="padding: 10px 0; font-weight: bold; color: #591d81; font-size: 20px;"><a href="tel:' + phone.replace(/\s+/g, '') + '" style="color: #591d81; text-decoration: none;">' + phone + '</a></td></tr>',
          '    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; color: #718096;">Дата и время:</td><td style="padding: 10px 0; color: #2d3748;">' + formattedTime + '</td></tr>',
          '    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; color: #718096;">Страница:</td><td style="padding: 10px 0; color: #2d3748; word-break: break-all; font-size: 13px;">' + (leadData.page_url || '—') + '</td></tr>',
          '    <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 0; color: #718096;">Источник:</td><td style="padding: 10px 0; color: #2d3748;">' + (leadData.utm_source || leadData.referrer || 'Прямой заход') + '</td></tr>',
          '  </table>',
          '  <p style="margin-top: 20px; font-size: 12px; color: #a0aec0;">lead_id: ' + leadId + ' | telegram_status: ' + leadData.telegram_status + '</p>',
          '</div>'
        ].join('\n');

        MailApp.sendEmail({
          to: CONFIG.EMAIL_TO,
          subject: subject,
          body: plainText,
          htmlBody: htmlBody,
        });

        emailStatus = 'sent';
        writeLog(ss, leadId, 'EMAIL_SENT', 'SUCCESS', { to: CONFIG.EMAIL_TO });
      } catch (mailErr) {
        emailStatus = 'failed: ' + mailErr.toString();
        writeLog(ss, leadId, 'EMAIL_FAILED', 'FAILED', mailErr.toString());
        // Ошибка email не отменяет успешность сохранения лида
      }
    }

    return jsonResponse({
      ok: true,
      lead_id: leadId,
      email_status: emailStatus,
    });

  } catch (globalErr) {
    console.error('doPost fatal error:', globalErr.toString());
    writeLog(ss, leadId || '', 'ERROR', 'FAILED', globalErr.toString());
    return jsonResponse({
      ok: false,
      error: 'Internal server error: ' + globalErr.toString(),
    });
  }
}

// ── GET Обработчик (Healthcheck) ──────────────────────────────────

function doGet(e) {
  const ss = getSpreadsheet();
  return jsonResponse({
    ok: true,
    service: 'lead-backup',
    spreadsheet_id: ss ? ss.getId() : null,
    spreadsheet_name: ss ? ss.getName() : null,
    timestamp: new Date().toISOString(),
  });
}
