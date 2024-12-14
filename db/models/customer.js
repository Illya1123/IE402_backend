'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment'); // Sử dụng thư viện moment để xử lý format ngày tháng
const sequelize = require('../../config/database');

const customer = sequelize.define(
    'customer',
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
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'userId cannot be null',
                },
                notEmpty: {
                    msg: 'userId cannot be empty',
                },
            },
        },
        birthdate: {
            type: DataTypes.DATE,
            allowNull: true,
            get() {
                // Đọc từ cơ sở dữ liệu và trả về format dd/MM/yyyy
                const rawValue = this.getDataValue('birthdate');
                return rawValue ? moment(rawValue).format('DD/MM/YYYY') : null;
            },
            set(value) {
                // Chuyển từ format dd/MM/yyyy sang dạng chuẩn ISO trước khi lưu
                if (value) {
                    this.setDataValue('birthdate', moment(value, 'DD/MM/YYYY').toDate());
                } else {
                    this.setDataValue('birthdate', null);
                }
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'address cannot be null',
                },
                notEmpty: {
                    msg: 'address cannot be empty',
                },
            },
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
        },
        deletedAt: {
            type: DataTypes.DATE,
        },
    },
    {
        modelName: 'customer',
        paranoid: true,
        freezeTableName: true,
    }
);

// Định nghĩa quan hệ (associations)
customer.associate = (models) => {
    customer.belongsTo(models.user, {
        foreignKey: 'userId', // Khóa ngoại trong bảng customer
        targetKey: 'id', // Khóa chính trong bảng user
        as: 'user', // Alias để truy xuất dữ liệu liên quan
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    });
};

module.exports = customer;
