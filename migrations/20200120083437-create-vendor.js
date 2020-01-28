'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vendors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      no: {
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      date_register: {
        type: Sequelize.DATE
      },
      service_type: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.BIGINT
      },
      contact_name: {
        type: Sequelize.STRING
      },
      contact_number: {
        type: Sequelize.BIGINT
      },
      contact_email: {
        type: Sequelize.STRING
      },
      contact_position: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('vendors');
  }
};