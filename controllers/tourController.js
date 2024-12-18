const tour = require('../db/models/tour');
const route = require('../db/models/route');
const guide = require('../db/models/guide');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllTours = catchAsync(async (req, res, next) => {
    const tours = await tour.findAll();

    if (!tours || tours.length === 0) {
        return next(new AppError('No tours found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: tours,
    });
});

const createTour = catchAsync(async (req, res, next) => {
    const { tourName, description, startDate, endDate, price, limitOfNumOfGuest, tourType, route_id, guide_id } =
        req.body;

    // Step 1: Validate that the required fields are present
    if (!tourName || !startDate || !endDate || !price || !limitOfNumOfGuest || !tourType || !route_id || !guide_id) {
        return next(new AppError('All required fields must be provided.', 400));
    }

    // Step 2: Check if the route and guide exist in the database
    const foundRoute = await route.findByPk(route_id);
    if (!foundRoute) {
        return next(new AppError('Route not found', 404));
    }

    const foundGuide = await guide.findByPk(guide_id);
    if (!foundGuide) {
        return next(new AppError('Guide not found', 404));
    }

    // Step 3: Create the tour
    const newTour = await tour.create({
        tourName,
        description,
        startDate,
        endDate,
        price,
        limitOfNumOfGuest,
        tourType,
        route_id,
        guide_id,
    });

    if (!newTour) {
        return next(new AppError('Failed to create the tour', 400));
    }

    // Step 4: Return the newly created tour as a response
    const result = newTour.toJSON();

    return res.status(201).json({
        status: 'success',
        data: result,
    });
});

module.exports = { getAllTours, createTour };
