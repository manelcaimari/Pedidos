module.exports = function (sequelize, DataTypes) {
  const Product = sequelize.define('Product',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      productCategoryId: {
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
      name: {
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
      reference: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "refencia".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "refencia".'
          }
        }
      },
      units: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "unidad".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "unidad".'
          }
        }
      },
      measurementUnit: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Unidad de Medida".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Unidad de Medida".'
          }
        }
      },
      measurement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Medida".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Medida".'
          }
        }
      },
      visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Visible".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Visible".'
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
      tableName: 'products',
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
          name: 'products_productCategoryId_fk',
          using: 'BTREE',
          fields: [
            { name: 'productCategoryId' }
          ]
        }
      ]
    }
  )

  Product.associate = function (models) {
    Product.belongsTo(models.ProductCategory, { as: 'productCategory', foreignKey: 'productCategoryId' })
    Product.hasMany(models.SaleDetail, { as: 'saledetails', foreignKey: 'productId' })
    Product.hasMany(models.Price, { as: 'prices', foreignKey: 'productId' })
  }

  return Product
}
