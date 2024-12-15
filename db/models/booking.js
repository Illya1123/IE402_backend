'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment'); // Sử dụng thư viện moment để xử lý format ngày tháng
const sequelize = require('../../config/database');

const booking = sequelize.define(
  'booking',
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
    tour_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'tour_id cannot be null',
        },
        notEmpty: {
          msg: 'tour_id cannot be empty',
        },
      },
    },
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'customer_id cannot be null',
        },
        notEmpty: {
          msg: 'customer_id cannot be empty',
        },
      },
    },
    bookingHour: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        // Đọc từ cơ sở dữ liệu và trả về format dd/MM/yyyy
        const rawValue = this.getDataValue('bookingDate');
        return rawValue ? moment(rawValue).format('DD/MM/YYYY') : null;
      },
      set(value) {
        // Chuyển từ format dd/MM/yyyy sang dạng chuẩn ISO trước khi lưu
        if (value) {
          this.setDataValue('bookingDate', moment(value, 'DD/MM/YYYY').toDate());
        } else {
          this.setDataValue('bookingDate', null);
        }
      },
    },
    numberOfGuest: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'numberOfGuest cannot be null',
        },
        notEmpty: {
          msg: 'numberOfGuest cannot be empty',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'status cannot be null',
        },
        notEmpty: {
          msg: 'status cannot be empty',
        },
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
    modelName: 'booking',
    freezeTableName: true,
    paranoid: true,
  }
);

booking.associate = (models) => {
  booking.belongsTo(models.tour, {
    foreignKey: 'tour_id',
    targetKey: 'id',
    as: 'tour',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
  booking.belongsTo(models.customer, {
    foreignKey: 'customer_id',
    targetKey: 'id',
    as: 'customer',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
};

module.exports = booking;