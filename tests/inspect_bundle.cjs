const fs = require('fs');

const code = fs.readFileSync('dist/assets/index-BnY7uZmO.js', 'utf8');

// Find where kh is defined
const khMatch = code.match(/kh\s*=\s*([^;,]+)/);
console.log('kh match:', khMatch ? khMatch[0] : 'not found');

// Search for AKfycb anywhere
const hasUrl = code.includes('AKfycbxTNuLHbaPcoiR86ej3vqiXSj93_P7OfrbHLESvio-R8MqCF34eZwPrTqjblT6g9TwwTA');
console.log('Includes full Apps Script ID:', hasUrl);

// Search for script.google.com
const hasGoogle = code.includes('script.google.com');
console.log('Includes script.google.com:', hasGoogle);

// Check if kh is empty string
console.log('Is kh empty?', code.includes('kh=""'));
