'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment'); // Sử dụng thư viện moment để xử lý format ngày tháng
const sequelize = require('../../config/database');

const guide = sequelize.define(
  'guide',
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
    language: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'guide',
    freezeTableName: true,
  }
);

guide.associate = (models) => {
  guide.belongsTo(models.user, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = guide;