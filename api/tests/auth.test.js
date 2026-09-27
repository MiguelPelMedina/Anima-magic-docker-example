const request = require('supertest');
const app = require('../src/app');

const usuarioValido = {
    Nick: 'Juan',
    Password: 'Password123-',
}

describe('Registro de usuarios', () => {
    it('debería registrar un usuario válido y devolver 201', async () => {
        const res = await request(app).post('/api/auth/registro').send(usuarioValido);
        expect(res.status).toBe(201);
        expect(res.body.usuario.Nick).toBe(usuarioValido.Nick);
        expect(res.body.token).toBeDefined();
    });
    it('debería rechazar un registro con Nick duplicado y devolver 409', async () => {
        await request(app).post('/api/auth/registro').send(usuarioValido);
        const res = await request(app).post('/api/auth/registro').send(usuarioValido);
        expect(res.status).toBe(409);
    });
    it('debería rechazar un registro con Nick vacío y devolver 400', async () => {
        const res = await request(app).post('/api/auth/registro').send({ ...usuarioValido, Nick: '' });
        expect(res.status).toBe(400);
    });
    it('debería rechazar un registro con Password vacío y devolver 400', async () => {
        const res = await request(app).post('/api/auth/registro').send({ ...usuarioValido, Password: '' });
        expect(res.status).toBe(400);
    });
    it('debería rechazar un registro con Password que no cumpla los requisitos y devolver 400', async () => {
        const res = await request(app).post('/api/auth/registro').send({ ...usuarioValido, Password: 'short' });
        expect(res.status).toBe(400);
    });
}); 
describe('Login de usuarios', () => {

    it('debería iniciar sesión con credenciales válidas y devolver 200', async () => {
        await request(app).post('/api/auth/registro').send(usuarioValido);
        const res = await request(app).post('/api/auth/login').send(usuarioValido);
        expect(res.status).toBe(200);
        expect(res.body.usuario.Nick).toBe(usuarioValido.Nick);
        expect(res.body.token).toBeDefined();
    });
    it('debería rechazar un login con Nick incorrecto y devolver 401', async () => {
        const res = await request(app).post('/api/auth/login').send({ ...usuarioValido, Nick: 'Incorrecto' });
        expect(res.status).toBe(401);
    });
    it('debería rechazar un login con Password incorrecto y devolver 401', async () => {
        await request(app).post('/api/auth/registro').send(usuarioValido);
        const res = await request(app).post('/api/auth/login').send({ ...usuarioValido, Password: 'Incorrecto' });
        expect(res.status).toBe(401);
    });
});