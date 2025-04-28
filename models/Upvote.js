// final-project-JordanHirsch/models/Upvote.js
import { DataTypes } from 'sequelize';

export function UpvoteModel(sequelize) {
  return sequelize.define('Upvote', {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    postId: { type: DataTypes.INTEGER, primaryKey: true }
  }, { timestamps: true });
}
