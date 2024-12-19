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

const createMultipleDestinations = catchAsync(async (req, res, next) => {
    const destinations = req.body;

    if (!Array.isArray(destinations) || destinations.length === 0) {
        return next(new AppError('Input should be a non-empty array of destinations', 400));
    }

    const results = [];
    const errors = [];

    for (const destinationData of destinations) {
        try {
            const existingDestination = await destination.findOne({ where: { name: destinationData.name } });

            if (existingDestination) {
                errors.push({
                    name: destinationData.name,
                    message: 'Destination already exists',
                });
                continue;
            }

            const newDestination = await destination.create({
                name: destinationData.name,
                description: destinationData.description,
                openHour: destinationData.openHour,
                closeHour: destinationData.closeHour,
                rate: destinationData.rate,
                latitude: destinationData.latitude,
                longitude: destinationData.longitude,
            });

            results.push(newDestination.toJSON());
        } catch (error) {
            errors.push({
                name: destinationData.name || 'Unknown',
                message: error.message,
            });
        }
    }

    if (results.length === 0) {
        return res.status(400).json({
            status: 'fail',
            message: 'No destinations were created',
            errors,
        });
    }

    return res.status(201).json({
        status: 'success',
        data: results,
        errors,
    });
});



module.exports = {createDestination, getAllDestinations, getDestinations, createMultipleDestinations};