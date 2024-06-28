module.exports = function (sequelize, DataTypes) {
    const User_reset_password_token = sequelize.define('User_reset_password_token',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            userld: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false
            },
            expirationDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            used : {
                type: DataTypes.BOOLEAN,
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
            tableName: 'user_reset_password_tokens',
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
  
    User_reset_password_token.associate = function (models) {
     
    }
  
    return User_reset_password_token
}