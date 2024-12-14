'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer', {
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
      userId: {
        type: Sequelize.STRING
      },
      birthdate: {
        type: Sequelize.DATE
      },
      address: {
        type: Sequelize.STRING
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
    await queryInterface.addConstraint('customer', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_customer_user', // Tên ràng buộc
      references: {
        table: 'user', // Tên bảng `user`
        fields: ['id'], // Các cột trong bảng `users`
      },
      onDelete: 'CASCADE', // Xóa customer nếu user bị xóa
      onUpdate: 'CASCADE',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customer');
  }
};