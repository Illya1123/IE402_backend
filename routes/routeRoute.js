const router = require('express').Router();
const { createRoute, getAllRoutes, getRoute } = require('../controllers/routeController');
const { createRouteDestinate, getRouteDestinate, getAllRouteDestinate} = require('../controllers/routeDestinateController');

router.route('/create-route').post(createRoute);
router.route('/get-all-routes').get(getAllRoutes);
router.route('/get-route/:id').get(getRoute);
router.route('/:route_id/destinations').post(createRouteDestinate);
router.route('/:route_id/destinations').get(getRouteDestinate);
router.route('/get-all-route-destinations').get(getAllRouteDestinate);

module.exports = router;