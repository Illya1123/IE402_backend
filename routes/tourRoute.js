const { createTour, getAllTour, getTourById } = require('../controllers/tourController');
const { authentication, restrictTo } = require('../controllers/authController');

const router = require('express').Router();

router.route('/getAll').get(getAllTours);
router.route('/create-tour').post(authentication, restrictTo('0'), createTour);
router.route('/get-all-tour/').get(authentication, restrictTo('0'), getAllTour);
router.route('/getAllTour').get(getAllTour);
router.route('/get-tour/:id').get(getTourById);

module.exports = router;
