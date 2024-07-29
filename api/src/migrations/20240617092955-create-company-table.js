'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      commercialAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fiscalAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      commercialName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fiscalName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vatNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('companies')
  }
}
