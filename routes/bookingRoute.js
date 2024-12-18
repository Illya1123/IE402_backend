const { getAllBookings, createBooking, getBookingById, updateBooking, deleteBooking } = require('../controllers/bookingController');
const { authentication, restrictTo } = require('../controllers/authController');

const router = require('express').Router();

router.route('/create-booking').post(createBooking);
router.route('/get-all-booking').get(authentication, restrictTo('0') ,getAllBookings);
router.route('/get-booking/:id').get(getBookingById);
router.route('/update-booking/:id').patch(updateBooking);
router.route('/delete-booking/:id').delete(deleteBooking);

module.exports = router;