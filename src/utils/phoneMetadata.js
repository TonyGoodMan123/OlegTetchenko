import metadata from 'libphonenumber-js/metadata.min.json';

// Callback numbers exclude the special 14-digit RU/KZ numbering ranges.
// Metadata tuple index 3 contains possible national number lengths.
const countries = { ...metadata.countries };
for (const country of ['RU', 'KZ']) {
  countries[country] = [...countries[country]];
  countries[country][3] = [10];
}

export default { ...metadata, countries };
