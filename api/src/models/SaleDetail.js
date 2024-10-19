module.exports = function (sequelize, DataTypes) {
  const SaleDetail = sequelize.define('SaleDetail',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      saleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Nombre".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Nombre".'
          }
        }
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Nombre".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Nombre".'
          }
        }
      },
      priceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Nombre".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Nombre".'
          }
        }
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Nombre".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Nombre".'
          }
        }
      },
      basePrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Nombre".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Nombre".'
          }
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Nombre".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Nombre".'
          }
        }
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }, {
      sequelize,
      tableName: 'sale_details',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: ['id']
        },
        {
          name: 'sale_details_saleId_fk',
          using: 'BTREE',
          fields: [
            { name: 'saleId' }
          ]
        },
        {
          name: 'sale_details_productId_fk',
          using: 'BTREE',
          fields: [
            { name: 'productId' }
          ]
        },
        {
          name: 'sale_details_priceId_fk',
          using: 'BTREE',
          fields: [
            { name: 'priceId' }
          ]
        }

      ]
    }
  )

  SaleDetail.associate = function (models) {
    SaleDetail.belongsTo(models.Sale, { as: 'sale', foreignKey: 'saleId' })
    SaleDetail.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' })
    SaleDetail.belongsTo(models.Price, { as: 'price', foreignKey: 'priceId' })
  }

  return SaleDetail
}
