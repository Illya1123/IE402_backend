const router = require('express').Router();
const {createDestination, getAllDestinations, getDestinations} = require('../controllers/destinateController');

router.route('/create').post(createDestination);
router.route('/getAll').get(getAllDestinations);
router.route('/get/:id').get(getDestinations);

module.exports = router;