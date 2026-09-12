const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Magia Anima',
      version: '0.1.0',
      description: 'API REST para la gestión de hechizos y usuarios del sistema Magia de Anima Beyond TTRPG',
    },
    servers: [
      {
        url: '/api',
        description: 'Servidor actual (relativo, funciona detrás de nginx o en local)',
      },
    ],
    components: {
      schemas: {
        Grado: {
          type: 'object',
          required: ['Name', 'Coste', 'CosteMantenimiento', 'IntR', 'Efecto'],
          properties: {
            Name: { type: 'string' },
            Coste: { type: 'integer' },
            CosteMantenimiento: { type: 'integer' },
            IntR: { type: 'integer' },
            Efecto: { type: 'string' },
          },
        },
        Hechizo: {
          type: 'object',
          required: ['Nombre', 'Via', 'Nivel', 'Tipo', 'Accion', 'Efecto', 'mantenimiento', 'Grado'],
          properties: {
            _id: { type: 'string', example: '671f1a2b3c4d5e6f7a8b9c0d' },
            Nombre: { type: 'string', example: 'Crear Fuego' },
            Via: { type: 'string', example: 'Fuego' },
            Nivel: { type: 'integer', example: 6 },
            Tipo: {
              type: 'array',
              items: { type: 'string' },
              example: ['Efecto', 'Anímico'],
            },
            Accion: { type: 'string', example: 'Activa' },
            Efecto: { type: 'string', example: 'Crea intensidades de fuego. Mientras se mantenga el conjuro, la temperatura se conservará.' },
            mantenimiento: { type: 'string', example: 'Sí' },
            Grado: {
              type: 'array',
              items: { $ref: '#/components/schemas/Grado' },
            },
          },
        },
        HechizoInput: {
          type: 'object',
          required: ['Nombre', 'Via', 'Nivel', 'Tipo', 'Accion', 'Efecto', 'mantenimiento', 'Grado'],
          properties: {
            Nombre: { type: 'string' },
            Via: { type: 'string' },
            Nivel: { type: 'integer' },
            Tipo: { type: 'array', items: { type: 'string' } },
            Accion: { type: 'string' },
            Efecto: { type: 'string' },
            mantenimiento: { type: 'string' },
            Grado: {
              type: 'array',
              items: { $ref: '#/components/schemas/Grado' },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            mensaje: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);