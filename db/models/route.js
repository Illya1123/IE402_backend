'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../../config/database');

const route = sequelize.define(
  'route',
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name cannot be null',
        },
        notEmpty: {
          msg: 'Name cannot be empty',
        },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startLongitude: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Start Longitude cannot be null',
        },
        notEmpty: {
          msg: 'Start Longitude cannot be empty',
        },
      },
    },
    endLatitude: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'End Latitude cannot be null',
        },
        notEmpty: {
          msg: 'End Latitude cannot be empty',
        },
      },
    },
    length: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Length cannot be null',
        },
        notEmpty: {
          msg: 'Length cannot be empty',
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
    modelName: 'route',
    freezeTableName: true,
  }
);

module.exports = route;