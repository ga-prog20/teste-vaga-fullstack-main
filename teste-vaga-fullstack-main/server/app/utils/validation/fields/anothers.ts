export function validateDoc(value: string): string | null {
  if (value.length !== 11 && value.length !== 14) return null;
  if (value.length === 11) return validateCPF(value) ? value : null;

  return validateCNPJ(value) ? value : null;
}

function validateCPF(value: string): boolean {
  const values = value.split("").map(Number);

  const firstSum = values
    .slice(0, 9)
    .reduce((acc, data, index) => acc + data * (10 - index), 0);
  const digit1 = (firstSum * 10) % 11;

  if (digit1 !== values[9]) return false;

  const secondSum = values
    .slice(0, 10)
    .reduce((acc, data, index) => acc + data * (11 - index), 0);
  const digit2 = (secondSum * 10) % 11;

  return digit2 === values[10];
}

const regexCNPJ = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/;
function validateCNPJ(value: string | number | number[] = ""): boolean {
  if (!value) return false;

  const isString = typeof value === "string";
  const validTypes =
    isString || Number.isInteger(value) || Array.isArray(value);

  if (!validTypes) return false;
  if (isString) {
    const digitsOnly = /^\d{14}$/.test(value);
    const validFormat = regexCNPJ.test(value);
    const isValid = digitsOnly || validFormat;

    if (!isValid) return false;
  }

  const numbers = matchNumbers(value);
  if (numbers.length !== 14) return false;

  const items = [...new Set(numbers)];
  if (items.length === 1) return false;

  const digits = numbers.slice(12);
  const digit0 = validCalc(12, numbers);
  if (digit0 !== digits[0]) return false;

  const digit1 = validCalc(13, numbers);
  return digit1 === digits[1];
}

function validCalc(x: number, numbers: number[]) {
  const slice = numbers.slice(0, x);
  let factor = x - 7;
  let sum = 0;

  for (let i = x; i >= 1; i--) {
    const n = slice[x - i];
    sum += n * factor--;
    if (factor < 2) factor = 9;
  }

  const result = 11 - (sum % 11);
  return result > 9 ? 0 : result;
}

function matchNumbers(value: string | number | number[] = "") {
  const match = value.toString().match(/\d/g);
  return Array.isArray(match) ? match.map(Number) : [];
}
