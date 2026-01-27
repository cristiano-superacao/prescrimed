export function errorHandler(err, req, res, next) {
  try {
    const status = typeof err.status === 'number' ? err.status : (err.name === 'SequelizeValidationError' ? 400 : (err.name === 'SequelizeUniqueConstraintError' ? 409 : (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') ? 401 : 500));

    // Mensagens amigáveis
    let message = 'Ocorreu um erro inesperado. Tente novamente em instantes.';
    let code = 'unexpected_error';
    let details = undefined;

    if (err.name === 'SequelizeValidationError') {
      message = 'Dados inválidos. Verifique os campos destacados e tente novamente.';
      code = 'validation_error';
      details = (err.errors || []).map(e => ({ field: e.path, message: e.message }));
    } else if (err.name === 'SequelizeUniqueConstraintError') {
      message = 'Registro já existe com os dados informados. Altere os valores e tente novamente.';
      code = 'unique_constraint';
      details = (err.errors || []).map(e => ({ field: e.path, message: e.message }));
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      message = 'Sessão expirada ou inválida. Faça login novamente.';
      code = 'auth_token_error';
    } else if (status === 403) {
      message = 'Acesso negado. Você não tem permissão para realizar esta ação.';
      code = 'access_denied';
    } else if (status === 404) {
      message = 'Recurso não encontrado.';
      code = 'not_found';
    } else if (status === 503) {
      message = 'Serviço temporariamente indisponível. Tente novamente em instantes.';
      code = 'service_unavailable';
    }

    // Permite que rotas definam mensagem
    if (err.userMessage && typeof err.userMessage === 'string') {
      message = err.userMessage;
    }

    // Log completo no servidor para suporte
    console.error('ErrorHandler:', { status, code, message, error: err?.message });

    res.status(status).json({ error: message, code, details });
  } catch (fatal) {
    console.error('Fatal error in errorHandler:', fatal);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}
