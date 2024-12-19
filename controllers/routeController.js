const route = require('../db/models/route');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createRoute = catchAsync(async (req, res, next) => {
    const body = req.body;

    // Calculate route length using the Haversine formula
    const length = calculateRouteLength(
        body.startLatitude, body.startLongitude, 
        body.endLatitude, body.endLongitude
    );

    // Check if route with the same name already exists
    const existingRoute = await route.findOne({ where: { name: body.name } });
    if (existingRoute) {
        return next(new AppError('Route already exists', 400));
    }

    // Create a new route with calculated length
    const newRoute = await route.create({
        name: body.name,
        description: body.description,
        startLongitude: body.startLongitude,
        startLatitude: body.startLatitude,
        endLongitude: body.endLongitude,
        endLatitude: body.endLatitude,
        length: length, // Store the calculated length
    });

    if (!newRoute) {
        return next(new AppError('Failed to create the route', 400));
    }

    const result = newRoute.toJSON();

    return res.status(201).json({
        status: 'success',
        data: result,
    });
});


const calculateRouteLength = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; // Earth's radius in kilometers (use 3958.8 for miles)

    // Convert degrees to radians
    const lat1Rad = degreesToRadians(lat1);
    const lon1Rad = degreesToRadians(lon1);
    const lat2Rad = degreesToRadians(lat2);
    const lon2Rad = degreesToRadians(lon2);

    // Calculate differences in coordinates
    const latDelta = lat2Rad - lat1Rad;
    const lonDelta = lon2Rad - lon1Rad;

    // Haversine formula
    const a =
        Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c; // Return the distance in kilometers
};


const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
};

const getRoute = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundRoute = await route.findByPk(id);

    if (!foundRoute) {
        return next(new AppError('Route not found', 404)); 
    }

    return res.status(200).json({
        status: 'success',
        data: foundRoute,
    });
});

const getAllRoutes = catchAsync(async (req, res, next) => {
    const routes = await route.findAll();

    return res.status(200).json({
        status: 'success',
        data: routes,
    });
});

module.exports = { createRoute, getAllRoutes, getRoute };