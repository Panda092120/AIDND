const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🎲 Starting Simple D&D Simulator Server...');

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({
    message: '🐉 D&D Simulator API Server (Simple Version)',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Try to import routes safely
console.log('📦 Loading routes...');

try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.log('❌ Auth routes failed to load:', error.message);
}

try {
  const campaignRoutes = require('./routes/campaigns');
  app.use('/api/campaigns', campaignRoutes);
  console.log('✅ Campaign routes loaded');
} catch (error) {
  console.log('❌ Campaign routes failed to load:', error.message);
}

try {
  const openaiRoutes = require('./routes/openai');
  app.use('/api/openai', openaiRoutes);
  console.log('✅ OpenAI routes loaded');
} catch (error) {
  console.log('❌ OpenAI routes failed to load:', error.message);
}

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Server Status:');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n🌐 Available endpoints:');
  console.log(`   • Health check: http://localhost:${PORT}/health`);
  console.log(`   • Main API: http://localhost:${PORT}/`);
  console.log('\n🎯 Server is running! Check the logs above to see which routes loaded successfully.');
});