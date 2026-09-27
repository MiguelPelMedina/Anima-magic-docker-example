const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');
const verificarPropietario = require('../middlewares/verificarPropietario');
/*
   Validadores
*/
const validarCampos = require('../middlewares/validarCampos');
const {
    validarIdUsuario,
    validarIdLibroHechizo,
    validarLibroHechizo,
    validarIdHechizo,
    validarIdHechizoBody
} = require('../validators/usuarios.validators');
const {
    obtenerUsuarioPorId,
    eliminarUsuario,
    crearLibroHechizo,
    listarLibrosHechizos,
    actualizarLibroHechizo,
    eliminarLibroHechizo,
    agregarHechizoALibro,
    eliminarHechizoDeLibro,
} = require('../controllers/usuarios.controller');

router.use(verificarToken);

// GET    /api/usuarios/:id                           (JWT + propietario)
router.get('/:id', validarIdUsuario, validarCampos, verificarPropietario, obtenerUsuarioPorId);
// DELETE /api/usuarios/:id                            (JWT + propietario)
router.delete('/:id', validarIdUsuario, validarCampos, verificarPropietario, eliminarUsuario);

// POST   /api/usuarios/:id/spellbooks                 (JWT + propietario)
router.post('/:id/spellbooks', validarIdUsuario, validarLibroHechizo, validarCampos, verificarPropietario, crearLibroHechizo);
// GET    /api/usuarios/:id/spellbooks                 (JWT + propietario)
router.get('/:id/spellbooks', validarIdUsuario, validarCampos, verificarPropietario, listarLibrosHechizos);
// PUT    /api/usuarios/:id/spellbooks/:spellbookId    (JWT + propietario)
router.put('/:id/spellbooks/:spellbookId', validarIdUsuario, validarIdLibroHechizo, validarLibroHechizo, validarCampos, verificarPropietario, actualizarLibroHechizo);
// DELETE /api/usuarios/:id/spellbooks/:spellbookId    (JWT + propietario)
router.delete('/:id/spellbooks/:spellbookId', validarIdUsuario, validarIdLibroHechizo, validarCampos, verificarPropietario, eliminarLibroHechizo);

// POST   /api/usuarios/:id/spellbooks/:spellbookId/hechizos          (JWT + propietario)
router.post('/:id/spellbooks/:spellbookId/hechizos', validarIdUsuario, validarIdLibroHechizo, validarIdHechizoBody, validarCampos, verificarPropietario, agregarHechizoALibro);
// DELETE /api/usuarios/:id/spellbooks/:spellbookId/hechizos/:hechizoId (JWT + propietario)
router.delete('/:id/spellbooks/:spellbookId/hechizos/:hechizoId', validarIdUsuario, validarIdLibroHechizo, validarIdHechizo, validarCampos, verificarPropietario, eliminarHechizoDeLibro);

module.exports = router;