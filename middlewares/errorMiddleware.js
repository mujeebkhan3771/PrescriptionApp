// middlewares/errorMiddleware.js
import errorHandler from "../utils/ErrorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof errorHandler) {
    statusCode = err.statusCode;
    message = err.message;
  }
  console.error(err.stack);
  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
