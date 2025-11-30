const notFound = (req, res, next) => {
  const error = new Error(`Not-Found-${req.originalUrl}`);
  res.status(404);
  next(error);
};

// errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
}

export { notFound, errorHandler };
