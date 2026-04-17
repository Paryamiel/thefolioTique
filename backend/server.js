// backend/server.js
require('dotenv').config(); // Load .env variables FIRST
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();
connectDB(); // Connect to MongoDB

// ── Middleware ─────────────────────────────────────────────────
// CORS — manual middleware (cors package has issues with Express 5)
app.use((req, res, next) => {
  const allowedOrigin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Respond to preflight requests immediately
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Parse incoming JSON request bodies
app.use(express.json());

// Serve uploaded image files as public URLs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contacts', require('./routes/contact.routes'));

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});