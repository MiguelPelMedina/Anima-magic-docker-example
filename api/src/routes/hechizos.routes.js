const express = require('express');
const router = express.Router();

const {
  listarHechizos,
  obtenerHechizoPorId,
//   crearHechizo,
//   actualizarHechizo,
//   eliminarHechizo,
} = require('../controllers/hechizos.controller');

/**
 * @swagger
 * tags:
 *   name: Hechizos
 *   description: Gestión de hechizos
 */


/**
 * @swagger
 * /hechizos:
 *   get:
 *     summary: Lista los hechizos con paginación y filtros opcionales
 *     tags: [Hechizos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Resultados por página
 *       - in: query
 *         name: via
 *         schema:
 *           type: string
 *         description: Filtra por la Vía del hechizo
 *       - in: query
 *         name: nivel
 *         schema:
 *           type: integer
 *         description: Filtra por nivel exacto
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *         description: Filtra hechizos que contengan este tipo
 *     responses:
 *       200:
 *         description: Lista paginada de hechizos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPaginas:
 *                   type: integer
 *                 resultados:
 *                   type: integer
 *                 hechizos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hechizo'
 */
router.get('/', listarHechizos);

/**
 * @swagger
 * /hechizos/{id}:
 *   get:
 *     summary: Obtiene un hechizo por su ID
 *     tags: [Hechizos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId del hechizo
 *     responses:
 *       200:
 *         description: Hechizo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hechizo'
 *       404:
 *         description: Hechizo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', obtenerHechizoPorId);

/**
 * @swagger
 * /hechizos:
 *   post:
 *     summary: Crea un nuevo hechizo
 *     tags: [Hechizos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HechizoInput'
 *     responses:
 *       201:
 *         description: Hechizo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hechizo'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// router.post('/', crearHechizo);

/**
 * @swagger
 * /hechizos/{id}:
 *   put:
 *     summary: Actualiza un hechizo existente
 *     tags: [Hechizos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HechizoInput'
 *     responses:
 *       200:
 *         description: Hechizo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hechizo'
 *       404:
 *         description: Hechizo no encontrado
 *       400:
 *         description: ID no válido o error de validación
 */
// router.put('/:id', actualizarHechizo);

/**
 * @swagger
 * /hechizos/{id}:
 *   delete:
 *     summary: Elimina un hechizo
 *     tags: [Hechizos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hechizo eliminado correctamente
 *       404:
 *         description: Hechizo no encontrado
 *       400:
 *         description: ID no válido
 */
// router.delete('/:id', eliminarHechizo);

module.exports = router;