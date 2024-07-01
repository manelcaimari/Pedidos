'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('returns', {
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
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'NO ACTION'
      },
      reference: {
          type: Sequelize.STRING,
          allowNull: false
      },
      totalBasePrice: {
          type: Sequelize.DECIMAL(10, 2), 
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
    await queryInterface.addIndex('returns', ['saleId'], {
      name: 'returns_saleId_index'
    })
    await queryInterface.addIndex('returns', ['customerId'], {
      name: 'returns_customerId_index'
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('returns')
  }
}