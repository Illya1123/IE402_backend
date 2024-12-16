const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError').default;
const globalErrorHandler = require('./controllers/errorController');
// const { swaggerUi, swaggerSpec } = require('./config/swagger-ui');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger-ui/swagger_output.json');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Test route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'It works hà há',
    });
});

// API routes
app.use('/', routes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Handle unknown routes
app.use(
    '*',
    catchAsync(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    }),
);

// Global error handler
app.use(globalErrorHandler);

// Start server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
