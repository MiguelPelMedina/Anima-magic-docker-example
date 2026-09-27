const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'No se proporcionó un token de autenticación' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = { id: decodificado.id };
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token no válido o expirado' });
    }
};

module.exports = verificarToken;