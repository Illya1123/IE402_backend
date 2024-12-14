const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JS Travel Tour API Project for Postgres',
            version: '1.0.0',
            description: 'API documentation for Travel Tour application',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}/`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['../../routes/*.js'], // Cập nhật đường dẫn chính xác tới các file
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
