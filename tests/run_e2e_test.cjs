const https = require('https');

async function runE2ETests() {
  console.log('═'.repeat(60));
  console.log('🚀 RUNNING PRODUCTION E2E TESTS');
  console.log('═'.repeat(60));

  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTNuLHbaPcoiR86ej3vqiXSj93_P7OfrbHLESvio-R8MqCF34eZwPrTqjblT6g9TwwTA/exec';
  const PRODUCTION_DOMAIN = 'https://xn----btbehkecmhgsgjbd7ar1r2b.xn--p1ai';

  // ── 1. Check production HTML and bundle ──
  console.log('\n[1/4] Checking live production domain...');
  const prodHtml = await fetch(PRODUCTION_DOMAIN + '/?t=' + Date.now()).then(r => r.text());
  const bundleMatch = prodHtml.match(/assets\/index-[^.]+\.js/);
  console.log('  Live bundle script:', bundleMatch ? bundleMatch[0] : 'not found');
  const isNewBundle = prodHtml.includes('index-BnY7uZmO.js');
  console.log('  Is new backup bundle active on domain?', isNewBundle);

  // ── 2. Healthcheck GET on Apps Script ──
  console.log('\n[2/4] Verifying Apps Script healthcheck GET...');
  const healthRes = await fetch(APPS_SCRIPT_URL).then(r => r.json());
  console.log('  Healthcheck response:', healthRes);
  const healthOk = healthRes.ok && healthRes.spreadsheet_id === '12LH2dc64FZxdMoFNalnfikAfVOWGiCIPs52C_9FI2Fs';
  console.log('  Healthcheck PASS:', healthOk);

  // ── 3. Submit real E2E lead with simulated 504 telegram failure ──
  console.log('\n[3/4] Submitting real E2E lead (simulating Yandex Cloud 504 failure)...');
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const leadId = `lead_E2E_${dateStr}_${timeStr}_PROD`;

  const payload = {
    lead_id: leadId,
    name: 'TEST BACKUP E2E',
    phone: '+7 999 000-04-44',
    page_url: PRODUCTION_DOMAIN + '/',
    referrer: 'https://yandex.ru/search/',
    utm_source: 'e2e_verification',
    utm_medium: 'cpc',
    utm_campaign: 'audit_august_september',
    utm_content: 'banner_1',
    utm_term: 'кинезиолог ноябрьск',
    yclid: '987654321012345',
    user_agent: 'Antigravity E2E Runner Chrome/120',
    telegram_status: 'failed_504_timeout',
    website: ''
  };

  const e2eRes = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  }).then(r => r.json());

  console.log('  Lead submission response:', e2eRes);
  const leadSaved = e2eRes.ok && e2eRes.lead_id === leadId;
  const emailSent = e2eRes.email_status === 'sent';
  console.log('  Lead saved in Google Sheets:', leadSaved ? 'PASS' : 'FAIL');
  console.log('  Email sent to Olegt68@mail.ru:', emailSent ? 'PASS' : 'FAIL');

  // ── 4. Test duplicate rejection with the exact same lead_id ──
  console.log('\n[4/4] Submitting duplicate lead with exact same lead_id...');
  const dupRes = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  }).then(r => r.json());

  console.log('  Duplicate submission response:', dupRes);
  const dupRejected = dupRes.ok && dupRes.duplicate === true;
  console.log('  Duplicate rejected:', dupRejected ? 'PASS' : 'FAIL');

  console.log('\n' + '═'.repeat(60));
  console.log('🏁 E2E SUMMARY');
  console.log('═'.repeat(60));
  console.log('Healthcheck:       ', healthOk ? 'PASS' : 'FAIL');
  console.log('Google Sheets save:', leadSaved ? 'PASS' : 'FAIL');
  console.log('Email to Oleg:     ', emailSent ? 'PASS' : 'FAIL');
  console.log('Telegram 504 proof:', leadSaved ? 'PASS' : 'FAIL');
  console.log('Duplicate check:   ', dupRejected ? 'PASS' : 'FAIL');
  console.log('Live domain bundle:', isNewBundle ? 'ACTIVE' : 'PROPAGATING');
  console.log('═'.repeat(60));
}

runE2ETests().catch(err => {
  console.error('Fatal E2E error:', err);
  process.exit(1);
});
