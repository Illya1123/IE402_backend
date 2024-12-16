const express = require('express');
const authRoute = require('./authRoute'); 
const userRoute = require('./userRoute');
const destinateRoute = require('./destinateRoute');
// const { swaggerUi, swaggerSpec } = require('../config/swagger-ui');

const router = express.Router();


router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/destinations', destinateRoute);
// router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
