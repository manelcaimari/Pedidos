module.exports = function (sequelize, DataTypes) {
  const ReturnDetail = sequelize.define('ReturnDetail', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    returnId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'returns',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    priceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'prices',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    saledetailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'saledetails',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'return_details',
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
        name: 'return_details_returnId_fk',
        using: 'BTREE',
        fields: [
          { name: 'returnId' }
        ]
      }
    ]
  })

  ReturnDetail.associate = function (models) {
    ReturnDetail.belongsTo(models.Return, { as: 'return', foreignKey: 'returnId' })
    ReturnDetail.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' })
    ReturnDetail.belongsTo(models.Price, { as: 'price', foreignKey: 'priceId' })
    ReturnDetail.belongsTo(models.SaleDetail, { as: 'saleDetail', foreignKey: 'saledetailId' })
  }

  return ReturnDetail
}
