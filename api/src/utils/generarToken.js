const jwt = require('jsonwebtoken');

const generarToken = (id) => {
    return jwt.sign(
        { id },                          // payload
        process.env.JWT_SECRET,          // clave secreta para firmar
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

module.exports = generarToken;