const errorHandler = (err, req, res, next) => {
  const esProduccion = process.env.NODE_ENV === 'production';

  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

  // Body JSON mal formado (lo lanza express.json() antes de llegar al controlador)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }

  // Errores de Mongoose que no se capturaron en el controlador
  if (err.name === 'ValidationError') {
    return res.status(400).json({ mensaje: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ mensaje: 'Identificador no válido' });
  }

  const status = err.status || 500;

  res.status(status).json({
    mensaje: err.message || 'Error interno del servidor',
    // El stack solo se expone fuera de producción: en producción daría
    // información sobre la estructura interna del servidor a un atacante
    ...(esProduccion ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;