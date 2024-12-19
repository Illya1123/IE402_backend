const { getAllCustomers } = require('../controllers/customerController');

const router = require('express').Router();

router.route('/getAll').get(getAllCustomers);

module.exports = router;
