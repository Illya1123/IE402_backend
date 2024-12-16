const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Travel Tour API Project for Postgres",
        destcription: "API documentation for Travel Tour application",
    },
    host: "localhost:5000",
    schemes: ['http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey', // Sử dụng apiKey thay vì http
            name: 'Authorization', // Header nơi token sẽ được truyền
            in: 'header', // Bearer token sẽ được truyền trong header
            description: "Enter your token in the format: Bearer <token>",
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['../../index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('../../index.js');
})