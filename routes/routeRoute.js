const router = require('express').Router();
const { createRoute, getAllRoutes, getRoute } = require('../controllers/routeController');
const { createRouteDestinate} = require('../controllers/routeDestinateController');

router.route('/create-route').post(createRoute);
router.route('/get-all-routes').get(getAllRoutes);
router.route('/get-route/:id').get(getRoute);
router.route('/:route_id/destinations').post(createRouteDestinate);

module.exports = router;