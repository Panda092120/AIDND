const express = require('express');
require('dotenv').config();

console.log('🧪 Testing minimal server...');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({
    message: '✅ Minimal server is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const sqlite3 = require('sqlite3').verbose();
    const path = require('path');
    
    const dbPath = path.join(__dirname, 'dnd_simulator.db');
    console.log('Testing database at:', dbPath);
    
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: 'Database connection failed', details: err.message });
      }
      
      db.get("SELECT 1 as test", (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database query failed', details: err.message });
        }
        
        db.close();
        res.json({ 
          message: '✅ Database connection successful',
          result: row
        });
      });
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Database test failed', 
      details: error.message 
    });
  }
});

// Test environment variables
app.get('/test-env', (req, res) => {
  res.json({
    message: 'Environment variables test',
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasOpenAiKey: !!process.env.OPENAI_API_KEY,
    dbPath: process.env.DB_PATH,
    port: process.env.PORT
  });
});

app.listen(PORT, () => {
  console.log(`✅ Minimal server running on port ${PORT}`);
  console.log(`🔗 Test endpoints:`);
  console.log(`   • http://localhost:${PORT}/`);
  console.log(`   • http://localhost:${PORT}/test-db`);
  console.log(`   • http://localhost:${PORT}/test-env`);
});