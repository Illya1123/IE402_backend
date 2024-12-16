const router = require('express').Router();
const {createDestination} = require('../controllers/destinateController');

router.route('/create').post(createDestination);

module.exports = router;