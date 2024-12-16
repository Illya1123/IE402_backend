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

const getAllDestinations = catchAsync(async (req, res, next) => {
    const destinations = await destination.findAll();

    if (!destinations || destinations.length === 0) {
        return next(new AppError('No destinations found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: destinations,
    });
});

const getDestinations = catchAsync(async (req, res, next) => {
    const destinations = await destination.findAll();

    if (!destinations || destinations.length === 0) {
        return next(new AppError('No destinations found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: destinations,
    });
});

const getDestination = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const destinationData = await destination.findByPk(id);

    if (!destinationData) {
        return next(new AppError('Destination not found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: destinationData,
    });
});


module.exports = {createDestination, getAllDestinations, getDestinations};