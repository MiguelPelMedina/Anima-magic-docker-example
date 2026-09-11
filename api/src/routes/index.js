const express = require('express');
const router = express.Router();

const hechizosRoutes = require('./hechizos.routes');
// const usuariosRoutes = require('./usuarios.routes'); // pendiente

router.use('/hechizos', hechizosRoutes);
// router.use('/usuarios', usuariosRoutes); // pendiente

module.exports = router;