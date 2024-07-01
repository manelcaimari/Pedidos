module.exports = function (sequelize, DataTypes) {
    const Return = sequelize.define('Return',
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
            customerId: {
              type: DataTypes.INTEGER,
              allowNull: false
            },
            reference: {
                type: DataTypes.STRING,
                allowNull: false
            },
            totalBasePrice: {
                type: DataTypes.DECIMAL(10, 2), 
                allowNull: false
            },
            returnDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
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
            tableName: 'returns',
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
                    name: 'returns_saleId_fk',
                    using: 'BTREE',
                    fields: [
                      { name: 'saleId' }
                    ]
                },
                {
                    name: 'returns_customerId_fk',
                    using: 'BTREE',
                    fields: [
                      { name: 'customerId' }
                    ]
                }
                  
            ]
        }
    )
  
    Return.associate = function (models) {
        Return.belongsTo(models.Sale, { as: 'sale', foreignKey: 'saleId' })
        Return.belongsTo(models.Customer, { as: 'customer', foreignKey: 'customerId' })
     
    }
  
    return Return
}