const verificarPropietario = (req, res, next) => {
    if (req.usuario.id !== req.params.id) {
        return res.status(403).json({ mensaje: 'No tienes permiso sobre este recurso' });
    }
    next();
};

module.exports = verificarPropietario;