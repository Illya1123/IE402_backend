const router = require('express').Router();
const {createDestination, getAllDestinations, getDestinations, createMultipleDestinations} = require('../controllers/destinateController');

router.route('/create').post(createDestination);
router.route('/getAll').get(getAllDestinations);
router.route('/get/:id').get(getDestinations);
router.route('/create-multiple').post(createMultipleDestinations);

module.exports = router;