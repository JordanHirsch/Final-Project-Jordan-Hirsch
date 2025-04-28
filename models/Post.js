// final-project-JordanHirsch/models/Post.js
import { DataTypes } from 'sequelize';

export function PostModel(sequelize) {
  return sequelize.define('Post', {
    title:    { type: DataTypes.STRING,  allowNull: false },
    content:  { type: DataTypes.TEXT,    allowNull: true  },
    imageUrl: { type: DataTypes.STRING,  allowNull: true  },
    upvotes:  { type: DataTypes.INTEGER, defaultValue: 0   },
    userId:   { type: DataTypes.INTEGER, allowNull: true }
  });
}
