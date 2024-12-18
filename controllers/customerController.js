const customer = require('../db/models/customer');
const user = require('../db/models/user');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllCustomers = catchAsync(async (req, res, next) => {
    const customers = await customer.findAll();
    if (!customers || customers.length === 0) {
        return next(new AppError('No customers found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: customers,
    });
});

module.exports = { getAllCustomers };
