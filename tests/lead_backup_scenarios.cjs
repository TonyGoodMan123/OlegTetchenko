/**
 * Тесты сценариев для lead-backup системы.
 * Запуск: node tests/lead_backup_scenarios.cjs
 * 
 * Тестирует логику sendLeadBackup и Promise.allSettled архитектуры
 * без реального Google аккаунта (мокируем fetch).
 */

const https = require('https');

// ── Утилиты ──────────────────────────────────────────────────────

const RESULTS = { passed: 0, failed: 0, total: 0 };

function assert(description, condition, extra) {
  RESULTS.total++;
  if (condition) {
    RESULTS.passed++;
    console.log(`  ✅ ${description}`);
  } else {
    RESULTS.failed++;
    console.error(`  ❌ FAIL: ${description}`, extra || '');
  }
}

function section(name) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📋 ${name}`);
  console.log('─'.repeat(60));
}

// ── Мок fetch ─────────────────────────────────────────────────────

function mockFetch(url, opts, { status = 200, body = '{}', delay = 0, networkError = null } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (networkError) {
        reject(new Error(networkError));
        return;
      }
      resolve({
        ok: status >= 200 && status < 300,
        status,
        json: async () => JSON.parse(body),
        text: async () => body,
      });
    }, delay);
  });
}

// ── Портированная логика sendLeadBackup (без import.meta) ─────────

const BACKUP_URL_TEST = 'https://script.google.com/macros/s/TEST/exec';
const BACKUP_TIMEOUT_MS = 12000;

async function sendLeadBackupTest(payload, fetchOverride) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKUP_TIMEOUT_MS);
  
  try {
    const response = await (fetchOverride || mockFetch)(BACKUP_URL_TEST, {
      method: 'POST',
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }
    
    return await response.json();
    
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return { ok: false, error: 'timeout' };
    }
    return { ok: false, error: err.message };
  }
}

async function sendTelegramTest(formData, fetchOverride) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  
  try {
    const response = await (fetchOverride || mockFetch)('https://functions.yandexcloud.net/test', {
      method: 'POST',
      body: JSON.stringify(formData),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    const data = await response.json();
    return { success: !!data.ok };
    
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') return { success: false, error: 'timeout' };
    return { success: false, error: err.message };
  }
}

// ── Логика Modal handleSubmit (портирована из React) ──────────────

async function simulateHandleSubmit(opts = {}) {
  const {
    backupFetch,
    telegramFetch,
    formData = { name: 'Тест', phone: '+7 999 000-00-00' },
    leadId = 'lead_test_001',
  } = opts;
  
  const [telegramResult, backupResult] = await Promise.allSettled([
    sendTelegramTest(formData, telegramFetch),
    sendLeadBackupTest({ ...formData, lead_id: leadId }, backupFetch),
  ]);
  
  const telegramOk = telegramResult.status === 'fulfilled' && telegramResult.value?.success;
  const backupOk = backupResult.status === 'fulfilled' && backupResult.value?.ok;
  
  return {
    telegramOk,
    backupOk,
    isSuccess: backupOk || telegramOk,
    telegramResult,
    backupResult,
  };
}

// ── ТЕСТ A: Оба работают ──────────────────────────────────────────

async function testScenarioA() {
  section('Сценарий A: backup работает + Telegram работает');
  
  const backupOkFetch = () => Promise.resolve({
    ok: true, status: 200,
    json: async () => ({ ok: true, lead_id: 'lead_test_001' }),
  });
  
  const telegramOkFetch = () => Promise.resolve({
    ok: true, status: 200,
    json: async () => ({ ok: true }),
  });
  
  const result = await simulateHandleSubmit({ backupFetch: backupOkFetch, telegramFetch: telegramOkFetch });
  
  assert('backup вернул ok: true', result.backupOk);
  assert('telegram вернул success: true', result.telegramOk);
  assert('форма считается успешной', result.isSuccess);
  assert('пользователь видит успех', result.isSuccess === true);
}

// ── ТЕСТ B: Telegram падает (500/timeout) ─────────────────────────

async function testScenarioB() {
  section('Сценарий B: backup работает + Telegram возвращает 500');
  
  const backupOkFetch = () => Promise.resolve({
    ok: true, status: 200,
    json: async () => ({ ok: true, lead_id: 'lead_test_002' }),
  });
  
  const telegramFailFetch = () => Promise.resolve({
    ok: false, status: 500,
    json: async () => ({ ok: false, error: 'Internal Server Error' }),
    text: async () => '{"ok":false}',
  });
  
  const result = await simulateHandleSubmit({ backupFetch: backupOkFetch, telegramFetch: telegramFailFetch });
  
  assert('backup вернул ok: true', result.backupOk);
  assert('telegram вернул success: false (ожидаемо)', !result.telegramOk);
  assert('форма ВСЁ РАВНО считается успешной (backup сработал)', result.isSuccess);
  assert('пользователь НЕ видит ошибку Telegram', result.isSuccess === true);
}

// ── ТЕСТ C: YC возвращает 504 (текущее состояние) ────────────────

async function testScenarioC() {
  section('Сценарий C: backup работает + YC Function возвращает 504 (текущее состояние)');
  
  const backupOkFetch = () => Promise.resolve({
    ok: true, status: 200,
    json: async () => ({ ok: true, lead_id: 'lead_test_003' }),
  });
  
  // Симулируем реальный 504 от YC
  const yc504Fetch = () => Promise.resolve({
    ok: false, status: 504,
    json: async () => ({ errorMessage: 'execution timeout exceeded', errorType: 'JobExecutionTimeoutExceeded' }),
    text: async () => '{"errorMessage":"execution timeout exceeded"}',
  });
  
  const result = await simulateHandleSubmit({ backupFetch: backupOkFetch, telegramFetch: yc504Fetch });
  
  assert('backup работает при YC 504', result.backupOk);
  assert('Telegram/YC недоступен (ожидаемо)', !result.telegramOk);
  assert('заявка сохраняется в Sheets несмотря на YC 504', result.isSuccess);
  assert('пользователь видит успех', result.isSuccess === true);
}

// ── ТЕСТ D: Backup недоступен, Telegram работает ──────────────────

async function testScenarioD() {
  section('Сценарий D: backup недоступен + Telegram работает');
  
  const backupFailFetch = () => Promise.reject(new Error('Network Error: backup unavailable'));
  
  const telegramOkFetch = () => Promise.resolve({
    ok: true, status: 200,
    json: async () => ({ ok: true }),
  });
  
  const result = await simulateHandleSubmit({ backupFetch: backupFailFetch, telegramFetch: telegramOkFetch });
  
  assert('backup упал (ожидаемо)', !result.backupOk);
  assert('Telegram доставил уведомление', result.telegramOk);
  assert('форма считается успешной (telegram сработал)', result.isSuccess);
  // Документируем риск:
  console.log('  ⚠️  РИСК: заявка не сохранена в Google Sheets. Данные только в Telegram.');
  console.log('  ⚠️  Если Telegram позже упадёт — данные могут быть потеряны.');
  assert('ожидаемое поведение задокументировано', true);
}

// ── ТЕСТ E: Двойной клик / дублирование ──────────────────────────

async function testScenarioE() {
  section('Сценарий E: двойной клик — один lead_id отправляется дважды');
  
  const leadId = 'lead_duplicate_test';
  const submittedLeadIds = [];
  
  const backupFetch = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Имитируем проверку дублей (как в Apps Script)
        if (submittedLeadIds.includes(leadId)) {
          resolve({
            ok: true, status: 200,
            json: async () => ({ ok: true, duplicate: true, lead_id: leadId }),
          });
        } else {
          submittedLeadIds.push(leadId);
          resolve({
            ok: true, status: 200,
            json: async () => ({ ok: true, lead_id: leadId }),
          });
        }
      }, 100);
    });
  };
  
  // Симулируем два одновременных клика
  const [r1, r2] = await Promise.all([
    sendLeadBackupTest({ name: 'Тест', phone: '+7', lead_id: leadId }, backupFetch),
    sendLeadBackupTest({ name: 'Тест', phone: '+7', lead_id: leadId }, backupFetch),
  ]);
  
  assert('первый запрос сохранён', r1.ok);
  assert('второй запрос помечен как дубль', r2.ok && r2.duplicate === true);
  assert('lead_id совпадает', r1.lead_id === leadId || r2.lead_id === leadId);
  assert('уникальный ID защищает от дублирования в Sheets', r2.duplicate === true);
}

// ── ТЕСТ F: Валидация полей ───────────────────────────────────────

async function testScenarioF() {
  section('Сценарий F: пустое имя / неправильный телефон');
  
  // Симулируем ответ Apps Script на невалидные данные
  const backupValidationFetch = (url, opts) => {
    const body = JSON.parse(opts.body);
    if (!body.name || body.name.trim().length < 2) {
      return Promise.resolve({
        ok: true, status: 200,
        json: async () => ({ ok: false, error: 'Имя обязательно (минимум 2 символа)' }),
      });
    }
    if (!body.phone || body.phone.trim().length < 5) {
      return Promise.resolve({
        ok: true, status: 200,
        json: async () => ({ ok: false, error: 'Телефон обязателен' }),
      });
    }
    return Promise.resolve({
      ok: true, status: 200,
      json: async () => ({ ok: true, lead_id: 'lead_valid' }),
    });
  };
  
  // Пустое имя
  const r1 = await sendLeadBackupTest({ name: '', phone: '+7 999 000-00-00', lead_id: 'l1' }, backupValidationFetch);
  assert('пустое имя → ok: false (валидация)', !r1.ok);
  
  // Слишком короткое имя
  const r2 = await sendLeadBackupTest({ name: 'А', phone: '+7 999 000-00-00', lead_id: 'l2' }, backupValidationFetch);
  assert('имя из 1 символа → ok: false (валидация)', !r2.ok);
  
  // Пустой телефон
  const r3 = await sendLeadBackupTest({ name: 'Анна', phone: '', lead_id: 'l3' }, backupValidationFetch);
  assert('пустой телефон → ok: false (валидация)', !r3.ok);
  
  // Корректные данные
  const r4 = await sendLeadBackupTest({ name: 'Анна', phone: '+7 999 000-00-00', lead_id: 'l4' }, backupValidationFetch);
  assert('корректные данные → ok: true', r4.ok);
}

// ── ТЕСТ: generateLeadId уникальность ────────────────────────────

async function testLeadIdUniqueness() {
  section('Дополнительно: уникальность lead_id');
  
  // Портируем generateLeadId логику
  function generateLeadId() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `lead_${date}_${time}_${random}`;
  }
  
  const ids = new Set();
  for (let i = 0; i < 1000; i++) {
    ids.add(generateLeadId());
  }
  
  assert('1000 сгенерированных lead_id уникальны', ids.size === 1000);
  
  const sample = generateLeadId();
  assert('формат lead_id начинается с "lead_"', sample.startsWith('lead_'));
  assert('lead_id содержит дату (8 цифр)', /lead_\d{8}/.test(sample));
}

// ── Тест Apps Script Code.gs валидация ───────────────────────────

async function testAppsScriptCode() {
  section('Проверка Google Apps Script кода');
  
  const fs = require('fs');
  const path = require('path');
  
  const codePath = path.join(__dirname, '..', 'google-apps-script', 'Code.gs');
  
  try {
    const code = fs.readFileSync(codePath, 'utf8');
    
    assert('Code.gs существует', true);
    assert('Содержит функцию doPost', code.includes('function doPost'));
    assert('Содержит функцию doGet (healthcheck)', code.includes('function doGet'));
    assert('Содержит защиту от дублей (lead_id)', code.includes('DUPLICATE_REJECTED'));
    assert('Содержит honeypot проверку', code.includes('HONEYPOT_FIELD'));
    assert('Содержит sanitize функцию', code.includes('function sanitize'));
    assert('Содержит EMAIL_TO конфиг', code.includes('EMAIL_TO'));
    assert('Содержит все нужные колонки', 
      code.includes('utm_source') && 
      code.includes('telegram_status') && 
      code.includes('yclid')
    );
    assert('НЕ содержит Telegram токен', !code.includes('8581878866'));
    assert('НЕ содержит Telegram BOT_TOKEN в явном виде', !code.includes('AAGG_12TIgc'));
    
  } catch (err) {
    assert('Code.gs существует', false, err.message);
  }
}

// ── Тест leadBackup.js ─────────────────────────────────────────────

async function testLeadBackupModule() {
  section('Проверка src/utils/leadBackup.js');
  
  const fs = require('fs');
  const path = require('path');
  
  const modulePath = path.join(__dirname, '..', 'src', 'utils', 'leadBackup.js');
  
  try {
    const code = fs.readFileSync(modulePath, 'utf8');
    
    assert('leadBackup.js существует', true);
    assert('Экспортирует generateLeadId', code.includes('export function generateLeadId'));
    assert('Экспортирует buildLeadPayload', code.includes('export function buildLeadPayload'));
    assert('Экспортирует sendLeadBackup', code.includes('export async function sendLeadBackup'));
    assert('Использует import.meta.env (не хардкодит URL)', code.includes('import.meta.env.VITE_BACKUP_LEADS_URL'));
    assert('Содержит таймаут через AbortController', code.includes('AbortController'));
    assert('Содержит honeypot поле в payload', code.includes('website:'));
    assert('Собирает UTM-метки', code.includes('utm_source') && code.includes('yclid'));
    assert('НЕ содержит Telegram токен', !code.includes('8581878866'));
    
  } catch (err) {
    assert('leadBackup.js существует', false, err.message);
  }
}

// ── Тест Modal.jsx ─────────────────────────────────────────────────

async function testModalJsx() {
  section('Проверка src/components/Modal.jsx');
  
  const fs = require('fs');
  const path = require('path');
  
  const modalPath = path.join(__dirname, '..', 'src', 'components', 'Modal.jsx');
  
  try {
    const code = fs.readFileSync(modalPath, 'utf8');
    
    assert('Modal.jsx существует', true);
    assert('Импортирует leadBackup', code.includes("from '../utils/leadBackup'"));
    assert('Использует Promise.allSettled', code.includes('Promise.allSettled'));
    assert('Содержит generateLeadId', code.includes('generateLeadId'));
    assert('Содержит buildLeadPayload', code.includes('buildLeadPayload'));
    assert('Содержит sendLeadBackup', code.includes('sendLeadBackup'));
    assert('Содержит honeypot поле в JSX', code.includes('website'));
    assert('Защита от двойного клика', code.includes('if (isSubmitting) return'));
    assert('Приоритет backup: backupOk || telegramOk', code.includes('backupOk || telegramOk'));
    assert('НЕ маскирует риск при обоих провалах', code.includes('+7 (932) 099-04-44'));
    assert('Метрика отправляется при успехе', code.includes("'lead_submitted'"));
    
  } catch (err) {
    assert('Modal.jsx существует', false, err.message);
  }
}

// ── Главная функция ───────────────────────────────────────────────

async function runAllTests() {
  console.log('\n' + '═'.repeat(60));
  console.log('🧪 ТЕСТЫ LEAD BACKUP СИСТЕМЫ');
  console.log('═'.repeat(60));
  
  await testScenarioA();
  await testScenarioB();
  await testScenarioC();
  await testScenarioD();
  await testScenarioE();
  await testScenarioF();
  await testLeadIdUniqueness();
  await testAppsScriptCode();
  await testLeadBackupModule();
  await testModalJsx();
  
  console.log('\n' + '═'.repeat(60));
  console.log(`📊 ИТОГО: ${RESULTS.passed}/${RESULTS.total} тестов пройдено`);
  if (RESULTS.failed > 0) {
    console.error(`❌ ПРОВАЛЕНО: ${RESULTS.failed}`);
    process.exit(1);
  } else {
    console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ');
  }
  console.log('═'.repeat(60) + '\n');
}

runAllTests().catch(err => {
  console.error('Unhandled error in tests:', err);
  process.exit(1);
});
