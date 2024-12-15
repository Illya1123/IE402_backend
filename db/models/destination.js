'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../../config/database');

const destination = sequelize.define(
  'destination',
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
    openHour: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    closeHour: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rate: {
      type: DataTypes.ENUM('0', '1', '2', '3', '4', '5'),
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Latitude cannot be null',
        },
        notEmpty: {
          msg: 'Latitude cannot be empty',
        },
      },
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Longitude cannot be null',
        },
        notEmpty: {
          msg: 'Longitude cannot be empty',
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
    freezeTableName: true,
    paranoid: true,
    modelName: 'destination',
  }
);

module.exports = destination;