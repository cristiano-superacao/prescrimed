const verbMap = {
  create: { m: 'criado', f: 'criada' },
  update: { m: 'atualizado', f: 'atualizada' },
  delete: { m: 'excluído', f: 'excluída' },
};

const errorVerbMap = {
  create: 'criar',
  update: 'atualizar',
  delete: 'excluir',
  load: 'carregar',
  save: 'salvar',
  cancel: 'cancelar',
  login: 'fazer login',
  register: 'realizar cadastro',
};

const customErrorMap = {
  accessDenied: 'Acesso negado',
  passwordMismatch: 'As senhas não coincidem',
  minPassword: 'Senha deve ter no mínimo 6 caracteres',
  cannotDeleteSelf: 'Você não pode excluir seu próprio usuário',
};

export const successMessage = (action, entity, { gender = 'm', suffix = '' } = {}) => {
  const verb = verbMap[action]?.[gender] || verbMap[action]?.m || '';
  return `${entity} ${verb} com sucesso${suffix}`;
};

export const errorMessage = (action, entity) => {
  const verb = errorVerbMap[action] || action;
  return `Erro ao ${verb} ${entity}`;
};

export const customErrorMessage = (key) => customErrorMap[key] || key;

export const apiErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;
