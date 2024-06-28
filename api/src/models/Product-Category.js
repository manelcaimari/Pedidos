module.exports = function (sequelize, DataTypes) {
    const Product_Category = sequelize.define('Product_Category',
        {
            id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
            },
            name: {
            type: DataTypes.STRING,
            allowNull: false
            },
            createdAt: {
            type: DataTypes.DATE
            },
            updatedAt: {
            type: DataTypes.DATE
            }
        }, {
            sequelize,
            tableName: 'product_categories',
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
                }
            ]
        }
    )
  
    Product_Category.associate = function (models) {
     
    }
  
    return  Product_Category
}