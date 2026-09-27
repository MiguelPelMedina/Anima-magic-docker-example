const { body } = require('express-validator');

const validarRegistro = [
  body('Nick')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('El nick es obligatorio')
    .isLength({ min: 3, max: 20 })
    .withMessage('El nick debe tener entre 3 y 20 caracteres'),

  body('Password')
    .isString()
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .isStrongPassword({ minLowercase: 1, minUppercase: 1, minSymbols: 1 })
    .withMessage('La contraseña debe tener al menos un símbolo, una letra minuscula y una mayuscula'),
];

const validarLogin = [
  body('Nick').isString().trim().notEmpty().withMessage('El nick es obligatorio'),
  body('Password').isString().notEmpty().withMessage('La contraseña es obligatoria'),
];

module.exports = {
  validarRegistro,
  validarLogin,
};