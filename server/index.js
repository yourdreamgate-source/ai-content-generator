require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { initDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database and start server
async function startServer() {
  await initDatabase();
  
  const authRoutes = require('./routes/auth');
  const contentRoutes = require('./routes/content');
  const templateRoutes = require('./routes/templates');
  const adminRoutes = require('./routes/admin');

  // Middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use('/api/', limiter);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/admin', adminRoutes);

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
  }

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error);
