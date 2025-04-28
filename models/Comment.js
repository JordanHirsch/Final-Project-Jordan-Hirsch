// final-project-JordanHirsch/models/Comment.js
import { DataTypes } from 'sequelize';

export function CommentModel(sequelize) {
  return sequelize.define('Comment', {
    text:    { type: DataTypes.TEXT,    allowNull: false },
    upvotes: { type: DataTypes.INTEGER, defaultValue: 0    }
  });
}
