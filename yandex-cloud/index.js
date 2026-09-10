import { MetadataCredentialsProvider } from '@ydbjs/auth/metadata';
import { AccessTokenCredentialsProvider } from '@ydbjs/auth/access-token';
import { Driver } from '@ydbjs/core';
import { query, unsafe } from '@ydbjs/query';
import { Timestamp, Uint32, Utf8 } from '@ydbjs/value/primitive';
import nodemailer from 'nodemailer';

const TABLE_NAME = process.env.YDB_TABLE_NAME || 'leads';
const MAX_API_BASE = process.env.MAX_API_BASE || 'https://platform-api2.max.ru';
const MAX_NOTIFICATION_ATTEMPTS = Number(process.env.MAX_NOTIFICATION_ATTEMPTS || 10);
const MAIL_NOTIFICATION_ATTEMPTS = Number(process.env.MAIL_NOTIFICATION_ATTEMPTS || 10);
const RETRY_LIMIT = Number(process.env.RETRY_LIMIT || 20);
const ALERT_COOLDOWN_MS = Number(process.env.ALERT_COOLDOWN_MS || 60 * 60 * 1000);
const TEST_FAILURE_SECRET = process.env.TEST_FAILURE_SECRET || '';

const ALLOWED_ORIGINS = new Set([
  'https://кинезиолог-ноябрьск.рф',
  'https://xn----btbehkecmhgsgjbd7ar1r2b.xn--p1ai',
  'https://www.xn----btbehkecmhgsgjbd7ar1r2b.xn--p1ai',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

export async function handler(event = {}, context = {}) {
  if (event.httpMethod || event.headers || event.body) {
    return handleHttp(event, context);
  }

  return withYdb(context, async (sql) => {
    await ensureLeadsTable(sql);
    const result = await retryFailedNotifications(sql, {});
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ ok: true, ...result }),
    };
  });
}

async function handleHttp(event, context) {
  const origin = getHeader(event.headers, 'origin');
  const headers = corsHeaders(origin);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, headers, { ok: false, error: 'Method not allowed' });
  }

  const bodyResult = parseBody(event);
  if (!bodyResult.ok) {
    return jsonResponse(400, headers, { ok: false, error: bodyResult.error });
  }

  const body = bodyResult.body;
  const simulation = getAllowedSimulation(event.headers, body);

  try {
    const response = await withYdb(context, async (sql) => {
      await ensureLeadsTable(sql);
      return ingestLead(sql, body, simulation);
    });
    return jsonResponse(response.httpStatus, headers, response.body);
  } catch (error) {
    console.error('LEAD_INGEST_FATAL', safeError(error));
    return jsonResponse(502, headers, { ok: false, error: 'Lead storage failed' });
  }
}

async function ingestLead(sql, rawBody, simulation) {
  const validation = validateLead(rawBody);
  if (!validation.ok) {
    return { httpStatus: 400, body: { ok: false, saved: false, error: validation.error } };
  }

  if (String(rawBody.website || '').trim()) {
    return { httpStatus: 200, body: { ok: true, saved: false, spam_filtered: true } };
  }

  const now = new Date();
  const lead = {
    lead_id: validation.lead_id,
    created_at: now,
    updated_at: now,
    name: validation.name,
    phone: validation.phone,
    page_url: sanitize(rawBody.page_url, 1000),
    referrer: sanitize(rawBody.referrer, 1000),
    utm_source: sanitize(rawBody.utm_source),
    utm_medium: sanitize(rawBody.utm_medium),
    utm_campaign: sanitize(rawBody.utm_campaign),
    utm_content: sanitize(rawBody.utm_content),
    utm_term: sanitize(rawBody.utm_term),
    yclid: sanitize(rawBody.yclid),
    max_status: 'pending',
    max_attempts: 0,
    max_last_attempt_at: null,
    mail_status: 'pending',
    mail_attempts: 0,
    mail_last_attempt_at: null,
    last_error: '',
    retry_after: null,
    max_alerted_at: null,
    mail_alerted_at: null,
  };

  const insert = await insertLead(sql, lead);
  if (!insert.inserted) {
    const existing = await findLead(sql, lead.lead_id);
    return {
      httpStatus: 200,
      body: {
        ok: true,
        saved: true,
        duplicate: true,
        lead_id: lead.lead_id,
        max_status: existing?.max_status || 'unknown',
        mail_status: existing?.mail_status || 'unknown',
      },
    };
  }

  console.info('LEAD_SAVED', { lead_id: lead.lead_id, name: maskName(lead.name), phone: maskPhone(lead.phone) });

  const maxResult = await attemptMax(lead, simulation);
  const mailResult = await attemptMail(lead, simulation);
  const alertResult = await maybeSendFailureAlert(lead, maxResult, mailResult, simulation);

  const statuses = buildStatusUpdate(lead, now, maxResult, mailResult, alertResult);
  await updateLeadStatuses(sql, lead.lead_id, statuses);

  return {
    httpStatus: 200,
    body: {
      ok: true,
      saved: true,
      lead_id: lead.lead_id,
      max_status: statuses.max_status,
      mail_status: statuses.mail_status,
    },
  };
}

