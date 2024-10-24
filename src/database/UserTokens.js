'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./connection');

class UserToken extends Model {}

UserToken.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    tokenId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserToken',
    tableName: 'users_tokens', // Asegúrate de que coincida con el nombre de la tabla en la migración
    timestamps: true, // Si deseas habilitar los campos de `createdAt` y `updatedAt`
  }
);

module.exports = UserToken;
