export function onlyDigits(value) {
  if (value == null) return '';
  return String(value).replace(/\D/g, '');
}

export function normalizeCPF(value) {
  const digits = onlyDigits(value);
  if (!digits) return null;
  return digits;
}

export function normalizeCNPJ(value) {
  const digits = onlyDigits(value);
  if (!digits) return null;
  return digits;
}

export function isValidCPF(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(cpf[i]) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(cpf[i]) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== Number(cpf[10])) return false;

  return true;
}

export function isValidCNPJ(value) {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const calcDigit = (base, weights) => {
    const sum = base
      .split('')
      .reduce((acc, digit, idx) => acc + Number(digit) * weights[idx], 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const base12 = cnpj.slice(0, 12);
  const d1 = calcDigit(base12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (d1 !== Number(cnpj[12])) return false;

  const base13 = cnpj.slice(0, 13);
  const d2 = calcDigit(base13, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (d2 !== Number(cnpj[13])) return false;

  return true;
}

export function ensureValidCPF(value, fieldName = 'cpf') {
  const digits = normalizeCPF(value);
  if (!digits) return null;
  if (!isValidCPF(digits)) {
    const err = new Error('CPF inválido');
    err.code = 'validation_error';
    err.field = fieldName;
    throw err;
  }
  return digits;
}

export function ensureValidCNPJ(value, fieldName = 'cnpj') {
  const digits = normalizeCNPJ(value);
  if (!digits) return null;
  if (!isValidCNPJ(digits)) {
    const err = new Error('CNPJ inválido');
    err.code = 'validation_error';
    err.field = fieldName;
    throw err;
  }
  return digits;
}
