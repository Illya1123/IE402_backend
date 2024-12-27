const { authentication } = require('../controllers/authController');
const { getAllCustomers, getCustomerById, updateCustomerById, updateAccountById } = require('../controllers/customerController');

const router = require('express').Router();

router.route('/getAll').get(getAllCustomers);
router.route('/:id').get(authentication, getCustomerById);
router.route('/update/:id').post(authentication, updateCustomerById);
router.route('/account_update/:id').post(authentication, updateAccountById);

module.exports = router;
