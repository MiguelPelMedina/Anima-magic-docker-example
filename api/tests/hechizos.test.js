const request = require('supertest');
const app = require('../src/app');
const Hechizo = require('../src/models/Hechizo');

const hechizoValido = {
  Nombre: 'Bola de fuego',
  Via: 'Creacion',
  Nivel: 3,
  Tipo: ['Fuego', 'Área'],
  Accion: 'Instantánea',
  Efecto: 'Inflige daño de fuego en área',
  mantenimiento: 'Ninguno',
  Grado: [
    { Name: 'Básico', Coste: 10, CosteMantenimiento: 0, IntR: 2, Efecto: '3d6 de daño' },
  ],
};

describe('CRUD de Hechizos', () => {
  // describe('POST /api/hechizos', () => {
  //   it('crea un hechizo válido y devuelve 201', async () => {
  //     const res = await request(app).post('/api/hechizos').send(hechizoValido);

  //     expect(res.status).toBe(201);
  //     expect(res.body.Nombre).toBe('Bola de fuego');
  //     expect(res.body._id).toBeDefined();
  //   });

  //   it('rechaza un hechizo sin Nombre con 400', async () => {
  //     const { Nombre, ...sinNombre } = hechizoValido;
  //     const res = await request(app).post('/api/hechizos').send(sinNombre);

  //     expect(res.status).toBe(400);
  //   });

  //   it('rechaza un Nivel que no es numérico con 400', async () => {
  //     const res = await request(app)
  //       .post('/api/hechizos')
  //       .send({ ...hechizoValido, Nivel: 'tres' });

  //     expect(res.status).toBe(400);
  //   });
  // });

  describe('GET /api/hechizos', () => {
    it('devuelve lista vacía cuando no hay hechizos', async () => {
      const res = await request(app).get('/api/hechizos');

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(0);
      expect(res.body.hechizos).toEqual([]);
    });

    it('devuelve los hechizos creados, paginados', async () => {
      await Hechizo.create(hechizoValido);
      await Hechizo.create({ ...hechizoValido, Nombre: 'Rayo helado', Nivel: 5 });

      const res = await request(app).get('/api/hechizos?limit=1&page=1');

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(2);
      expect(res.body.resultados).toBe(1);
      expect(res.body.totalPaginas).toBe(2);
    });

    it('filtra por nivel correctamente', async () => {
      await Hechizo.create(hechizoValido);
      await Hechizo.create({ ...hechizoValido, Nombre: 'Rayo helado', Nivel: 5 });

      const res = await request(app).get('/api/hechizos?nivel=5');

      expect(res.body.total).toBe(1);
      expect(res.body.hechizos[0].Nombre).toBe('Rayo helado');
    });
  });

  describe('GET /api/hechizos/:id', () => {
    it('devuelve 404 si el hechizo no existe', async () => {
      const idInexistente = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/hechizos/${idInexistente}`);

      expect(res.status).toBe(404);
    });

    it('devuelve 400 si el id no es un ObjectId válido', async () => {
      const res = await request(app).get('/api/hechizos/id-invalido');

      expect(res.status).toBe(400);
    });

    it('devuelve el hechizo si existe', async () => {
      const creado = await Hechizo.create(hechizoValido);

      const res = await request(app).get(`/api/hechizos/${creado._id}`);

      expect(res.status).toBe(200);
      expect(res.body.Nombre).toBe('Bola de fuego');
    });
  });

  // describe('PUT /api/hechizos/:id', () => {
  //   it('actualiza un hechizo existente', async () => {
  //     const creado = await Hechizo.create(hechizoValido);

  //     const res = await request(app)
  //       .put(`/api/hechizos/${creado._id}`)
  //       .send({ ...hechizoValido, Nivel: 7 });

  //     expect(res.status).toBe(200);
  //     expect(res.body.Nivel).toBe(7);
  //   });

  //   it('devuelve 404 al actualizar un id inexistente', async () => {
  //     const idInexistente = '507f1f77bcf86cd799439011';
  //     const res = await request(app)
  //       .put(`/api/hechizos/${idInexistente}`)
  //       .send(hechizoValido);

  //     expect(res.status).toBe(404);
  //   });
  // });

  // describe('DELETE /api/hechizos/:id', () => {
  //   it('elimina un hechizo existente', async () => {
  //     const creado = await Hechizo.create(hechizoValido);

  //     const res = await request(app).delete(`/api/hechizos/${creado._id}`);

  //     expect(res.status).toBe(200);

  //     const buscado = await Hechizo.findById(creado._id);
  //     expect(buscado).toBeNull();
  //   });

  //   it('devuelve 404 al eliminar un id inexistente', async () => {
  //     const idInexistente = '507f1f77bcf86cd799439011';
  //     const res = await request(app).delete(`/api/hechizos/${idInexistente}`);

  //     expect(res.status).toBe(404);
  //   });
  // });
});