async function retryFailedNotifications(sql, simulation) {
  const leads = await listRetryLeads(sql);
  const results = [];

  for (const lead of leads) {
    const now = new Date();
    const maxResult = shouldRetryMax(lead)
      ? await attemptMax(lead, simulation)
      : { status: lead.max_status || 'skipped', attemptsDelta: 0 };
    const mailResult = shouldRetryMail(lead)
      ? await attemptMail(lead, simulation)
      : { status: lead.mail_status || 'skipped', attemptsDelta: 0 };
    const alertResult = await maybeSendFailureAlert(lead, maxResult, mailResult, simulation);

    const statuses = buildStatusUpdate(lead, now, maxResult, mailResult, alertResult);
    await updateLeadStatuses(sql, lead.lead_id, statuses);
    results.push({ lead_id: lead.lead_id, max_status: statuses.max_status, mail_status: statuses.mail_status });
  }

  return { retried: results.length, results };
}

async function withYdb(context, fn) {
  const connectionString = process.env.YDB_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('YDB_CONNECTION_STRING is not configured');
  }

  const accessToken = typeof context?.token === 'string'
    ? context.token
    : context?.token?.access_token;
  const credentialsProvider = accessToken
    ? new AccessTokenCredentialsProvider({ token: accessToken })
    : new MetadataCredentialsProvider();

  const driver = new Driver(connectionString, {
    credentialsProvider,
    'ydb.sdk.enable_discovery': false,
  });

  try {
    await driver.ready();
    return await fn(query(driver));
  } finally {
    await driver.close();
  }
}

