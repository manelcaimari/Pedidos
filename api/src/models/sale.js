module.exports = function (sequelize, DataTypes) {
    const Sale = sequelize.define('Sale',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
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
            saleDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            saleTime: {
                type: DataTypes.TIME,
                allowNull: true 
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        }, {
            sequelize,
            tableName: 'sales',
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

    Sale.associate = function (models) {
     
    }
  
    return Sale
}