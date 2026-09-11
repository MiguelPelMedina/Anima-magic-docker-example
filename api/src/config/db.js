const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ ya no necesita las opciones antiguas
      // (useNewUrlParser, useUnifiedTopology), pero las dejamos
      // documentadas por si usas una versión anterior:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error al conectar con MongoDB: ${error.message}`);
    // Si no hay conexión a la BD, no tiene sentido que el servidor siga vivo
    process.exit(1);
  }
};

// Eventos del ciclo de vida de la conexión (útiles para debugging y logs en producción)
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB desconectado');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconectado');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ Error en la conexión de MongoDB: ${err.message}`);
});

module.exports = connectDB;