async function ensureLeadsTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS ${sql.identifier(TABLE_NAME)} (
      lead_id Utf8 NOT NULL,
      created_at Timestamp,
      updated_at Timestamp,
      name Utf8,
      phone Utf8,
      page_url Utf8,
      referrer Utf8,
      utm_source Utf8,
      utm_medium Utf8,
      utm_campaign Utf8,
      utm_content Utf8,
      utm_term Utf8,
      yclid Utf8,
      max_status Utf8,
      max_attempts Uint32,
      max_last_attempt_at Timestamp,
      mail_status Utf8,
      mail_attempts Uint32,
      mail_last_attempt_at Timestamp,
      last_error Utf8,
      retry_after Timestamp,
      max_alerted_at Timestamp,
      mail_alerted_at Timestamp,
      PRIMARY KEY (lead_id)
    )
  `;
}

async function insertLead(sql, lead) {
  try {
    await sql`
      INSERT INTO ${sql.identifier(TABLE_NAME)} (
        lead_id, created_at, updated_at, name, phone, page_url, referrer,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term, yclid,
        max_status, max_attempts, max_last_attempt_at, mail_status, mail_attempts,
        mail_last_attempt_at, last_error, retry_after, max_alerted_at, mail_alerted_at
      )
      VALUES (
        ${ydbText(lead.lead_id)}, ${ydbTimestamp(lead.created_at)}, ${ydbTimestamp(lead.updated_at)}, ${ydbText(lead.name)}, ${ydbText(lead.phone)},
        ${ydbText(lead.page_url)}, ${ydbText(lead.referrer)}, ${ydbText(lead.utm_source)}, ${ydbText(lead.utm_medium)},
        ${ydbText(lead.utm_campaign)}, ${ydbText(lead.utm_content)}, ${ydbText(lead.utm_term)}, ${ydbText(lead.yclid)},
        ${ydbText(lead.max_status)}, ${ydbUint32(lead.max_attempts)}, ${ydbTimestamp(lead.max_last_attempt_at)},
        ${ydbText(lead.mail_status)}, ${ydbUint32(lead.mail_attempts)}, ${ydbTimestamp(lead.mail_last_attempt_at)},
        ${ydbText(lead.last_error)}, ${ydbTimestamp(lead.retry_after)}, ${ydbTimestamp(lead.max_alerted_at)}, ${ydbTimestamp(lead.mail_alerted_at)}
      )
    `;
    return { inserted: true };
  } catch (error) {
    if (isDuplicateError(error)) return { inserted: false };
    throw error;
  }
}

async function findLead(sql, leadId) {
  const result = await sql`
    SELECT lead_id, max_status, mail_status
    FROM ${sql.identifier(TABLE_NAME)}
    WHERE lead_id = ${ydbText(leadId)}
    LIMIT 1
  `;
  return firstRow(result);
}

async function listRetryLeads(sql) {
  const now = new Date();
  const result = await sql`
    SELECT *
    FROM ${sql.identifier(TABLE_NAME)}
    WHERE
      (
        (
          (max_status = ${ydbText('pending')} OR max_status = ${ydbText('failed')} OR max_status = ${ydbText('skipped')})
          AND max_attempts < ${ydbUint32(MAX_NOTIFICATION_ATTEMPTS)}
        )
        OR
        (
          (mail_status = ${ydbText('pending')} OR mail_status = ${ydbText('failed')} OR mail_status = ${ydbText('skipped')})
          AND mail_attempts < ${ydbUint32(MAIL_NOTIFICATION_ATTEMPTS)}
        )
      )
      AND (retry_after IS NULL OR retry_after <= ${ydbTimestamp(now)})
    ORDER BY created_at
    LIMIT ${ydbUint32(RETRY_LIMIT)}
  `;
  return rowsFromResult(result);
}

async function updateLeadStatuses(sql, leadId, statuses) {
  await sql`
    UPSERT INTO ${sql.identifier(TABLE_NAME)} (
      lead_id, updated_at, max_status, max_attempts, max_last_attempt_at,
      mail_status, mail_attempts, mail_last_attempt_at, last_error, retry_after,
      max_alerted_at, mail_alerted_at
    )
    VALUES (
      ${ydbText(leadId)}, ${ydbTimestamp(statuses.updated_at)}, ${ydbText(statuses.max_status)}, ${ydbUint32(statuses.max_attempts)},
      ${ydbTimestamp(statuses.max_last_attempt_at)}, ${ydbText(statuses.mail_status)}, ${ydbUint32(statuses.mail_attempts)},
      ${ydbTimestamp(statuses.mail_last_attempt_at)}, ${ydbText(statuses.last_error)}, ${ydbTimestamp(statuses.retry_after)},
      ${ydbTimestamp(statuses.max_alerted_at)}, ${ydbTimestamp(statuses.mail_alerted_at)}
    )
  `;
}

async function attemptMax(lead, simulation) {
  if (simulation.max) {
    return { status: 'failed', attemptsDelta: 1, error: 'simulated max failure' };
  }

  const token = process.env.MAX_BOT_TOKEN;
  const recipients = maxRecipients();

  if (!token || recipients.length === 0) {
    return { status: 'skipped', attemptsDelta: 0, error: 'MAX recipient is not configured' };
  }

  const results = await Promise.all(recipients.map(async (recipient) => {
    try {
      const response = await fetch(`${MAX_API_BASE}/messages?${recipient.kind}=${encodeURIComponent(recipient.id)}`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: buildMaxMessage(lead),
          format: 'markdown',
          notify: true,
        }),
      });

      const data = await response.json().catch(() => ({}));
      return response.ok
        ? { ok: true }
        : { ok: false, error: `MAX HTTP ${response.status}: ${safeError(data.message || data.error || data.description)}` };
    } catch (error) {
      return { ok: false, error: `MAX network: ${safeError(error)}` };
    }
  }));

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    return { status: 'failed', attemptsDelta: 1, error: failed.map((result) => result.error).join('; ') };
  }

  return { status: 'sent', attemptsDelta: 1 };
}

function maxRecipients() {
  const userIds = splitRecipientIds([process.env.MAX_USER_ID, process.env.MAX_USER_IDS].filter(Boolean).join(','));
  const chatIds = splitRecipientIds([process.env.MAX_CHAT_ID, process.env.MAX_CHAT_IDS].filter(Boolean).join(','));
  return [
    ...userIds.map((id) => ({ kind: 'user_id', id })),
    ...chatIds.map((id) => ({ kind: 'chat_id', id })),
  ];
}

function splitRecipientIds(value) {
  return [...new Set(String(value || '').split(',').map((id) => id.trim()).filter(Boolean))];
}

async function attemptMail(lead, simulation, override = {}) {
  if (simulation.mail) {
    return { status: 'failed', attemptsDelta: 1, error: 'simulated mail failure' };
  }

  if (process.env.EMAIL_DELIVERY_MODE === 'google-client') {
    return { status: 'external', attemptsDelta: 0 };
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = override.to || process.env.MAIL_TO || 'Olegt68@mail.ru';
  const from = process.env.MAIL_FROM || user;

  if (!host || !user || !pass || !from || !to) {
    return { status: 'skipped', attemptsDelta: 0, error: 'SMTP is not configured' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to,
      subject: override.subject || `Новая заявка с сайта — ${lead.name}`,
      text: override.text || buildMailText(lead),
      html: override.html || buildMailHtml(lead),
    });

    return { status: 'sent', attemptsDelta: 1 };
  } catch (error) {
    return { status: 'failed', attemptsDelta: 1, error: `mail: ${safeError(error)}` };
  }
}

async function maybeSendFailureAlert(lead, maxResult, mailResult, simulation) {
  const now = Date.now();
  const alerts = {};

  if (maxResult.status === 'failed' && mailResult.status === 'sent' && isAlertDue(lead.max_alerted_at, now)) {
    const alert = await attemptMail(lead, simulation, {
      subject: 'Сбой MAX-уведомлений',
      text: [
        'Сбой MAX-уведомлений',
        '',
        'Заявка сохранена в YDB.',
        'MAX временно не доставил уведомление.',
        '',
        `lead_id: ${lead.lead_id}`,
      ].join('\n'),
    });
    if (alert.status === 'sent') alerts.max_alerted_at = new Date(now);
  }

  if (mailResult.status === 'failed' && maxResult.status === 'sent' && isAlertDue(lead.mail_alerted_at, now)) {
    const alert = await attemptMax(
      {
        ...lead,
        name: 'Сбой email-уведомлений',
        phone: 'Email временно не доставлен',
        page_url: lead.page_url,
        utm_source: 'Заявка сохранена в YDB',
      },
      simulation,
    );
    if (alert.status === 'sent') alerts.mail_alerted_at = new Date(now);
  }

  return alerts;
}

function buildStatusUpdate(lead, now, maxResult, mailResult, alertResult) {
  const maxAttempts = Number(lead.max_attempts || 0) + Number(maxResult.attemptsDelta || 0);
  const mailAttempts = Number(lead.mail_attempts || 0) + Number(mailResult.attemptsDelta || 0);
  const errorParts = [maxResult.error, mailResult.error].filter(Boolean).map(safeError);
  const needsRetry = ['pending', 'failed', 'skipped'].includes(maxResult.status)
    || ['pending', 'failed', 'skipped'].includes(mailResult.status);

  return {
    updated_at: now,
    max_status: maxResult.status,
    max_attempts: maxAttempts,
    max_last_attempt_at: maxResult.attemptsDelta ? now : lead.max_last_attempt_at || null,
    mail_status: mailResult.status,
    mail_attempts: mailAttempts,
    mail_last_attempt_at: mailResult.attemptsDelta ? now : lead.mail_last_attempt_at || null,
    last_error: errorParts.join(' | ').slice(0, 1000),
    retry_after: needsRetry ? nextRetryAt(Math.max(maxAttempts, mailAttempts)) : null,
    max_alerted_at: alertResult.max_alerted_at || lead.max_alerted_at || null,
    mail_alerted_at: alertResult.mail_alerted_at || lead.mail_alerted_at || null,
  };
}

function validateLead(body) {
  const lead_id = sanitize(body.lead_id, 128);
  const name = sanitize(body.name, 200);
  const phone = sanitize(body.phone, 100);

  if (!lead_id) return { ok: false, error: 'lead_id is required' };
  if (!/^[A-Za-z0-9_-]{8,128}$/.test(lead_id)) return { ok: false, error: 'lead_id is invalid' };
  if (!name || name.length < 2) return { ok: false, error: 'name is required' };
  if (!phone || phone.replace(/\D/g, '').length < 7) return { ok: false, error: 'phone is required' };

  return { ok: true, lead_id, name, phone };
}

function parseBody(event) {
  let bodyString = event.body || '{}';
  if (event.isBase64Encoded) bodyString = Buffer.from(bodyString, 'base64').toString('utf8');

  try {
    return { ok: true, body: JSON.parse(bodyString) };
  } catch {
    return { ok: false, error: 'Invalid JSON' };
  }
}

function corsHeaders(origin) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Headers': 'Content-Type, X-Test-Failure-Secret',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  if (!origin) headers['Access-Control-Allow-Origin'] = '*';
  return headers;
}

function getHeader(headers = {}, name) {
  const foundKey = Object.keys(headers || {}).find((key) => key.toLowerCase() === name.toLowerCase());
  return foundKey ? headers[foundKey] : '';
}

function getAllowedSimulation(headers = {}, body = {}) {
  const secret = getHeader(headers, 'x-test-failure-secret');
  if (!TEST_FAILURE_SECRET || secret !== TEST_FAILURE_SECRET) return { max: false, mail: false };
  return {
    max: Boolean(body._simulate?.max_failure),
    mail: Boolean(body._simulate?.mail_failure),
  };
}

function buildMaxMessage(lead) {
  return [
    '🚨 НОВАЯ ЗАЯВКА С САЙТА',
    '',
    `👤 Имя: ${lead.name}`,
    '',
    '📞 Телефон:',
    lead.phone,
    '',
    `🕐 ${formatDate(lead.created_at)}`,
    '',
    '📍 Страница:',
    lead.page_url || '—',
    '',
    '📊 Источник:',
    lead.utm_source || lead.referrer || 'Прямой заход',
    '',
    'Кампания:',
    lead.utm_campaign || '—',
    '',
    'ID:',
    lead.lead_id,
  ].join('\n');
}

function buildMailText(lead) {
  return [
    'Новая заявка с сайта кинезиолог-ноябрьск.рф',
    '',
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Дата: ${formatDate(lead.created_at)}`,
    `Страница: ${lead.page_url || '—'}`,
    '',
    `Источник: ${lead.utm_source || lead.referrer || '—'}`,
    `Кампания: ${lead.utm_campaign || '—'}`,
    '',
    `lead_id: ${lead.lead_id}`,
  ].join('\n');
}

