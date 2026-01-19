const https = require('https');

module.exports.handler = async function (event) {
  const origin = event.headers?.origin || event.headers?.Origin;

  const allowedOrigins = new Set([
    'https://xn----btbehkecmhgsgjbd7ar1r2b.xn--p1ai',
    'https://www.xn----btbehkecmhgsgjbd7ar1r2b.xn--p1ai',
  ]);

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // CORS
  if (origin && allowedOrigins.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else if (!origin) {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  let bodyString = event.body || '{}';
  if (event.isBase64Encoded) {
    bodyString = Buffer.from(bodyString, 'base64').toString('utf8');
  }

  let body;
  try {
    body = JSON.parse(bodyString);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Invalid JSON' }) };
  }

  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();

  if (!name || !phone) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Name and phone are required' }) };
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: 'Server configuration error' }) };
  }

  const message = `🔔 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📱 Телефон: ${phone}`;

  const telegramData = JSON.stringify({
    chat_id: CHAT_ID,
    text: message,
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(telegramData),
    },
  };

  return await new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let resData = '';
      res.on('data', (chunk) => (resData += chunk));
      res.on('end', () => {
        let tgResponse;
        try {
          tgResponse = JSON.parse(resData);
        } catch {
          resolve({ statusCode: 502, headers, body: JSON.stringify({ ok: false, error: 'Bad Telegram response' }) });
          return;
        }

        if (tgResponse.ok) {
          resolve({ statusCode: 200, headers, body: JSON.stringify({ ok: true }) });
        } else {
          resolve({
            statusCode: 502,
            headers,
            body: JSON.stringify({ ok: false, error: 'Telegram error', details: tgResponse.description }),
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ statusCode: 502, headers, body: JSON.stringify({ ok: false, error: 'Network error', message: error.message }) });
    });

    req.write(telegramData);
    req.end();
  });
};
