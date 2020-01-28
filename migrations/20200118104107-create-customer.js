'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('customers', {
      no: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      id:{
        allowNull:false,
        primaryKey: true,
        type:Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      register_date: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('customers');
  }
};