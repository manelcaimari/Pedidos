'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false
      },
      units: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      measurementUnit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      measurement: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false
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
    await queryInterface.addIndex('products', ['productCategoryId'], {
      name: 'products_productCategoryId_index'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products')
  }
}