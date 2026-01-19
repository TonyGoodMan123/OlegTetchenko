const https = require('https');

const data = JSON.stringify({
  name: "Тест",
  phone: "+7 999 000-00-00"
});

const options = {
  hostname: 'functions.yandexcloud.net',
  port: 443,
  path: '/d4em7sms8701tente7ba',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
