export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message = status === 500 ? 'Internal server error' : error.message;

  if (req.accepts('html') && !req.originalUrl.startsWith('/api')) {
    return res.status(status).render('error', { title: 'Error', status, message });
  }

  return res.status(status).json({ message, details: error.errors || undefined });
}
