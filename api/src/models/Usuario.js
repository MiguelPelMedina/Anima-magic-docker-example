const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const LibroHechizoSchema = new Schema(
    {
        Nombre: {
            type: String,
            required: true,
            trim: true,
        },
        Hechizos:{
            type: [Schema.Types.ObjectId],
            ref: 'Hechizo',
            default: [],
        }
    }

);

const UsuarioSchema = new Schema(
    {
        Nick:{
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        Password:{
            type: String,
            required: true,
            select: false, // para que no se devuelva en las consultas por defecto
        },
        LibrosHechizos:{
            type: [LibroHechizoSchema],
            default: [],
        }

    },
    {   
        timestamps: true,
        collection: 'usuarios',
    }
);
// --- Hook: se ejecuta automáticamente ANTES de cada .save() ---
UsuarioSchema.pre('save', async function () {
    // 'this' es el documento que se está guardando

    if (!this.isModified('Password')) {
        // Si el usuario ya existía y se está actualizando otro campo
        // (por ejemplo, añadiendo un libro de hechizos), la password
        // no cambió, así que no la volvemos a hashear.
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
});

// --- Método de instancia: disponible en cualquier documento de Usuario ---
UsuarioSchema.methods.compararPassword = async function (passwordCandidata) {
    return bcrypt.compare(passwordCandidata, this.Password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);