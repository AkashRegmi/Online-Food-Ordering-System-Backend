export const responseToClient = (res, statusCode, success, message, data) => {
  return res.status(statusCode).json({
    status: statusCode,
    success,
    message,
    data: data ?? null,
  });
};
