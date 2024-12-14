'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../../config/database');
const AppError = require('../../utils/appError').default;

const user = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            defaultValue: uuidv4,
            validate: {
                notNull: {
                    msg: 'ID cannot be null',
                },
                notEmpty: {
                    msg: 'ID cannot be empty',
                },
            },
        },
        userType: {
            type: DataTypes.ENUM('0', '1', '2', '3'),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'firstName cannot be null',
                },
                notEmpty: {
                    msg: 'firstName cannot be empty',
                },
            },
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'firstName cannot be null',
                },
                notEmpty: {
                    msg: 'firstName cannot be empty',
                },
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'lastName cannot be null',
                },
                notEmpty: {
                    msg: 'lastName cannot be empty',
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'email cannot be null',
                },
                notEmpty: {
                    msg: 'email cannot be empty',
                },
                isEmail: {
                    msg: 'Invalid email id',
                },
            },
        },
        sdt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'password cannot be null',
                },
                notEmpty: {
                    msg: 'password cannot be empty',
                },
            },
        },
        confirmPassword: {
            type: DataTypes.VIRTUAL,
            set(value) {
                if (this.password.length < 8) {
                    throw new AppError('Password length must be grater than 8', 400);
                }
                if (value === this.password) {
                    const hashPassword = bcrypt.hashSync(value, 10);
                    this.setDataValue('password', hashPassword);
                } else {
                    throw new AppError('Password and confirm password must be the same', 400);
                }
            },
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
    },
    {
        paranoid: true,
        freezeTableName: true,
        modelName: 'user',
    },
);

// Định nghĩa quan hệ (associations)
user.associate = (models) => {
    user.hasMany(models.customer, {
        foreignKey: 'userId', // Khóa ngoại trong bảng customer
        sourceKey: 'id', // Khóa chính trong bảng user
        as: 'customers', // Alias để truy xuất khách hàng liên quan
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });

    user.hasMany(models.customer, {
        foreignKey: 'userType', // Khóa ngoại trong bảng customer
        sourceKey: 'userType', // Cột trong bảng user
        as: 'customerTypes', // Alias để truy xuất khách hàng theo loại
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = user;
