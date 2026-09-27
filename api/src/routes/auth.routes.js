const express = require('express');
const router = express.Router();

const { registro, login } = require('../controllers/auth.controller');
const { validarRegistro, validarLogin } = require('../validators/auth.validator');
const validarCampos = require('../middlewares/validarCampos');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registro y autenticación de usuarios
 */

/**
 * @swagger
 * /auth/registro:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Nick, Password]
 *             properties:
 *               Nick:
 *                 type: string
 *                 example: gandalf
 *               Password:
 *                 type: string
 *                 example: contraseñaSegura123
 *     responses:
 *       201:
 *         description: Usuario creado, devuelve el token
 *       409:
 *         description: El nick ya está en uso
 *       400:
 *         description: Error de validación
 */
router.post('/registro', validarRegistro, validarCampos, registro);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión y devuelve un token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Nick, Password]
 *             properties:
 *               Nick:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login correcto, devuelve el token
 *       401:
 *         description: Nick o contraseña incorrectos
 */
router.post('/login', validarLogin, validarCampos, login);

module.exports = router;