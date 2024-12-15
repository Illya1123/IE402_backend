'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedback', {
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
      customer_id: {
        type: Sequelize.STRING
      },
      tour_id: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      feedbackDate: {
        type: Sequelize.DATE
      },
      rate: {
        type: Sequelize.ENUM('0', '1', '2', '3', '4', '5')
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
    await queryInterface.addConstraint('feedback', {
      fields: ['customer_id'],
      type: 'foreign key',
      name: 'fk_feedback_customer',
      references: {
        table: 'customer',
        fields: ['id'],
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('feedback', {
      fields: ['tour_id'],
      type: 'foreign key',
      name: 'fk_feedback_tour',
      references: {
        table: 'tour',
        fields: ['id'],
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('feedback', 'fk_feedback_customer');
    await queryInterface.removeConstraint('feedback', 'fk_feedback_tour');
    await queryInterface.dropTable('feedback');
  }
};