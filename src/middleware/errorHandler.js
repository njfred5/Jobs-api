export const notFound = (req, res) => {
  res.status(404).json({ error: "Not Found", message: `Route ${req.method} ${req.path} not found` });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 && process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message
  });
};

// lets controllers be async without try/catch everywhere
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
