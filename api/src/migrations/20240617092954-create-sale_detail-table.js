'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sale_details', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      saleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sales',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      priceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'prices',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      basePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex('sale_details', ['saleId'], {
      name: 'sale_details_saleId_index'
    })
    await queryInterface.addIndex('sale_details', ['productId'], {
      name: 'sale_details_productId_index'
    })
    await queryInterface.addIndex('sale_details', ['priceId'], {
      name: 'sale_details_priceId_index'
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sale_details')
  }
}