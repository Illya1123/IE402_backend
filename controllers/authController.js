const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const user = require('../db/models/user');
const customer = require('../db/models/customer');
const guide = require('../db/models/guide');
const staff = require('../db/models/staff');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const signup = catchAsync(async (req, res, next) => {
    const body = req.body;

    if (!['0', '1', '2', '3'].includes(body.userType)) {
        return next(new AppError('Invalid user type', 400));
    }

    // Check if the email already exists in the database
    const existingUser = await user.findOne({ where: { email: body.email } });
    if (existingUser) {
        return next(new AppError('Email is already in use', 400));
    }

    // Create a new user if the email does not exist
    const newUser = await user.create({
        userType: body.userType,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        sdt: body.sdt,
        password: body.password,
        confirmPassword: body.confirmPassword,
    });

    if (!newUser) {
        return next(new AppError('Failed to create the user', 400));
    }

    if (body.userType === '1') {
        const customerInfo = {
            userId: newUser.id,
            birthdate: body.birthdate || null,
            address: body.address || '',
        };

        const newCustomer = await customer.create(customerInfo);

        if (!newCustomer) {
            return next(new AppError('Failed to create the customer information', 400));
        }
    }

    if (body.userType === '2') {
        const guideInfo = {
            userId: newUser.id,
            birthdate: body.birthdate || null,
            language: body.language || '',
        };

        const newGuide = await guide.create(guideInfo);

        if (!newGuide) {
            return next(new AppError('Failed to create the guide information', 400));
        }
    }

    if (body.userType === '3') {
        const staffInfo = {
            userId: newUser.id,
            role: body.role || '',
        };

        const newStaff = await staff.create(staffInfo);

        if (!newStaff) {
            return next(new AppError('Failed to create the staff information', 400));
        }
    }

    const result = newUser.toJSON();

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id: result.id,
    });

    return res.status(201).json({
        status: 'success',
        data: result,
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const result = await user.findOne({ where: { email } });
    if (!result || !(await bcrypt.compare(password, result.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = generateToken({
        id: result.id,
    });

    return res.json({
        status: 'success',
        account_name: result.lastName + ' ' + result.firstName,
        user_type: result.userType,
        token,
    });
});

const authentication = catchAsync(async (req, res, next) => {
    // 1. get the token from headers
    let idToken = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Bearer asfdasdfhjasdflkkasdf
        idToken = req.headers.authorization.split(' ')[1];
    }
    if (!idToken) {
        return next(new AppError('Please login to get access', 401));
    }
    // 2. token verification
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);
    // 3. get the user detail from db and add to req object
    const freshUser = await user.findByPk(tokenDetail.id);

    if (!freshUser) {
        return next(new AppError('User no longer exists', 400));
    }
    req.user = freshUser;
    return next();
});

const restrictTo = (...userType) => {
    const checkPermission = (req, res, next) => {
        if (!userType.includes(req.user.userType)) {
            return next(new AppError("You don't have permission to perform this action", 403));
        }
        return next();
    };

    return checkPermission;
};

module.exports = { signup, login, authentication, restrictTo };