function buildMailHtml(lead) {
  return [
    '<div style="font-family:Arial,sans-serif;max-width:600px;padding:16px;border:1px solid #e2e8f0;border-radius:12px;background:#fff">',
    '<h2 style="color:#591d81;margin-top:0">Новая заявка с сайта</h2>',
    `<p><strong>Имя:</strong> ${escapeHtml(lead.name)}</p>`,
    `<p><strong>Телефон:</strong> <a href="tel:${escapeHtml(lead.phone.replace(/\s+/g, ''))}">${escapeHtml(lead.phone)}</a></p>`,
    `<p><strong>Дата:</strong> ${escapeHtml(formatDate(lead.created_at))}</p>`,
    `<p><strong>Страница:</strong> ${escapeHtml(lead.page_url || '—')}</p>`,
    `<p><strong>Источник:</strong> ${escapeHtml(lead.utm_source || lead.referrer || '—')}</p>`,
    `<p><strong>Кампания:</strong> ${escapeHtml(lead.utm_campaign || '—')}</p>`,
    `<p style="font-size:12px;color:#64748b">lead_id: ${escapeHtml(lead.lead_id)}</p>`,
    '</div>',
  ].join('');
}

function sanitize(value, maxLength = 500) {
  if (value === null || value === undefined) return '';
  return String(value).trim().slice(0, maxLength);
}

