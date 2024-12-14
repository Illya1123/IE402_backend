'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment'); // Sử dụng thư viện moment để xử lý format ngày tháng
const sequelize = require('../../config/database');

const staff = sequelize.define(
  'staff',
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'role cannot be null',
        },
        notEmpty: {
          msg: 'role cannot be empty',
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
    paranoid: true,
    modelName: 'staff',
    freezeTableName: true,
  }
);

staff.associate = (models) => {
  staff.belongsTo(models.user, {
    foreignKey: 'userId',
    targetKey: 'id',
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = staff;