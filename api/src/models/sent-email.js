module.exports = function (sequelize, DataTypes) {
  const SentEmail = sequelize.define('SentEmail',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "userId".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "userId".'
          }
        }
      },
      userType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "userType".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "userType".'
          }
        }
      },
      emailTemplate: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sendAt: {
        type: DataTypes.DATE
      },
      readedAt: {
        type: DataTypes.DATE
      },
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "uuid".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "uuid".'
          }
        }
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    }, {
      sequelize,
      tableName: 'sent_emails',
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
          name: 'sent_emails_userId_fk',
          using: 'BTREE',
          fields: [
            { name: 'userId' }
          ]
        }
      ]
    }
  )

  SentEmail.associate = function (models) {
  }

  return SentEmail
}
