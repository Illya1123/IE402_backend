const express = require('express');
const authRoute = require('./authRoute');
const userRoute = require('./userRoute');
const destinateRoute = require('./destinateRoute');
const customerRoute = require('./customerRoute');
const bookingRoute = require('./bookingRoute');
const tourRoute = require('./tourRoute');
const routeRoute = require('./routeRoute');
// const { swaggerUi, swaggerSpec } = require('../config/swagger-ui');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/destinations', destinateRoute);
router.use('/customers', customerRoute);
router.use('/bookings', bookingRoute);
router.use('/tours', tourRoute);
router.use('/routes', routeRoute);
// router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
