const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function run() {
  const phone = await import(pathToFileURL(path.join(__dirname, '..', 'src', 'utils', 'phone.js')).href);

  const cases = [
    ['', '+7 '],
    ['999', '+7 (999)'],
    ['+7 (999) 123-45-67', '+7 (999) 123-45-67'],
    ['8 999 123 45 67', '+7 (999) 123-45-67'],
    ['+7999123456789000', '+7 (999) 123-45-67'],
    ['abc9991234567', '+7 (999) 123-45-67'],
  ];

  for (const [input, expected] of cases) {
    assert.equal(phone.formatRussianPhone(input), expected, input);
  }

  assert.equal(phone.normalizeRussianPhone('+7 (999) 123-45-67'), '+79991234567');
  assert.equal(phone.normalizeRussianPhone('+7 (999) 123-45'), '');
  console.log('Phone mask scenarios: PASS');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
