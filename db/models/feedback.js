'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment'); // Sử dụng thư viện moment để xử lý format ngày tháng
const sequelize = require('../../config/database');

const feedback = sequelize.define(
  'feedback',
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
    rate: {
      type: DataTypes.ENUM('0', '1', '2', '3', '4', '5'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'rating cannot be null',
        },
        notEmpty: {
          msg: 'rating cannot be empty',
        },
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    feedbackDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        // Đọc từ cơ sở dữ liệu và trả về format dd/MM/yyyy
        const rawValue = this.getDataValue('feedbackDate');
        return rawValue ? moment(rawValue).format('DD/MM/YYYY') : null;
      },
      set(value) {
        // Chuyển từ format dd/MM/yyyy sang dạng chuẩn ISO trước khi lưu
        if (value) {
          this.setDataValue('feedbackDate', moment(value, 'DD/MM/YYYY').toDate());
        } else {
          this.setDataValue('feedbackDate', null);
        }
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
    paranoid: true,
    modelName: 'Feedback',
    freezeTableName: true,
  }
);

feedback.associate = (models) => {
  feedback.belongsTo(models.customer, {
    foreignKey: 'customer_id',
    targetKey: 'id',
    as: 'customer',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  feedback.belongsTo(models.tour, {
    foreignKey: 'tour_id',
    targetKey: 'id',
    as: 'tour',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = feedback;