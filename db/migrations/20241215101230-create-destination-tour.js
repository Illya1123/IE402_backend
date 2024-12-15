'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('destination_tour', {
      destination_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'destination',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tour_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'tour',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      visitOrder: {
        type: Sequelize.STRING
      },
      stayDuration: {
        type: Sequelize.FLOAT
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
    await queryInterface.addConstraint('destination_tour', {
      fields: ['destination_id', 'tour_id'],
      type: 'primary key',
      name: 'destination_tour_pkey',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('destination_tour', 'destination_tour_pkey');
    await queryInterface.dropTable('destination_tour');
  }
};