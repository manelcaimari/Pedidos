module.exports = function (sequelize, DataTypes) {
  const Company = sequelize.define('Company',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      commercialAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Dirección comercial".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Dirección comercial" con un nombre válido.'
          }
        }
      },
      fiscalAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Dirección fiscal".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Dirección fiscal" con un nombre válido.'
          }
        }
      },
      commercialName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Nombre comercial".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Nombre comercial" con un nombre válido.'
          }
        }
      },
      vatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Vat".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Vat" con un número válido.'
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
      tableName: 'companies',
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

  Company.associate = function (models) {

  }

  return Company
}
