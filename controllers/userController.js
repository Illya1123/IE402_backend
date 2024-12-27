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


const fs = require('fs');
const path = require('path');

const getUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundUser = await user.findOne({
        where: {
            id
        }
    });
    
    console.log(foundUser);
    if (!foundUser) {
        return next(new AppError('User not found', 404));
    }

    if (foundUser.avatar) {
        try {        
            const avatarPath = path.join(__dirname, '..', foundUser.avatar);
            
            const avatarBuffer = fs.readFileSync(avatarPath);
            const avatarBase64 = avatarBuffer.toString('base64');
            
            
            foundUser.avatar = `${avatarBase64}`;
        } catch (error) {
            console.error('Error reading avatar file:', error);            
            foundUser.avatar = 'data:image/png;base64,defaultBase64String';
        }
    }
    
    return res.status(200).json({
        status: 'success',
        data: foundUser,
    });
});


const formidable = require("formidable");
const updateAvatar = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '..', 'uploads');
    form.keepExtensions = true;
    
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            return next(new AppError('Error parsing the form', 500));
        }

        console.log('Fields:', fields);
        console.log('Files:', files);

        if (files.avatar) {
            const file = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;
            
            const extension = path.extname(file.originalFilename);
            const newFileName = `${id}${extension}`;

            const newFilePath = path.join(__dirname, '..', 'uploads', newFileName);

            fs.rename(file.filepath, newFilePath, async (renameErr) => {
                if (renameErr) {
                    console.error('Error renaming file:', renameErr);
                    return next(new AppError('Error saving the file', 500));
                }
                
                //  Save image path to postgreSQL
                const relativeFilePath = path.join('uploads', newFileName); 
                const foundUser = await user.findOne({ where: { id } });
                if (!foundUser) {
                    return next(new AppError('User not found', 404));
                }

                foundUser.avatar = relativeFilePath;  // Save image to field 'avatar'
                await foundUser.save();

                // Return message
                return res.status(200).json({
                    status: 'success',
                    message: 'Avatar uploaded successfully',
                    avatar: newFileName,
                });
            });
        } else {
            return next(new AppError('No avatar file uploaded', 400));
        }
    });

});

module.exports = { getAllUser, getAllUserByUserType , getUser, updateAvatar };
