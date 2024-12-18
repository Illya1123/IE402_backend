'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tour', {
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
      route_id: {
        type: Sequelize.STRING,
      },
      guide_id: {
        type: Sequelize.STRING
      },
      tourName: {
        type: Sequelize.STRING
      },
      img: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      price: {
        type: Sequelize.FLOAT
      },
      limitOfNumOfGuest: {
        type: Sequelize.INTEGER
      },
      tourType: {
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
    // Add foreign key for route_id
    await queryInterface.addConstraint('tour', {
      fields: ['route_id'],
      type: 'foreign key',
      name: 'fk_tours_route', // Tên ràng buộc
      references: {
        table: 'route', // Tên bảng Routes
        field: 'id', // Cột của bảng Routes
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Add foreign key for guide_id
    await queryInterface.addConstraint('tour', {
      fields: ['guide_id'],
      type: 'foreign key',
      name: 'fk_tours_guide', // Tên ràng buộc
      references: {
        table: 'guide', // Tên bảng Guides
        field: 'id', // Cột của bảng Guides
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('tour', 'fk_tours_route');
    await queryInterface.removeConstraint('tour', 'fk_tours_guide');
    await queryInterface.dropTable('tour');
  }
};