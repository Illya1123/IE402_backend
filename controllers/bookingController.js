const booking = require('../db/models/booking');
const customer = require('../db/models/customer');
const user = require('../db/models/user');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await booking.findAll();
    if (!bookings || bookings.length === 0) {
        return next(new AppError('No bookings found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: bookings,
    });
});

module.exports = { getAllBookings };
