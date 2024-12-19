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

// Lấy thông tin booking theo ID
const getBookingById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const foundBooking = await booking.findByPk(id);
  if (!foundBooking) {
    return next(new AppError('Booking not found', 404));
  }
  
  return res.status(200).json({
    status: 'success',
    data: foundBooking,
  });
});

// Tạo một booking mới
const createBooking = catchAsync(async (req, res, next) => {
    const { tour_id, customer_id, numberOfGuest, status } = req.body;
  
    // Tạo booking mới
    const newBooking = await booking.create({
      tour_id,
      customer_id,
      numberOfGuest,
      status,
    });
  
    return res.status(201).json({
      status: 'success',
      data: newBooking,
    });
  });
  

// Cập nhật booking
const updateBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { tour_id, customer_id, bookingHour, numberOfGuest, status } = req.body;
  
  const foundBooking = await booking.findByPk(id);
  if (!foundBooking) {
    return next(new AppError('Booking not found', 404));
  }
  
  const updatedBooking = await foundBooking.update({
    tour_id,
    customer_id,
    bookingHour,
    numberOfGuest,
    status,
  });
  
  return res.status(200).json({
    status: 'success',
    data: updatedBooking,
  });
});

// Xóa booking
const deleteBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const foundBooking = await booking.findByPk(id);
  if (!foundBooking) {
    return next(new AppError('Booking not found', 404));
  }
  
  await foundBooking.destroy();
  
  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};
