module.exports = function (sequelize, DataTypes) {
    const CustomerCredential = sequelize.define('CustomerCredential',
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
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastPasswodChange: {
                type: DataTypes.DATE,
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
            tableName: 'customer_credentials',
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
  
    CustomerCredential.associate = function (models) {
     
    }
  
    return CustomerCredential
}