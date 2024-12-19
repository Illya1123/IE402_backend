const tour = require('../db/models/tour');
const route = require('../db/models/route');
const guide = require('../db/models/guide');
const routeDestinate = require('../db/models/routedestinate');

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
    const { tourName, img, description, startDate, endDate, price, limitOfNumOfGuest, tourType, route_id, guide_id } = req.body;
    if (!tourName || !startDate || !endDate || !price || !limitOfNumOfGuest || !tourType || !route_id || !guide_id) {
        return next(new AppError('All required fields must be provided.', 400));
    }

    const foundRoute = await route.findByPk(route_id);
    if (!foundRoute) {
        return next(new AppError('Route not found', 404));
    }

    const foundGuide = await guide.findByPk(guide_id);
    if (!foundGuide) {
        return next(new AppError('Guide not found', 404));
    }
  
    const newTour = await tour.create({
      tourName,
      img,
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

    const result = newTour.toJSON();

    return res.status(201).json({
        status: 'success',
        data: result,
    });

  });
  
const getAllTour = catchAsync(async (req, res, next) => {
    const foundTours = await tour.findAll();
  
    if (!foundTours || foundTours.length === 0) {
      return next(new AppError('Tour not found', 404));
    }
  
    return res.status(200).json({
      status: 'success',
      data: foundTours,
    });
  });

  const getTourById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
  
    const foundTour = await tour.findByPk(id);

    if (!foundTour) {
      return next(new AppError('Tour not found', 404));
    }

    const foundRouteDestinates = await routeDestinate.findAll({
      where: { route_id: foundTour.route_id },
      order: [['order', 'ASC']],
    });

    if (!foundRouteDestinates || foundRouteDestinates.length === 0) {
      return next(new AppError('No route destinations found for this tour', 404));
    }

    return res.status(200).json({
      status: 'success',
      data: {
        tour: foundTour,
        routeDestinates: foundRouteDestinates,
      },
    });
  });
  

  module.exports = { createTour, getAllTour, getTourById };
