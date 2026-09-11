const express = require('express');
const router = express.Router();

const {
  listarHechizos,
  obtenerHechizoPorId,
//   crearHechizo,
//   actualizarHechizo,
//   eliminarHechizo,
} = require('../controllers/hechizos.controller');

// GET /api/hechizos?page=1&limit=10&via=Creacion&nivel=3&tipo=Fuego
router.get('/', listarHechizos);

// GET /api/hechizos/:id
router.get('/:id', obtenerHechizoPorId);

// POST /api/hechizos
// router.post('/', crearHechizo);

// PUT /api/hechizos/:id
// router.put('/:id', actualizarHechizo);

// DELETE /api/hechizos/:id
// router.delete('/:id', eliminarHechizo);

module.exports = router;