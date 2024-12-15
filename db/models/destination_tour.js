'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const DestinationTour = sequelize.define(
  'DestinationTour',
  {
    destination_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'destination',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    tour_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'tour',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    visitOrder: {
      type: DataTypes.STRING,
    },
    stayDuration: {
      type: DataTypes.FLOAT,
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
    modelName: 'DestinationTour',
    freezeTableName: true,
  }
);

DestinationTour.associate = (models) => {
  // Kết nối tới bảng `destination`
  DestinationTour.belongsTo(models.destination, {
    foreignKey: 'destination_id',
    targetKey: 'id',
    as: 'destination',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // Kết nối tới bảng `tour`
  DestinationTour.belongsTo(models.tour, {
    foreignKey: 'tour_id',
    targetKey: 'id',
    as: 'tour',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = DestinationTour;