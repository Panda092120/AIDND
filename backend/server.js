const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import database and initialize
const { testConnection, initializeDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const openaiRoutes = require('./routes/openai');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'], // React and Vite default ports
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/openai', openaiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🐉 D&D Simulator API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      campaigns: '/api/campaigns',
      openai: '/api/openai'
    },
    documentation: 'Visit /api/docs for API documentation'
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'D&D Simulator API Documentation',
    version: '1.0.0',
    endpoints: {
      'POST /api/auth/signup': 'Create new user account',
      'POST /api/auth/login': 'Login user',
      'GET /api/auth/me': 'Get current user info (requires auth)',
      'GET /api/campaigns': 'Get user campaigns (requires auth)',
      'POST /api/campaigns': 'Create new campaign (requires auth)',
      'GET /api/campaigns/:id': 'Get specific campaign (requires auth)',
      'PUT /api/campaigns/:id': 'Update campaign (requires auth)',
      'DELETE /api/campaigns/:id': 'Delete campaign (requires auth)',
      'POST /api/openai/chat': 'Send message to AI DM (requires auth)'
    },
    authentication: 'Bearer token in Authorization header',
    examples: {
      signup: {
        url: 'POST /api/auth/signup',
        body: {
          username: 'adventurer',
          email: 'user@example.com',
          password: 'password123'
        }
      },
      login: {
        url: 'POST /api/auth/login',
        body: {
          email: 'user@example.com',
          password: 'password123'
        }
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Database errors
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(400).json({
      error: 'Duplicate entry',
      message: 'Username or email already exists'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Please login again'
    });
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api/docs',
      'POST /api/auth/signup',
      'POST /api/auth/login'
    ]
  });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🎲 Starting D&D Simulator Backend Server...\n');
    
    // Test database connection
    console.log('📊 Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Database connection failed. Exiting...');
      process.exit(1);
    }
    
    // Initialize database tables
    console.log('🔧 Initializing database...');
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log('\n🚀 Server Status:');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ Database: SQLite (dnd_simulator.db)`);
      console.log('\n🌐 Available endpoints:');
      console.log(`   • Health check: http://localhost:${PORT}/health`);
      console.log(`   • API docs: http://localhost:${PORT}/api/docs`);
      console.log(`   • Main API: http://localhost:${PORT}/api/`);
      console.log('\n📝 Test credentials:');
      console.log('   • Username: testuser');
      console.log('   • Email: test@example.com');
      console.log('   • Password: password123');
      console.log('\n🎯 Ready for frontend connections!');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

// Start the server
startServer();