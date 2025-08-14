export const errorHandler = (statusCode, message) => {
  const customError = new Error();
  customError.statusCode = statusCode;
  customError.message = message;
  return customError;
};
