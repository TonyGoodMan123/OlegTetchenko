async function runE2ETests() {
  const productionDomain = process.env.PRODUCTION_DOMAIN || 'https://xn----btbehkecmhgsgjbd7ar1r2b.xn--p1ai';
  const leadIngestUrl = process.env.LEAD_INGEST_URL || '';
  const expectedFunctionUrl = 'https://functions.yandexcloud.net/d4e4cvesch2fiq2hpsts';
  const retiredFunctionUrl = 'https://functions.yandexcloud.net/d4em7sms8701tente7ba';

  console.log('Production domain:', productionDomain);

  const prodHtml = await fetch(`${productionDomain}/?t=${Date.now()}`).then((r) => r.text());
  const bundleMatch = prodHtml.match(/assets\/index-[^.]+\.js/);
  console.log('Live bundle script:', bundleMatch ? bundleMatch[0] : 'not found');

  if (bundleMatch) {
    const bundleUrl = `${productionDomain}/${bundleMatch[0]}`;
    const bundle = await fetch(bundleUrl).then((r) => r.text());
    const bundleChecks = [
      ['Bundle has current Yandex Function URL', bundle.includes(expectedFunctionUrl)],
      ['Bundle does not use retired Telegram Function URL', !bundle.includes(retiredFunctionUrl)],
      ['Bundle keeps Google Apps Script email URL', bundle.includes('script.google.com')],
      ['Bundle has no MAX secret markers', !bundle.includes('MAX_BOT_TOKEN') && !bundle.includes('platform-api2.max.ru')],
      ['Bundle has no SMTP secret markers', !bundle.includes('SMTP_PASS') && !bundle.includes('smtp.mail.ru')],
    ];
    for (const [label, ok] of bundleChecks) {
      console.log(`${label}: ${ok ? 'PASS' : 'FAIL'}`);
      if (!ok) process.exitCode = 1;
    }
  }

  if (!leadIngestUrl) {
    console.log('LEAD_INGEST_URL is not set; skipping real lead POST.');
    return;
  }

  const now = new Date();
  const leadId = `lead_E2E_${now.toISOString().replace(/\D/g, '').slice(0, 14)}_PROD`;
  const payload = {
    lead_id: leadId,
    name: 'TEST YDB MAX E2E',
    phone: '+7 999 000-04-44',
    page_url: `${productionDomain}/`,
    referrer: 'https://yandex.ru/search/',
    utm_source: 'e2e_verification',
    utm_medium: 'test',
    utm_campaign: 'ydb_max_email_migration',
    utm_content: '',
    utm_term: '',
    yclid: '987654321012345',
    website: '',
  };

  const response = await fetch(leadIngestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: productionDomain,
    },
    body: JSON.stringify(payload),
  }).then((r) => r.json());

  console.log('Lead POST response:', response);
  console.log('HTTP/API saved:', response.ok && response.saved ? 'PASS' : 'FAIL');
  console.log('lead_id:', leadId);
  console.log('Provider checks still required: YDB row, MAX message, real email inbox.');
}

runE2ETests().catch((error) => {
  console.error('Fatal E2E error:', error);
  process.exit(1);
});
