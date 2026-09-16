const notFound = (req, res, next) => {
  res.status(404).json({
    mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;