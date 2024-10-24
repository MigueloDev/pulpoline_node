'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('./connection');

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // Asegúrate de que coincida con el nombre de la tabla en la migración
    timestamps: true, // Si deseas habilitar los campos de `createdAt` y `updatedAt`
  }
);

User.tokens = User.hasMany(require('./UserTokens'), {
  foreignKey: 'userId',
  as: 'tokens',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = User;
