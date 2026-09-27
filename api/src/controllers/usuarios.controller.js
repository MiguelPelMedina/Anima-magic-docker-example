const Usuario = require('../models/Usuario');
const Hechizo = require('../models/Hechizo');
// GET    /api/usuarios/:id                           (JWT + propietario)
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).populate('LibrosHechizos.Hechizos');

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }
        res.status(500).json({ mensaje: 'Error al obtener el usuario' });
    }
}
// DELETE /api/usuarios/:id                            (JWT + propietario)
const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        return res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }
        res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
    }
}
// POST   /api/usuarios/:id/spellbooks                 (JWT + propietario)
const crearLibroHechizo = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        usuario.LibrosHechizos.push(req.body);
        await usuario.save();
        const libroCreado = usuario.LibrosHechizos[usuario.LibrosHechizos.length - 1];

        return res.status(201).json(libroCreado);
    }
    catch (error) {
        console.error('Error al crear libro de hechizos:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }
        res.status(500).json({ mensaje: 'Error al crear libro de hechizos' });
    }
}
// GET    /api/usuarios/:id/spellbooks                 (JWT + propietario)
const listarLibrosHechizos = async(req,res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).populate('LibrosHechizos.Hechizos');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        return res.status(200).json(usuario.LibrosHechizos);
    }
    catch (error) {
        console.error('Error al listar libros de hechizos:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }
        res.status(500).json({ mensaje: 'Error al listar los libros de hechizos' });
    }
}
// PUT    /api/usuarios/:id/spellbooks/:spellbookId    (JWT + propietario)
const actualizarLibroHechizo = async (req, res) => {
    try{
        const usuario = await Usuario.findById(req.params.id);
        if(!usuario){
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const libro = usuario.LibrosHechizos.id(req.params.spellbookId);
        if(!libro){
            return res.status(404).json({ mensaje: 'Libro de hechizos no encontrado' });
        }
        libro.Nombre = req.body.Nombre || libro.Nombre;
        await usuario.save();
        return res.status(200).json({ mensaje: 'Libro de hechizos actualizado correctamente' });
    }catch(error){
        console.error('Error al actualizar libro de hechizos:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }
        res.status(500).json({ mensaje: 'Error al actualizar el libro de hechizos' });
    }
}
// DELETE /api/usuarios/:id/spellbooks/:spellbookId    (JWT + propietario)
const eliminarLibroHechizo = async (req, res) => {
    try{
        const usuario = await Usuario.findById(req.params.id);
        if(!usuario){
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const libro = usuario.LibrosHechizos.id(req.params.spellbookId);
        if(!libro){
            return res.status(404).json({ mensaje: 'Libro de hechizos no encontrado' });
        }
        libro.deleteOne();
        await usuario.save();
        return res.status(200).json({ mensaje: 'Libro de hechizos eliminado correctamente' });
    }catch(error){
        console.error('Error al eliminar libro de hechizos:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }
        res.status(500).json({ mensaje: 'Error al eliminar el libro de hechizos' });
    }
}
// POST   /api/usuarios/:id/spellbooks/:spellbookId/hechizos          (JWT + propietario)
const agregarHechizoALibro = async (req, res) => {
    try{
        const usuario = await Usuario.findById(req.params.id);
        if(!usuario){
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const libro = usuario.LibrosHechizos.id(req.params.spellbookId);
        if(!libro){
            return res.status(404).json({ mensaje: 'Libro de hechizos no encontrado' });
        }
        if(libro.Hechizos.includes(req.body.hechizoId)){
            return res.status(409).json({ mensaje: 'El hechizo ya está en el libro' });
        }
        const hechizo = await Hechizo.findById(req.body.hechizoId);
        if(!hechizo){
            return res.status(404).json({ mensaje: 'Hechizo no encontrado' });
        }

        libro.Hechizos.push(req.body.hechizoId);
        await usuario.save();
        return res.status(200).json({ mensaje: 'Hechizo agregado al libro correctamente' });
    }catch(error){
        console.error('Error al agregar hechizo al libro:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }
        res.status(500).json({ mensaje: 'Error al agregar el hechizo al libro' });
    }
}
// DELETE /api/usuarios/:id/spellbooks/:spellbookId/hechizos/:hechizoId (JWT + propietario)
const eliminarHechizoDeLibro = async (req, res) => {
    try{
        const usuario = await Usuario.findById(req.params.id);
        if(!usuario){
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        const libro = usuario.LibrosHechizos.id(req.params.spellbookId);
        if(!libro){
            return res.status(404).json({ mensaje: 'Libro de hechizos no encontrado' });
        }
        
        libro.Hechizos.pull(req.params.hechizoId);
        await usuario.save();
        return res.status(200).json({ mensaje: 'Hechizo eliminado del libro correctamente' });
    }catch(error){
        console.error('Error al eliminar hechizo del libro:', error.message);
        if (error.name === 'CastError') {
            return res.status(400).json({ mensaje: 'ID de usuario no válido' });
        }
        res.status(500).json({ mensaje: 'Error al eliminar el hechizo del libro' });
    }
}
module.exports = {
    obtenerUsuarioPorId,
    eliminarUsuario,
    crearLibroHechizo,
    listarLibrosHechizos,
    actualizarLibroHechizo,
    eliminarLibroHechizo,
    agregarHechizoALibro,
    eliminarHechizoDeLibro,
}