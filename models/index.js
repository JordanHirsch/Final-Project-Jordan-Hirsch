// final-project-JordanHirsch/models/index.js
import dotenv            from 'dotenv';
import { Sequelize }     from 'sequelize';
import { PostModel }     from './Post.js';
import { CommentModel }  from './Comment.js';
import { UserModel }     from './User.js';
import { UpvoteModel }   from './Upvote.js';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host:    process.env.DB_HOST  || 'localhost',
    port:    process.env.DB_PORT  || 3306,
    dialect: 'mysql',
    logging: console.log,
  }
);

export const User    = UserModel(sequelize);
export const Post    = PostModel(sequelize);
export const Comment = CommentModel(sequelize);
export const Upvote  = UpvoteModel(sequelize);

// A user can create many posts
User.hasMany(Post,   { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

// Comments → Posts
Comment.belongsTo(Post, { foreignKey: 'postId', onDelete: 'CASCADE' });
Post.hasMany(Comment,   { foreignKey: 'postId' });

// Post upvotes
User.belongsToMany(Post,  { through: Upvote, foreignKey: 'userId' });
Post.belongsToMany(User,  { through: Upvote, foreignKey: 'postId' });
