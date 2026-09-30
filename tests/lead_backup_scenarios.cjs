/**
 * Lead ingest architecture tests.
 *
 * These tests simulate the required production contract without touching
 * Yandex Cloud, YDB, MAX, Mail.ru, Google, or Telegram.
 */

const fs = require('fs');
const path = require('path');

const RESULTS = { passed: 0, failed: 0, total: 0 };

function assert(description, condition, extra) {
  RESULTS.total++;
  if (condition) {
    RESULTS.passed++;
    console.log(`  PASS: ${description}`);
  } else {
    RESULTS.failed++;
    console.error(`  FAIL: ${description}`, extra || '');
  }
}

function section(name) {
  console.log(`\n${name}`);
  console.log('-'.repeat(name.length));
}

function createBackend({ maxFails = false, mailFails = false } = {}) {
  const db = new Map();
  const deliveries = [];

  async function submit(body) {
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const leadId = String(body.lead_id || '').trim();

    if (!leadId || !name || !phone) return { ok: false, saved: false, statusCode: 400 };
    if (String(body.website || '').trim()) return { ok: true, saved: false, spam_filtered: true, statusCode: 200 };

    if (db.has(leadId)) {
      const existing = db.get(leadId);
      return {
        ok: true,
        saved: true,
        duplicate: true,
        lead_id: leadId,
        max_status: existing.max_status,
        mail_status: existing.mail_status,
        statusCode: 200,
      };
    }

    const row = {
      lead_id: leadId,
      name,
      phone,
      max_status: 'pending',
      max_attempts: 0,
      mail_status: 'pending',
      mail_attempts: 0,
      retry_after: null,
    };
    db.set(leadId, row);

    const maxStatus = maxFails ? 'failed' : 'sent';
    row.max_status = maxStatus;
    row.max_attempts += 1;
    deliveries.push(['max', leadId, maxStatus]);

    const mailStatus = mailFails ? 'failed' : 'sent';
    row.mail_status = mailStatus;
    row.mail_attempts += 1;
    deliveries.push(['mail', leadId, mailStatus]);

    if (maxStatus !== 'sent' || mailStatus !== 'sent') {
      row.retry_after = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    }

    return {
      ok: true,
      saved: true,
      lead_id: leadId,
      max_status: row.max_status,
      mail_status: row.mail_status,
      statusCode: 200,
    };
  }

  async function retry({ maxRecovered = true, mailRecovered = true } = {}) {
    for (const row of db.values()) {
      if (row.max_status !== 'sent' && row.max_attempts < 10 && maxRecovered) {
        row.max_status = 'sent';
        row.max_attempts += 1;
        deliveries.push(['max', row.lead_id, 'sent']);
      }
      if (row.mail_status !== 'sent' && row.mail_attempts < 10 && mailRecovered) {
        row.mail_status = 'sent';
        row.mail_attempts += 1;
        deliveries.push(['mail', row.lead_id, 'sent']);
      }
      if (row.max_status === 'sent' && row.mail_status === 'sent') row.retry_after = null;
    }
  }

  return { db, deliveries, submit, retry };
}

async function testYdbSave() {
  section('TEST A: POST lead -> YDB row exists');
  const backend = createBackend();
  const res = await backend.submit({ lead_id: 'lead_test_a', name: 'Анна', phone: '+7 999 000-00-00' });

  assert('API returns saved=true', res.ok && res.saved);
  assert('YDB source row exists before delivery result matters', backend.db.has('lead_test_a'));
}

async function testDuplicateProtection() {
  section('TEST B: same lead_id twice -> one row');
  const backend = createBackend();
  await backend.submit({ lead_id: 'lead_test_b', name: 'Анна', phone: '+7 999 000-00-00' });
  const second = await backend.submit({ lead_id: 'lead_test_b', name: 'Анна', phone: '+7 999 000-00-00' });

  assert('Only one row stored', backend.db.size === 1);
  assert('Second response is duplicate success', second.ok && second.saved && second.duplicate);
  assert('Duplicate does not resend notifications', backend.deliveries.length === 2);
}

async function testMaxSuccess() {
  section('TEST C: YDB save -> MAX success');
  const backend = createBackend();
  const res = await backend.submit({ lead_id: 'lead_test_c', name: 'Анна', phone: '+7 999 000-00-00' });

  assert('max_status=sent', res.max_status === 'sent');
  assert('YDB still has row', backend.db.has('lead_test_c'));
}

async function testMailSuccess() {
  section('TEST D: YDB save -> email success');
  const backend = createBackend();
  const res = await backend.submit({ lead_id: 'lead_test_d', name: 'Анна', phone: '+7 999 000-00-00' });

  assert('mail_status=sent', res.mail_status === 'sent');
  assert('YDB still has row', backend.db.has('lead_test_d'));
}

async function testMaxFailurePreservesLead() {
  section('TEST E: MAX failure -> YDB PASS + email PASS + saved=true');
  const backend = createBackend({ maxFails: true });
  const res = await backend.submit({ lead_id: 'lead_test_e', name: 'Анна', phone: '+7 999 000-00-00' });

  assert('API returns saved=true', res.ok && res.saved);
  assert('max_status=failed', res.max_status === 'failed');
  assert('mail_status=sent', res.mail_status === 'sent');
  assert('YDB row is preserved', backend.db.has('lead_test_e'));
}

