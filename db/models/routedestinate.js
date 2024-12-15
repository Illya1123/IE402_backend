'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const RouteDestinate = sequelize.define(
  'RouteDestinate',
  {
    route_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'route',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    destinate_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'destination',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    longitude: {
      type: DataTypes.STRING
    },
    latitude: {
      type: DataTypes.STRING
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
    modelName: 'RouteDestinate',
    freezeTableName: true,
  }
);

RouteDestinate.associate = (models) => {
  // Kết nối tới bảng `route`
  RouteDestinate.belongsTo(models.route, {
    foreignKey: 'route_id',
    targetKey: 'id',
    as: 'route',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // Kết nối tới bảng `destination`
  RouteDestinate.belongsTo(models.destination, {
    foreignKey: 'destinate_id',
    targetKey: 'id',
    as: 'destination',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = RouteDestinate;