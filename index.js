const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const routes = require('./routes/routes');
// const userRouter = require('./route/userRoute');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError').default;
const globalErrorHandler = require('./controllers/errorController');
const { swaggerUi, swaggerSpec } = require('./config/swagger-ui');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'It works hà há',
    });
});

app.use('/', routes);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    '*',
    catchAsync(async (req, res, next) => {
        throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    }),
);

app.use(globalErrorHandler);

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
});
