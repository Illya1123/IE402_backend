const { Sequelize } = require('sequelize');
const user = require('../db/models/user');
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

module.exports = { getAllUser, getUser };