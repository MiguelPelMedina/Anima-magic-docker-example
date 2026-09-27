const express = require('express');
const router = express.Router();

const hechizosRoutes = require('./hechizos.routes');
const usuariosRoutes = require('./usuarios.routes');
const authRoutes = require('./auth.routes');


router.use('/hechizos', hechizosRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/auth', authRoutes);

module.exports = router;