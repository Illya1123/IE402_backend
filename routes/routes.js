const express = require('express');
const authRoute = require('./authRoute'); 
const userRoute = require('./userRoute');
const destinateRoute = require('./destinateRoute');
const tourRoute = require('./tourRoute');
const routeRoute = require('./routeRoute');
const bookingRoute = require('./bookingRoute');
// const { swaggerUi, swaggerSpec } = require('../config/swagger-ui');

const router = express.Router();


router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/destinations', destinateRoute);
router.use('/tours', tourRoute);
router.use('/routes', routeRoute);
router.use('/bookings', bookingRoute);
// router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
