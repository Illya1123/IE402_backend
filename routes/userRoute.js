const { authentication, restrictTo, changePassword, updateUser } = require('../controllers/authController');
const { getAllUser, getUser } = require('../controllers/userController');

const router = require('express').Router();

router.route('/').get(authentication, restrictTo('0'), getAllUser);
router.route('/:id').get(authentication, restrictTo('1'), getUser);
router.patch('/change-password', authentication, changePassword);
router.patch('/update-profile', authentication, updateUser);

module.exports = router;