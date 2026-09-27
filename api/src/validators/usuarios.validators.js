const { body, param } = require('express-validator');

const validarIdUsuario = [
  param('id')
    .isMongoId()
    .withMessage('El ID debe ser un ObjectId válido de MongoDB'),
];

const validarIdLibroHechizo = [
  param('spellbookId')
    .isMongoId()
    .withMessage('El ID del libro de hechizos debe ser un ObjectId válido de MongoDB'),
];

const validarLibroHechizo = [
  body('Nombre')
    .isString()
    .withMessage('El nombre del libro de hechizos debe ser una cadena de texto')
    .trim()
    .notEmpty()
    .withMessage('El nombre del libro de hechizos no puede estar vacío'),
];

const validarIdHechizo = [
  param('hechizoId')
    .isMongoId()
    .withMessage('El ID del hechizo debe ser un ObjectId válido de MongoDB'),
];

const validarIdHechizoBody = [
  body('hechizoId')
    .isMongoId()
    .withMessage('El ID del hechizo debe ser un ObjectId válido de MongoDB'),
];

module.exports = {
  validarIdUsuario,
  validarIdLibroHechizo,
  validarLibroHechizo,
  validarIdHechizo,
  validarIdHechizoBody
}