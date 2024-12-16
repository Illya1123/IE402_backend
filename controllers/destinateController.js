const destination = require('../db/models/destination');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createDestination = catchAsync(async (req, res, next) => {
    const body = req.body;

    const existingDestination = await destination.findOne({ where: { name: body.name } });
    if (existingDestination) {
        return next(new AppError('Destination already exists', 400));
    }

    const newDestination = await destination.create({
        name: body.name,
        description: body.description,
        openHour: body.openHour,
        closeHour: body.closeHour,
        rate: body.rate,
        latitude: body.latitude,
        longitude: body.longitude,
    });

    if (!newDestination) {
        return next(new AppError('Failed to create the destination', 400));
    }

    const result = newDestination.toJSON();

    return res.status(201).json({
        status: 'success',
        data: result,
    });
});

module.exports = {createDestination};