const { authentication } = require('../controllers/authController');
const { getAllCustomers, getCustomerById } = require('../controllers/customerController');

const router = require('express').Router();

router.route('/getAll').get(getAllCustomers);
router.route('/:id').get(authentication, getCustomerById);

module.exports = router;
