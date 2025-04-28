// final-project-JordanHirsch/models/User.js
import { DataTypes } from 'sequelize';

export function UserModel(sequelize) {
  return sequelize.define('User', {
    username:     { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false }
  });
}
