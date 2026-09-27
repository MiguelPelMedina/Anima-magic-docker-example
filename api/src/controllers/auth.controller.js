const Usuario = require('../models/Usuario');
const generarToken = require('../utils/generarToken');

// POST /api/auth/registro
const registro = async (req, res) => {
  try {
    const { Nick, Password } = req.body;

    const nuevoUsuario = new Usuario({ Nick, Password });
    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario._id);

    res.status(201).json({
      usuario: {
        id: nuevoUsuario._id,
        Nick: nuevoUsuario.Nick,
      },
      token,
    });
  } catch (error) {
    // Índice único violado (Nick duplicado)
    if (error.code === 11000) {
      return res.status(409).json({ mensaje: 'Ese nick ya está en uso' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ mensaje: error.message });
    }

    console.error('Error al registrar usuario:', error.message);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { Nick, Password } = req.body;

    // Password tiene select:false en el esquema, hay que pedirlo explícitamente
    const usuario = await Usuario.findOne({ Nick }).select('+Password');

    // Mensaje genérico a propósito: no revelamos si falló por
    // nick inexistente o por contraseña incorrecta
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Nick o contraseña incorrectos' });
    }

    const passwordValida = await usuario.compararPassword(Password);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Nick o contraseña incorrectos' });
    }

    const token = generarToken(usuario._id);

    res.status(200).json({
      usuario: {
        id: usuario._id,
        Nick: usuario.Nick,
      },
      token,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

module.exports = {
  registro,
  login,
};