const https = require('https');

https.get('https://xn----btbehkecmhgsgjbd7ar1r2b.xn--p1ai/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const scripts = [...data.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
    console.log('Scripts:', scripts);
    const title = data.match(/<title>(.*?)<\/title>/);
    console.log('Title:', title ? title[1] : 'none');
    // Check which JS bundle is loaded
    const jsBundle = scripts.find(s => s.includes('.js'));
    console.log('Main JS bundle:', jsBundle);
    if (jsBundle) {
      // Fetch the bundle to inspect what endpoint it has
      const bundleUrl = jsBundle.startsWith('http') ? jsBundle : 'https://xn----btbehkecmhgsgjbd7ar1r2b.xn--p1ai' + jsBundle;
      https.get(bundleUrl, (bRes) => {
        let bData = '';
        bRes.on('data', c => bData += c);
        bRes.on('end', () => {
          console.log('Bundle size:', bData.length);
          console.log('Has yandex cloud function URL:', bData.includes('functions.yandexcloud.net'));
          console.log('Has backup URL:', bData.includes('script.google.com'));
          console.log('Has leadBackup / lead_id:', bData.includes('lead_'));
        });
      });
    }
  });
}).on('error', err => console.error(err));
