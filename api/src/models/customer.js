module.exports = function (sequelize, DataTypes) {
  const Customer = sequelize.define('Customer',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
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
      email: {
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
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }, {
      sequelize,
      tableName: 'customers',
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

  Customer.associate = function (models) {
    Customer.hasMany(models.CustomerActivationToken, { as: 'customerActivationTokens', foreignKey: 'customerId' })
    Customer.hasMany(models.Fingerprint, { as: 'fingerprints', foreignKey: 'customerId' })
    Customer.hasMany(models.CustomerCredential, { as: 'customerCredentials', foreignKey: 'customerId' })
    Customer.hasMany(models.CustomerResetPasswordToken, { as: 'customerResetPasswordTokens', foreignKey: 'customerId' })
    Customer.hasMany(models.Return, { as: 'returns', foreignKey: 'customerId' })
    Customer.hasMany(models.Sale, { as: 'sales', foreignKey: 'customerId' })
  }

  return Customer
}
