const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: "Something went wrong",
    error: err.message,
  });
};

module.exports = errorMiddleware;
