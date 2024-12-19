const routeDestinate = require('../db/models/routedestinate');
const route = require('../db/models/route');
const destination = require('../db/models/destination');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
};

const degreesToRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
};

const createRouteDestinate = catchAsync(async (req, res, next) => {
    const { route_id } = req.body;

    const foundRoute = await route.findOne({
        where: { id: route_id },
    });

    if (!foundRoute) {
        return next(new AppError('Route not found', 404));
    }

    const { startLatitude, startLongitude, endLatitude, endLongitude } = foundRoute;

    const destinations = await destination.findAll();

    const sortedDestinations = destinations.map((dest, index) => {
        const distance = calculateDistance(startLatitude, startLongitude, dest.latitude, dest.longitude);
        return {
            ...dest.dataValues,
            distance,
        };
    });

    sortedDestinations.sort((a, b) => a.distance - b.distance);

    let order = 1;
    let reachedDestination = false;

    for (const destinationData of sortedDestinations) {
        if (reachedDestination) {
            break;
        }

        const distanceToEnd = calculateDistance(
            destinationData.latitude,
            destinationData.longitude,
            endLatitude,
            endLongitude,
        );
        if (distanceToEnd < 1) {
            reachedDestination = true;
        }

        const newRouteDestinate = await routeDestinate.create({
            route_id,
            destinate_id: destinationData.id,
            order,
            longitude: destinationData.longitude,
            latitude: destinationData.latitude,
        });

        order++;
    }

    return res.status(201).json({
        status: 'success',
        message: 'RouteDestinate created with ordered destinations',
    });
});

const getRouteDestinate = catchAsync(async (req, res, next) => {
    const { route_id } = req.params;

    const foundRoute = await routeDestinate.findAll({
        where: { route_id: route_id },
        order: [['order', 'ASC']],
    });

    if (!foundRoute) {
        return next(new AppError('Route not found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: foundRoute,
    });
});

const getAllRouteDestinate = catchAsync(async (req, res, next) => {
    const foundRoute = await routeDestinate.findAll();

    if (!foundRoute) {
        return next(new AppError('Route not found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: foundRoute,
    });
});

module.exports = { createRouteDestinate, getRouteDestinate, getAllRouteDestinate };
