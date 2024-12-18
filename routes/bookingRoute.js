const { getAllBookings } = require('../controllers/bookingController');

const router = require('express').Router();

router.route('/getAll').get(getAllBookings);

module.exports = router;
