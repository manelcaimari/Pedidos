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
                allowNull: false
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            priceId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            productName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            basePrice: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
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
               
            ]
        }
    );

    SaleDetail.associate = function (models) {
     
    }
  
    return SaleDetail
}