const router = require('express').Router();
const {signup, login} = require('../controllers/authController');

router.route('/signup').post(signup);
router.route('/login').post(login);

module.exports = router; 