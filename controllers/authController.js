const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const user = require('../db/models/user');
const customer = require('../db/models/customer');
const guide = require('../db/models/guide');
const staff = require('../db/models/staff');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Multer Configuration for File Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/avatars'); // Thư mục lưu ảnh avatar
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `avatar-${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new AppError('Only .png, .jpg, and .jpeg format allowed!', 400), false);
        }
    },
});

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
        avatar: body.avatar || null,
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
        user_id: result.id,
        user_type: result.userType,
        token,
    });
});

const authentication = catchAsync(async (req, res, next) => {
    let idToken = '';
    console.log(req.body);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        idToken = req.headers.authorization.split(' ')[1];
    }
    console.log("Token: ", idToken);
    if (!idToken) {
        return next(new AppError('Please login to get access', 401));
    }
    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

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

const changePassword = catchAsync(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new AppError('Please provide both old and new passwords', 400));
    }

    const currentUser = req.user; 
    const userId = currentUser.id;

    const foundUser = await user.findByPk(userId);
    if (!foundUser) {
        return next(new AppError('User not found', 404));
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, foundUser.password);
    if (!isPasswordCorrect) {
        return next(new AppError('Old password is incorrect', 401));
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    foundUser.password = hashedNewPassword;
    await foundUser.save();

    return res.status(200).json({
        status: 'success',
        message: 'Password changed successfully',
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { firstName, lastName, sdt, address, birthdate } = req.body;

    const currentUser = req.user; 
    const userId = currentUser.id;

    const foundUser = await user.findByPk(userId);
    if (!foundUser) {
        return next(new AppError('User not found', 404));
    }

    if (firstName !== undefined) foundUser.firstName = firstName;
    if (lastName !== undefined) foundUser.lastName = lastName;
    if (sdt !== undefined) foundUser.sdt = sdt;
    if (address !== undefined) foundUser.address = address;
    if (birthdate !== undefined) foundUser.birthdate = birthdate;

    await foundUser.save();

    const updatedUser = foundUser.toJSON();
    delete updatedUser.password;

    return res.status(200).json({
        status: 'success',
        data: updatedUser,
    });
});

module.exports = { signup, login, authentication, restrictTo, changePassword, updateUser };