async function testMailFailurePreservesLead() {
  section('TEST F: email failure -> YDB PASS + MAX PASS + saved=true');
  const backend = createBackend({ mailFails: true });
  const res = await backend.submit({ lead_id: 'lead_test_f', name: 'Анна', phone: '+7 999 000-00-00' });

  assert('API returns saved=true', res.ok && res.saved);
  assert('max_status=sent', res.max_status === 'sent');
  assert('mail_status=failed', res.mail_status === 'failed');
  assert('YDB row is preserved', backend.db.has('lead_test_f'));
}

async function testAllNotificationsFailPreservesLead() {
  section('TEST G: MAX + email fail -> YDB PASS + saved=true');
  const backend = createBackend({ maxFails: true, mailFails: true });
  const res = await backend.submit({ lead_id: 'lead_test_g', name: 'Анна', phone: '+7 999 000-00-00' });

  assert('API returns saved=true', res.ok && res.saved);
  assert('Both channels failed', res.max_status === 'failed' && res.mail_status === 'failed');
  assert('YDB row is preserved', backend.db.has('lead_test_g'));
}

async function testRetryRecovery() {
  section('TEST H: retry after recovery -> eventually sent');
  const backend = createBackend({ maxFails: true, mailFails: true });
  await backend.submit({ lead_id: 'lead_test_h', name: 'Анна', phone: '+7 999 000-00-00' });
  await backend.retry({ maxRecovered: true, mailRecovered: true });

  const row = backend.db.get('lead_test_h');
  assert('max_status becomes sent', row.max_status === 'sent');
  assert('mail_status becomes sent', row.mail_status === 'sent');
  assert('retry_after cleared', row.retry_after === null);
}

function testFrontendContract() {
  section('Frontend contract');
  const modal = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'Modal.jsx'), 'utf8');
  const leadClient = fs.readFileSync(path.join(__dirname, '..', 'src', 'utils', 'leadBackup.js'), 'utf8');

  assert('Modal submits through persistence confirmation', modal.includes('submitLeadWithConfirmation(payload)'));
  assert('Modal no longer imports Telegram sender', !modal.includes('sendTelegramMessage'));
  assert('Modal success requires saved=true', modal.includes('if (result.saved)'));
  assert('Metrika payload does not include name', !modal.includes('name: formData.name'));
  assert('Metrika payload does not include phone', !modal.includes('phone: formData.phone'));
  assert('Client keeps Google Apps Script email configuration', leadClient.includes('VITE_BACKUP_LEADS_URL'));
  assert('Client keeps Google Apps Script delivery', leadClient.includes('sendLeadBackup(payload)'));
  assert('Client confirms ambiguous saves by lead_id', leadClient.includes('checkLeadBackup(payload.lead_id)'));
  assert('Client retries with the same payload', (leadClient.match(/sendLeadBackup\(payload\)/g) || []).length >= 2);
  assert('Modal does not show native submit failure alert', !modal.includes("alert('Не удалось отправить заявку"));
  assert('Client keeps UTM and yclid', leadClient.includes('utm_source') && leadClient.includes('yclid'));
  assert('Client keeps honeypot', leadClient.includes('website: formData.website'));
}

function testBackendContract() {
  section('Yandex Function contract');
  const fn = fs.readFileSync(path.join(__dirname, '..', 'yandex-cloud', 'index.js'), 'utf8');

  assert('Function uses YDB connection string', fn.includes('YDB_CONNECTION_STRING'));
  assert('Function creates leads table', fn.includes('CREATE TABLE IF NOT EXISTS'));
  assert('Function inserts lead before attemptMax', fn.indexOf('insertLead(sql, lead)') < fn.indexOf('attemptMax(lead'));
  assert('Function uses MAX env token only server-side', fn.includes('process.env.MAX_BOT_TOKEN'));
  assert('Function uses platform-api2.max.ru', fn.includes('https://platform-api2.max.ru'));
  assert('Function sends email through SMTP env', fn.includes('SMTP_HOST') && fn.includes('SMTP_PASS'));
  assert('Function supports retry handler', fn.includes('retryFailedNotifications'));
  assert('Function does not call Telegram API', !fn.includes('api.telegram.org'));
  assert('Function does not call Google Apps Script', !fn.includes('script.google.com'));
  assert('Function redacts token in safeError', fn.includes("replace(process.env.MAX_BOT_TOKEN"));
}

async function runAllTests() {
  await testYdbSave();
  await testDuplicateProtection();
  await testMaxSuccess();
  await testMailSuccess();
  await testMaxFailurePreservesLead();
  await testMailFailurePreservesLead();
  await testAllNotificationsFailPreservesLead();
  await testRetryRecovery();
  testFrontendContract();
  testBackendContract();

  console.log(`\nTOTAL: ${RESULTS.passed}/${RESULTS.total} checks passed`);
  if (RESULTS.failed > 0) process.exit(1);
}

runAllTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
