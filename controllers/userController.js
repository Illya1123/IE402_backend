const { Sequelize } = require('sequelize');
const user = require('../db/models/user');
const customer = require('../db/models/customer');
const staff = require('../db/models/staff');
const guide = require('../db/models/guide');

const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllUser = catchAsync(async (req, res, next) => {
    const users = await user.findAndCountAll({
        where: {
            userType: {
                [Sequelize.Op.ne]: '0',
            },
        },
        attributes: { exclude: ['password'] },
    });
    return res.status(200).json({
        status: 'success',
        data: users,
    });
});

const getAllUserByUserType = catchAsync(async (req, res, next) => {
    const { userType } = req.params;

    if (!userType) {
        return next(new AppError('userType is required', 400));
    }

    const users = await user.findAndCountAll({
        where: { userType },
        attributes: { exclude: ['password'] },
    });

    if (!users.count) {
        return res.status(404).json({
            status: 'fail',
            message: 'No users found for the given userType',
        });
    }

    const detailedUsers = await Promise.all(
        users.rows.map(async (u) => {
            let extraInfo = null;

            switch (String(u.userType)) {
                case '1':
                    extraInfo = await customer.findOne({ where: { userId: u.id } });
                    break;
                case '2':
                    extraInfo = await guide.findOne({ where: { userId: u.id } });
                    break;
                case '3':
                    extraInfo = await staff.findOne({ where: { userId: u.id } });
                    break;
                default:
                    break;
            }

            return {
                ...u.toJSON(),
                extraInfo,
            };
        })
    );

    return res.status(200).json({
        status: 'success',
        data: {
            count: users.count,
            rows: detailedUsers,
        },
    });
});



const getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundUser = await user.findOne({
        where: {
            id
        },
        attributes: { exclude: ['password'] },
    });
    if (!foundUser) {
        return next(new AppError('User not found', 404));
    }
    return res.status(200).json({
        status: 'success',
        data: foundUser,
    });
});

module.exports = { getAllUser, getAllUserByUserType , getUser };