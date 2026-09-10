const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'dist', 'assets');
const bundleName = fs.readdirSync(assetsDir).find((name) => /^index-.*\.js$/.test(name));

if (!bundleName) {
  console.error('Main JS bundle not found');
  process.exit(1);
}

const code = fs.readFileSync(path.join(assetsDir, bundleName), 'utf8');

const checks = [
  ['Includes Yandex Cloud Function URL', code.includes('functions.yandexcloud.net')],
  ['Includes existing Google Apps Script email URL', code.includes('script.google.com')],
  ['Does not include MAX platform API', !code.includes('platform-api2.max.ru')],
  ['Does not include SMTP config names', !code.includes('SMTP_PASS') && !code.includes('SMTP_HOST')],
  ['Does not include MAX token env name', !code.includes('MAX_BOT_TOKEN')],
  ['Includes lead_id generation marker', code.includes('lead_')],
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${label}: ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) failed++;
}

if (failed > 0) process.exit(1);
