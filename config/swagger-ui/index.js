const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JS Travel Tour API Project for Postgres',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}/`,
            },
        ],
    },
    apis: ['../../routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
