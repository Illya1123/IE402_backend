const { authentication, restrictTo, changePassword, updateUser } = require('../controllers/authController');
const { getAllUser, getAllUserByUserType , getUser } = require('../controllers/userController');

const router = require('express').Router();

router.route('/').get(authentication, restrictTo('0'), getAllUser);
router.route('/:id').get(authentication, getUser);
router.route('/filter/:userType').get(authentication, restrictTo('0'), getAllUserByUserType);
router.patch('/change-password', authentication, changePassword);
router.patch('/update-profile', authentication, updateUser);
router.route('/getUser/:userType').get(getAllUserByUserType);

module.exports = router;