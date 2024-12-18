'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RouteDestinate', {
      route_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'route',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      destinate_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'destination',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.STRING
      },
      latitude: {
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
    await queryInterface.addConstraint('RouteDestinate', {
      fields: ['route_id', 'destinate_id'],
      type: 'primary key',
      name: 'route_destinate_pkey',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('RouteDestinate', 'route_destinate_pkey');
    await queryInterface.dropTable('RouteDestinate');
  }
};