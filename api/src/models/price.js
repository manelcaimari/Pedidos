module.exports = function (sequelize, DataTypes) {
  const Price = sequelize.define('Price',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Producto".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Producto".'
          }
        }
      },
      basePrice: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "base".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "base".'
          }
        }
      },
      current: {
        type: DataTypes.BOOLEAN,
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
      tableName: 'prices',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'id' }
          ]
        },
        {
          name: 'prices_productId_fk',
          using: 'BTREE',
          unique: true,
          fields: [
            { name: 'productId' }
          ]
        }
      ]
    }
  )

  Price.associate = function (models) {
    Price.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' })
  }

  return Price
}
