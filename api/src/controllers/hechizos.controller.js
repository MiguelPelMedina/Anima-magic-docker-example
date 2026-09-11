const Hechizo = require('../models/Hechizo');

// GET /api/hechizos
// Soporta paginación (?page=1&limit=10) y filtros (?via=Creacion&nivel=3&tipo=Fuego)
const listarHechizos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filtros = {};

    if (req.query.via) {
      filtros.Via = req.query.via;
    }

    if (req.query.nivel) {
      filtros.Nivel = parseInt(req.query.nivel);
    }

    if (req.query.tipo) {
      // Tipo es un array en el schema, $in permite buscar coincidencia
      // aunque el hechizo tenga varios tipos a la vez
      filtros.Tipo = { $in: [req.query.tipo] };
    }

    const [hechizos, total] = await Promise.all([
      Hechizo.find(filtros).skip(skip).limit(limit).sort({ Nombre: 1 }),
      Hechizo.countDocuments(filtros),
    ]);

    res.status(200).json({
      total,
      page,
      totalPaginas: Math.ceil(total / limit),
      resultados: hechizos.length,
      hechizos,
    });
  } catch (error) {
    console.error('Error al listar hechizos:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener los hechizos' });
  }
};

// GET /api/hechizos/:id
const obtenerHechizoPorId = async (req, res) => {
  try {
    const hechizo = await Hechizo.findById(req.params.id);

    if (!hechizo) {
      return res.status(404).json({ mensaje: 'Hechizo no encontrado' });
    }

    res.status(200).json(hechizo);
  } catch (error) {
    // CastError ocurre si el :id no tiene formato de ObjectId válido
    if (error.name === 'CastError') {
      return res.status(400).json({ mensaje: 'ID de hechizo no válido' });
    }
    console.error('Error al obtener hechizo:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener el hechizo' });
  }
};

// POST /api/hechizos
const crearHechizo = async (req, res) => {
  try {
    const nuevoHechizo = new Hechizo(req.body);
    const hechizoGuardado = await nuevoHechizo.save();
    res.status(201).json(hechizoGuardado);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: error.message });
    }
    console.error('Error al crear hechizo:', error.message);
    res.status(500).json({ mensaje: 'Error al crear el hechizo' });
  }
};

// PUT /api/hechizos/:id
const actualizarHechizo = async (req, res) => {
  try {
    const hechizoActualizado = await Hechizo.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // devuelve el documento ya actualizado, no el original
        runValidators: true, // aplica las validaciones del schema también en update
      }
    );

    if (!hechizoActualizado) {
      return res.status(404).json({ mensaje: 'Hechizo no encontrado' });
    }

    res.status(200).json(hechizoActualizado);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ mensaje: 'ID de hechizo no válido' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: error.message });
    }
    console.error('Error al actualizar hechizo:', error.message);
    res.status(500).json({ mensaje: 'Error al actualizar el hechizo' });
  }
};

// DELETE /api/hechizos/:id
const eliminarHechizo = async (req, res) => {
  try {
    const hechizoEliminado = await Hechizo.findByIdAndDelete(req.params.id);

    if (!hechizoEliminado) {
      return res.status(404).json({ mensaje: 'Hechizo no encontrado' });
    }

    res.status(200).json({ mensaje: 'Hechizo eliminado correctamente' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ mensaje: 'ID de hechizo no válido' });
    }
    console.error('Error al eliminar hechizo:', error.message);
    res.status(500).json({ mensaje: 'Error al eliminar el hechizo' });
  }
};

module.exports = {
  listarHechizos,
  obtenerHechizoPorId,
  crearHechizo,
  actualizarHechizo,
  eliminarHechizo,
};