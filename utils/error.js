export const sendError = (res, status, message, error, options = {}) => {
  const {
    messageKey = 'error',
    errorKey,
    includeDetails = false,
    log = true,
    extraPayload = {},
  } = options;

  if (log) {
    console.error(message, error);
  }

  const payload = { [messageKey]: message, ...extraPayload };

  if (includeDetails && error?.message) {
    payload.details = error.message;
  }

  if (errorKey) {
    payload[errorKey] = error?.message;
  }

  return res.status(status).json(payload);
};
