'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking', {
      id: {
        type: Sequelize.STRING,
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
        type: Sequelize.STRING
      },
      customer_id: {
        type: Sequelize.STRING
      },
      numberOfGuest: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('booking', {
      fields: ['tour_id'],
      type: 'foreign key',
      name: 'fk_booking_tour', // Tên ràng buộc
      references: {
        table: 'tour', // Tên bảng `tour`
        fields: ['id'], // Các cột trong bảng `tour`
      },
      onDelete: 'CASCADE', // Xóa booking nếu tour bị xóa
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('booking', {
      fields: ['customer_id'],
      type: 'foreign key',
      name: 'fk_booking_customer', // Tên ràng buộc
      references: {
        table: 'customer', // Tên bảng `customer`
        fields: ['id'], // 
      },
      onDelete: 'CASCADE', // Xóa booking nếu customer bị xóa
      onUpdate: 'CASCADE',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('booking', 'fk_booking_tour');
    await queryInterface.removeConstraint('booking', 'fk_booking_customer');
    await queryInterface.dropTable('booking');
  }
};