function ydbText(value) {
  return new Utf8(String(value || ''));
}

function ydbTimestamp(value) {
  return value ? new Timestamp(new Date(value)) : unsafe('CAST(NULL AS Timestamp?)');
}

function ydbUint32(value) {
  return new Uint32(Math.max(0, Number(value) || 0));
}

function safeError(error) {
  const raw = typeof error === 'string' ? error : error?.message || String(error || '');
  return raw
    .replace(process.env.MAX_BOT_TOKEN || '__no_token__', '[redacted]')
    .replace(process.env.SMTP_PASS || '__no_smtp_pass__', '[redacted]')
    .slice(0, 500);
}

function maskPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length < 4) return '***';
  return `${digits.slice(0, 2)}***${digits.slice(-2)}`;
}

function maskName(name) {
  const str = String(name || '').trim();
  return str ? `${str.slice(0, 1)}***` : '';
}

function isDuplicateError(error) {
  const message = safeError(error).toLowerCase();
  return message.includes('constraint') || message.includes('precondition failed') || message.includes('already exists');
}

function shouldRetryMax(lead) {
  return ['pending', 'failed', 'skipped'].includes(lead.max_status)
    && Number(lead.max_attempts || 0) < MAX_NOTIFICATION_ATTEMPTS;
}

function shouldRetryMail(lead) {
  return ['pending', 'failed', 'skipped'].includes(lead.mail_status)
    && Number(lead.mail_attempts || 0) < MAIL_NOTIFICATION_ATTEMPTS;
}

function nextRetryAt(attempts) {
  const minutes = Math.min(60, Math.max(5, attempts * 5));
  return new Date(Date.now() + minutes * 60 * 1000);
}

function isAlertDue(previousValue, now) {
  if (!previousValue) return true;
  return now - new Date(previousValue).getTime() > ALERT_COOLDOWN_MS;
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Asia/Yekaterinburg',
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(new Date(value));
  } catch {
    return new Date(value).toISOString();
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse(statusCode, headers, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function rowsFromResult(result) {
  if (Array.isArray(result)) return result.flatMap(rowsFromResult);
  if (Array.isArray(result?.rows)) return result.rows.map(normalizeRow);
  if (Array.isArray(result?.resultSets?.[0]?.rows)) return result.resultSets[0].rows.map(normalizeRow);
  if (result && typeof result === 'object') return [normalizeRow(result)];
  return [];
}

function firstRow(result) {
  return rowsFromResult(result)[0] || null;
}

function normalizeRow(row) {
  if (!row || typeof row !== 'object') return row;
  return row;
}
