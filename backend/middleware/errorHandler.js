export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);  // Log the full error stack for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
    // Optional: show stack only in dev mode
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
