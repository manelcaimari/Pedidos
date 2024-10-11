module.exports = function (sequelize, DataTypes) {
  const ReturnOrder = sequelize.define('ReturnOrder', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    returnId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "returnId".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "returnId".'
        }
      }
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "productName".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "productName".'
        }
      }
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "basePrice".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "basePrice".'
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "quantity".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "quantity".'
        }
      }
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "reference".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "reference".'
        }
      }
    },
    returnDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor, rellena el campo "returnDate".'
        },
        notEmpty: {
          msg: 'Por favor, rellena el campo "returnDate".'
        }
      }
    },
    returnTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'return_orders',
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
        name: 'return_orders_returnId_fk',
        using: 'BTREE',
        fields: [
          { name: 'returnId' }
        ]
      }
    ]
  })

  ReturnOrder.associate = function (models) {
    ReturnOrder.belongsTo(models.Return, { as: 'return', foreignKey: 'returnId' })
  }

  return ReturnOrder
}
