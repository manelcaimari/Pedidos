'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('return_orders', {
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
      basePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        }
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: false
      },
      returnDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      returnTime: {
        type: Sequelize.TIME,
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

    await queryInterface.addIndex('return_orders', ['returnId'], {
      name: 'return_orders_returnId_index'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('return_orders')
  }
}
