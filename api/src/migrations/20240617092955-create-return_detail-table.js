'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('return_details', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      returnId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'returns',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      priceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'prices',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      saledetailId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sale_details',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addIndex('return_details', ['returnId'], {
      name: 'return_details_returnId_index'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('return_details')
  }
}
