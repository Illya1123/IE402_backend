'use strict';
const { Model, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment'); // Sử dụng thư viện moment để xử lý format ngày tháng
const sequelize = require('../../config/database');

const tour = sequelize.define(
  'tour',
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
    route_id: {
      type: DataTypes.STRING
    },
    guide_id: {
      type: DataTypes.STRING
    },
    tourName: {
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
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        // Đọc từ cơ sở dữ liệu và trả về format dd/MM/yyyy
        const rawValue = this.getDataValue('startDate');
        return rawValue ? moment(rawValue).format('DD/MM/YYYY') : null;
      },
      set(value) {
        // Chuyển từ format dd/MM/yyyy sang dạng chuẩn ISO trước khi lưu
        if (value) {
          this.setDataValue('startDate', moment(value, 'DD/MM/YYYY').toDate());
        } else {
          this.setDataValue('startDate', null);
        }
      },
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        // Đọc từ cơ sở dữ liệu và trả về format dd/MM/yyyy
        const rawValue = this.getDataValue('endDate');
        return rawValue ? moment(rawValue).format('DD/MM/YYYY') : null;
      },
      set(value) {
        // Chuyển từ format dd/MM/yyyy sang dạng chuẩn ISO trước khi lưu
        if (value) {
          this.setDataValue('endDate', moment(value, 'DD/MM/YYYY').toDate());
        } else {
          this.setDataValue('endDate', null);
        }
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    limitOfNumOfGuest: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tourType: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'tour',
    freezeTableName: true,
  }
);

tour.associate = (models) => {
  // Kết nối tới bảng `route`
  tour.belongsTo(models.route, {
    foreignKey: 'route_id',
    targetKey: 'id',
    as: 'route',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  // Kết nối tới bảng `guide`
  tour.belongsTo(models.guide, {
    foreignKey: 'guide_id',
    targetKey: 'id',
    as: 'guide',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = tour;