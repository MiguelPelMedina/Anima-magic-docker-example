const { body, param, query } = require('express-validator');

const validarIdHechizo = [
  param('id')
    .isMongoId()
    .withMessage('El ID debe ser un ObjectId válido de MongoDB'),
];

const validarQueryListado = [
  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser un entero mayor que 0'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit debe estar entre 1 y 100'),
  query('nivel').optional().isInt({ min: 0 }).withMessage('nivel debe ser un entero no negativo'),
  query('via').optional().isString().trim().notEmpty(),
  query('tipo').optional().isString().trim().notEmpty(),
];

const validarHechizo = [
  body('Nombre').isString().trim().notEmpty().withMessage('Nombre es obligatorio'),
  body('Via').isString().trim().notEmpty().withMessage('Via es obligatoria'),
  body('Nivel').isInt().withMessage('Nivel debe ser un número entero'),
  body('Accion').isString().trim().notEmpty().withMessage('Accion es obligatoria'),
  body('Efecto').isString().notEmpty().withMessage('Efecto es obligatorio'),
  body('mantenimiento').isString().trim().notEmpty().withMessage('mantenimiento es obligatorio'),

  body('Tipo').isArray({ min: 1 }).withMessage('Tipo debe ser un array con al menos un elemento'),
  body('Tipo.*').isString().trim().notEmpty().withMessage('Cada tipo debe ser un texto no vacío'),

  body('Grado').isArray({ min: 1 }).withMessage('Grado debe ser un array con al menos un elemento'),
  body('Grado.*.Name').isString().trim().notEmpty().withMessage('Cada grado necesita un Name'),
  body('Grado.*.Coste').isInt().withMessage('Coste debe ser un entero'),
  body('Grado.*.CosteMantenimiento').isInt().withMessage('CosteMantenimiento debe ser un entero'),
  body('Grado.*.IntR').isInt().withMessage('IntR debe ser un entero'),
  body('Grado.*.Efecto').isString().notEmpty().withMessage('Cada grado necesita un Efecto'),
];

module.exports = {
  validarIdHechizo,
  validarQueryListado,
  validarHechizo,
};