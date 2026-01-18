/**
 * Configuração de localidade brasileira
 * Timezone: America/Sao_Paulo (Horário de Brasília - UTC-3)
 * Locale: pt-BR (Português do Brasil)
 */
export const BRAZIL_CONFIG = {
  timezone: 'America/Sao_Paulo',
  locale: 'pt-BR',
  currency: 'BRL'
};

/**
 * Retorna a data/hora atual no timezone do Brasil (America/Sao_Paulo)
 * @returns {Date} Data/hora atual em horário de Brasília
 */
export function getBrazilNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: BRAZIL_CONFIG.timezone }));
}

/**
 * Converte uma data para o timezone do Brasil
 * @param {Date|string} date - Data a ser convertida
 * @returns {Date} Data convertida para horário de Brasília
 */
export function toBrazilTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  return new Date(d.toLocaleString('en-US', { timeZone: BRAZIL_CONFIG.timezone }));
}

/**
 * Formata data no padrão brasileiro (dd/mm/aaaa)
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} Data formatada em pt-BR
 */
export function formatBrazilDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(BRAZIL_CONFIG.locale, { timeZone: BRAZIL_CONFIG.timezone });
}

/**
 * Formata data e hora no padrão brasileiro (dd/mm/aaaa HH:mm:ss)
 * @param {Date|string} date - Data a ser formatada
 * @param {boolean} includeSeconds - Se deve incluir segundos (padrão: true)
 * @returns {string} Data e hora formatadas em pt-BR
 */
export function formatBrazilDateTime(date, includeSeconds = true) {
  const d = date instanceof Date ? date : new Date(date);
  const options = {
    timeZone: BRAZIL_CONFIG.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  };
  return d.toLocaleString(BRAZIL_CONFIG.locale, options);
}

/**
 * Calcula a idade a partir de uma data de nascimento (usando timezone do Brasil)
 * @param {string|Date} birthDate - Data de nascimento no formato YYYY-MM-DD, ISO ou Date
 * @returns {number} Idade em anos
 */
export const calculateAge = (dateInput) => {
  if (!dateInput) return null;
  const nascimento = new Date(dateInput);
  if (Number.isNaN(nascimento.getTime())) return null;

  const hoje = getBrazilNow(); // Usa horário de Brasília
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
};

