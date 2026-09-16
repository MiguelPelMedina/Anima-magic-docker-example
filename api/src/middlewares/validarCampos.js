const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores: errores.array().map((e) => ({
        campo: e.path,
        valor: e.value,
        detalle: e.msg,
      })),
    });
  }

  next();
};

module.exports = validarCampos;