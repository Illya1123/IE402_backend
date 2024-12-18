const { createTour } = require('../controllers/tourController');
const { authentication, restrictTo } = require('../controllers/authController');

const router = require('express').Router();

router.route('/create-tour').post(authentication, restrictTo('0'), createTour);

module.exports = router;