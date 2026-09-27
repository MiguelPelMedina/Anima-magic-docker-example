const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const Usuario = require('../src/models/Usuario');
const Hechizo = require('../src/models/Hechizo');

const usuarioValido = {
  Nick: 'Juan',
  Password: 'Password123-',
};

const hechizoValido = {
  Nombre: 'Bola de fuego',
  Via: 'Creacion',
  Nivel: 3,
  Tipo: ['Fuego', 'Área'],
  Accion: 'Instantánea',
  Efecto: 'Inflige daño de fuego en área',
  mantenimiento: 'Ninguno',
  Grado: [
    {
      Name: 'Básico',
      Coste: 10,
      CosteMantenimiento: 0,
      IntR: 2,
      Efecto: '3d6 de daño',
    },
  ],
};

describe('Rutas de Usuarios', () => {
  let usuario;
  let token;

  beforeEach(async () => {
    usuario = await Usuario.create(usuarioValido);

    const id = usuario._id.toString();
    token = jwt.sign(
      { id, _id: id, uid: id, usuarioId: id, sub: id },
      process.env.JWT_SECRET || 'test-secret'
    );
  });

  const conToken = (peticion) =>
    peticion.set('Authorization', `Bearer ${token}`);

  describe('GET /api/usuarios/:id', () => {
    it('devuelve el usuario sin incluir su contraseña', async () => {
      const res = await conToken(
        request(app).get(`/api/usuarios/${usuario._id}`)
      );

      expect(res.status).toBe(200);
      expect(res.body.Nick).toBe(usuarioValido.Nick);
      expect(res.body.Password).toBeUndefined();
    });

    it('devuelve 403 si el usuario no existe', async () => {
      const idInexistente = '507f1f77bcf86cd799439011';
      const res = await conToken(
        request(app).get(`/api/usuarios/${idInexistente}`)
      );

      expect(res.status).toBe(403);
    });

    it('devuelve 400 si el ID no es válido', async () => {
      const res = await conToken(request(app).get('/api/usuarios/id-invalido'));

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/usuarios/:id', () => {
    it('elimina un usuario existente', async () => {
      const res = await conToken(
        request(app).delete(`/api/usuarios/${usuario._id}`)
      );

      expect(res.status).toBe(200);
      expect(await Usuario.findById(usuario._id)).toBeNull();
    });

    it('devuelve 403 si el usuario no existe', async () => {
      const idInexistente = '507f1f77bcf86cd799439011';
      const res = await conToken(
        request(app).delete(`/api/usuarios/${idInexistente}`)
      );

      expect(res.status).toBe(403); // Cambiado de 404 a 403 para reflejar la verificación de propietario
    });
  });

  describe('Rutas de libros de hechizos', () => {
    it('crea y lista un libro de hechizos', async () => {
      const creado = await conToken(
        request(app)
          .post(`/api/usuarios/${usuario._id}/spellbooks`)
          .send({ Nombre: 'Mi libro' })
      );

      expect(creado.status).toBe(201);
      expect(creado.body.Nombre).toBe('Mi libro');
      expect(creado.body._id).toBeDefined();

      const listado = await conToken(
        request(app).get(`/api/usuarios/${usuario._id}/spellbooks`)
      );

      expect(listado.status).toBe(200);
      expect(listado.body).toHaveLength(1);
      expect(listado.body[0].Nombre).toBe('Mi libro');
    });

    it('rechaza crear un libro sin nombre', async () => {
      const res = await conToken(
        request(app)
          .post(`/api/usuarios/${usuario._id}/spellbooks`)
          .send({})
      );

      expect(res.status).toBe(400);
    });

    it('actualiza el nombre de un libro', async () => {
      const creado = await conToken(
        request(app)
          .post(`/api/usuarios/${usuario._id}/spellbooks`)
          .send({ Nombre: 'Mi libro' })
      );
      const libroId = creado.body._id;

      const actualizado = await conToken(
        request(app)
          .put(`/api/usuarios/${usuario._id}/spellbooks/${libroId}`)
          .send({ Nombre: 'Libro actualizado' })
      );

      expect(actualizado.status).toBe(200);

      const listado = await conToken(
        request(app).get(`/api/usuarios/${usuario._id}/spellbooks`)
      );
      expect(listado.body[0].Nombre).toBe('Libro actualizado');
    });

    it('devuelve 404 al actualizar un libro inexistente', async () => {
      const libroId = '507f1f77bcf86cd799439011';
      const res = await conToken(
        request(app)
          .put(`/api/usuarios/${usuario._id}/spellbooks/${libroId}`)
          .send({ Nombre: 'Libro actualizado' })
      );

      expect(res.status).toBe(404);
    });

    it('elimina un libro existente', async () => {
      const creado = await conToken(
        request(app)
          .post(`/api/usuarios/${usuario._id}/spellbooks`)
          .send({ Nombre: 'Mi libro' })
      );

      const res = await conToken(
        request(app).delete(
          `/api/usuarios/${usuario._id}/spellbooks/${creado.body._id}`
        )
      );

      expect(res.status).toBe(200);

      const listado = await conToken(
        request(app).get(`/api/usuarios/${usuario._id}/spellbooks`)
      );
      expect(listado.body).toHaveLength(0);
    });

    it('devuelve 404 si el usuario no existe al crear un libro', async () => {
      const idInexistente = '507f1f77bcf86cd799439011';
      const res = await conToken(
        request(app)
          .post(`/api/usuarios/${idInexistente}/spellbooks`)
          .send({ Nombre: 'Mi libro' })
      );

      expect(res.status).toBe(403); // Cambiado de 404 a 403 para reflejar la verificación de propietario
    });
  });

  describe('Rutas de hechizos dentro de un libro', () => {
    it('agrega un hechizo al libro y lo devuelve al listar los libros', async () => {
      const libro = await conToken(
        request(app)
          .post(`/api/usuarios/${usuario._id}/spellbooks`)
          .send({ Nombre: 'Mi libro' })
      );
      const hechizo = await Hechizo.create(hechizoValido);

      const agregado = await conToken(
        request(app)
          .post(
            `/api/usuarios/${usuario._id}/spellbooks/${libro.body._id}/hechizos`
          )
          .send({ hechizoId: hechizo._id.toString() })
      );

      expect(agregado.status).toBe(200);

      const listado = await conToken(
        request(app).get(`/api/usuarios/${usuario._id}/spellbooks`)
      );
      expect(listado.body[0].Hechizos).toHaveLength(1);
      expect(listado.body[0].Hechizos[0].Nombre).toBe(hechizoValido.Nombre);
    });

    it('devuelve 404 si el hechizo que se intenta agregar no existe', async () => {
      const libro = await conToken(
        request(app)
          .post(`/api/usuarios/${usuario._id}/spellbooks`)
          .send({ Nombre: 'Mi libro' })
      );
      const idInexistente = '507f1f77bcf86cd799439011';

      const res = await conToken(
        request(app)
          .post(
            `/api/usuarios/${usuario._id}/spellbooks/${libro.body._id}/hechizos`
          )
          .send({ hechizoId: idInexistente })
      );

      expect(res.status).toBe(404);
    });

    it('elimina un hechizo del libro', async () => {
      const libro = await conToken(
        request(app)
          .post(`/api/usuarios/${usuario._id}/spellbooks`)
          .send({ Nombre: 'Mi libro' })
      );
      const hechizo = await Hechizo.create(hechizoValido);

      await conToken(
        request(app)
          .post(
            `/api/usuarios/${usuario._id}/spellbooks/${libro.body._id}/hechizos`
          )
          .send({ hechizoId: hechizo._id.toString() })
      );

      const eliminado = await conToken(
        request(app).delete(
          `/api/usuarios/${usuario._id}/spellbooks/${libro.body._id}/hechizos/${hechizo._id}`
        )
      );

      expect(eliminado.status).toBe(200);

      const listado = await conToken(
        request(app).get(`/api/usuarios/${usuario._id}/spellbooks`)
      );
      expect(listado.body[0].Hechizos).toHaveLength(0);
    });
  });
});