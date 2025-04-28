// final-project-JordanHirsch/Server.js

console.log('🔔 Starting Server.js');

import express  from 'express';
import cors     from 'cors';
import dotenv   from 'dotenv';
import bcrypt   from 'bcrypt';
import jwt      from 'jsonwebtoken';
import { Op }   from 'sequelize';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';

import { sequelize, User, Post, Comment, Upvote } from './models/index.js';

dotenv.config();
const app = express();

// — Middleware —
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

// — DB connect & sync —
try {
  await sequelize.authenticate();
  console.log('✅ Database connected');
  await sequelize.sync({ alter: true });
  console.log('✅ Tables synced');
} catch (err) {
  console.error('🔴 DB connection failed:', err);
  process.exit(1);
}

// — JWT setup —
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ Missing JWT_SECRET in .env');
  process.exit(1);
}

// — Auth middleware —
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// — AUTH ROUTES — //

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash });
    return res.status(201).json({ id: user.id, username: user.username });
  } catch {
    return res.status(400).json({ error: 'Username already taken' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// — Get current user — //
app.get('/api/me', authenticate, (req, res) => {
  return res.json({ id: req.user.id, username: req.user.username });
});

// — PAGINATED POSTS ROUTE — //
app.get('/api/posts', async (req, res) => {
  try {
    const page     = parseInt(req.query.page, 10)  || 1;
    const limit    = parseInt(req.query.limit, 10) || 10;
    const offset   = (page - 1) * limit;
    const { sortBy = 'createdAt', search = '' } = req.query;

    const order = sortBy === 'upvotes'
      ? [['upvotes','DESC']]
      : [['createdAt','DESC']];

    const where = search
      ? { title: { [Op.like]: `%${search}%` } }
      : {};

    const { count, rows: posts } = await Post.findAndCountAll({
      where, order, limit, offset
    });

    const totalPages = Math.ceil(count / limit);
    return res.json({ posts, page, totalPages, total: count });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// — wrap Express in HTTP + Socket.IO — //
const httpServer = createServer(app);
const io = new IOServer(httpServer, { cors: { origin: '*' } });

// — CREATE A NEW POST — //
app.post('/api/posts', authenticate, async (req, res) => {
  const { title, content = null, imageUrl = null } = req.body;
  try {
    const post = await Post.create({
      title,
      content,
      imageUrl,
      userId: req.user.id
    });
    io.emit('newPost', post);
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// — GET SINGLE POST + COMMENTS — //
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, { include: Comment });
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// — EDIT A POST — //
app.put('/api/posts/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await post.update(req.body);
    return res.json(post);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// — DELETE A POST — //
app.delete('/api/posts/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await post.destroy();
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// — TOGGLE UPVOTE — //
app.post('/api/posts/:id/upvote', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = parseInt(req.params.id, 10);
    const post   = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: 'Not found' });

    const existing = await Upvote.findOne({ where: { userId, postId } });
    if (existing) {
      await existing.destroy();
      post.upvotes = Math.max(0, post.upvotes - 1);
    } else {
      await Upvote.create({ userId, postId });
      post.upvotes++;
    }
    await post.save();

    io.emit('postUpvoted', { id: post.id, upvotes: post.upvotes });
    return res.json({ upvotes: post.upvotes });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// — ADD A COMMENT — //
app.post('/api/posts/:id/comments', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    const comment = await Comment.create({
      text:   req.body.text,
      postId: post.id
    });
    io.emit('newComment', comment);
    return res.status(201).json(comment);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// — DELETE A COMMENT — //
app.delete('/api/comments/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    const post = await Post.findByPk(comment.postId);
    if (post.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await comment.destroy();
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// — START SERVER — //
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server (with sockets) listening on http://localhost:${PORT}`);
});
