const mongoose = require('mongoose');
const { Schema } = mongoose;

const gradoSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Coste: {
      type: Number,
      required: true,
    },
    CosteMantenimiento: {
      type: Number,
      required: true,
    },
    IntR: {
      type: Number,
      required: true,
    },
    Efecto: {
      type: String,
      required: true,
    },
  },
  { _id: false } // subdocumento sin su propio _id, ver explicación abajo
);

const hechizoSchema = new Schema(
  {
    Nombre: {
      type: String,
      required: true,
      trim: true,
    },
    Via: {
      type: String,
      required: true,
      trim: true,
    },
    Nivel: {
      type: Number,
      required: true,
    },
    Tipo: {
      type: [String],
      required: true,
    },
    Accion: {
      type: String,
      required: true,
      trim: true,
    },
    Efecto: {
      type: String,
      required: true,
    },
    mantenimiento: {
      type: String,
      required: true,
      trim: true,
    },
    Grado: {
      type: [gradoSchema],
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'hechizos', // fuerza el nombre exacto de la colección
  }
);

module.exports = mongoose.model('Hechizo', hechizoSchema);