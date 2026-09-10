const COUNTRY_CODE = '7';
const NATIONAL_NUMBER_LENGTH = 10;

function nationalDigits(value) {
  const digits = String(value || '').replace(/\D/g, '');
  const withoutCountryCode = digits.startsWith('7') || digits.startsWith('8')
    ? digits.slice(1)
    : digits;

  return withoutCountryCode.slice(0, NATIONAL_NUMBER_LENGTH);
}

export function formatRussianPhone(value) {
  const digits = nationalDigits(value);
  if (!digits) return '+7 ';

  let formatted = `+7 (${digits.slice(0, 3)}`;
  if (digits.length >= 3) formatted += ')';
  if (digits.length > 3) formatted += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) formatted += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) formatted += `-${digits.slice(8, 10)}`;

  return formatted;
}

export function normalizeRussianPhone(value) {
  const digits = nationalDigits(value);
  return digits.length === NATIONAL_NUMBER_LENGTH ? `+${COUNTRY_CODE}${digits}` : '';
}
