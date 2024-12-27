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

const getCustomerById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundCustomer = await customer.findOne({
        where: {
            userId: id,
        },
        attributes: { exclude: ['password'] },
    });

    if (!foundCustomer) {
        return next(new AppError('Customer not found', 404));
    }

    return res.status(200).json({
        status: 'success',
        data: foundCustomer,
    });
});

const moment = require('moment-timezone');
const updateCustomerById = catchAsync(async (req, res, next) => {    
    try {
        const { id } = req.params;
        const item = req.body;

        const fullName = item['full-name'];
        
        // Data for updating user
        const firstName = fullName.split(' ').slice(1).join(' ');
        const lastName = fullName.split(' ')[0];
        
        // Data for updating customer
        const birthdate = item['birth-date'];
        const address = item['address'];

        const birthdateTimestamp = moment(birthdate, 'YYYY/MM/DD').toDate();

        // Update user
        const updatedUser = await user.update(
            { firstName, lastName },
            { where: { id } }
        );

        if (!updatedUser[0]) {
            return next(new AppError('Không tìm thấy khách hàng cần cập nhật', 404));
        }

        // Update customer
        const updatedCustomer = await customer.update(
            { birthdate: birthdateTimestamp, address },
            { where: { userId: id } }
        );
      
        if (!updatedCustomer[0]) {
            return next(new AppError('Không tìm thấy khách hàng cần cập nhật', 404));
        }
      
        return res.status(200).json({
            status: 'success',
            message: 'Thông tin cập nhật thành công!',
        });
    } catch (error) {
        console.error("Error during update:", err);
        return next(new AppError("An error occurred during the update.", 500));
    };
});

const { Op } = require('sequelize');
const updateAccountById = catchAsync(async (req, res, next) => {    
    try {
        const { id } = req.params;
        const item = req.body;        
        
        // Data for updating user
        const email = item['email'];
        const sdt = item['phone'];        

        // Check duplicate for email
        const existingEmail = await user.findOne({
            where: { 
                email,
                id: { [Op.ne]: id }
            }
        });
        if (existingEmail) {
            return next(new AppError('Email đã tồn tại. Vui lòng chọn email khác.', 400));
        }

        // Check duplicate for phone number
        const existingPhone = await user.findOne({
            where: { 
                sdt,
                id: { [Op.ne]: id }
            }
        });

        if (existingPhone) {
            return next(new AppError('Số điện thoại đã tồn tại. Vui lòng chọn số điện thoại khác.', 400));
        }

        // Update user
        const updatedUser = await user.update(
            { email, sdt },
            { where: { id } }
        );

        if (!updatedUser[0]) {
            return next(new AppError('Không tìm thấy khách hàng cần cập nhật', 404));
        }
      
        return res.status(200).json({
            status: 'success',
            message: 'Tài khoản cập nhật thành công!',
        });
    } catch (error) {
        console.error("Error during update:", err);
        return next(new AppError("An error occurred during the update.", 500));
    };
});

module.exports = { getAllCustomers, getCustomerById, updateCustomerById, updateAccountById };
