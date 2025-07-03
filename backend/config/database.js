const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

// Database file path
const dbPath = path.join(__dirname, '..', process.env.DB_PATH || 'dnd_simulator.db');

console.log('📁 Database path:', dbPath);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Test connection function
const testConnection = () => {
  return new Promise((resolve, reject) => {
    db.get("SELECT 1 as test", (err, row) => {
      if (err) {
        console.error('❌ Database connection test failed:', err.message);
        reject(err);
      } else {
        console.log('✅ Database connection test successful');
        resolve(true);
      }
    });
  });
};

// Execute query function
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('❌ Query error:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Execute insert/update/delete function
const executeUpdate = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) {
        console.error('❌ Update error:', err.message);
        reject(err);
      } else {
        resolve({ 
          lastID: this.lastID, 
          changes: this.changes 
        });
      }
    });
  });
};

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('🔧 Initializing database tables...');
    
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Error creating users table:', err.message);
        else console.log('✅ Users table ready');
      });

      // Campaigns table
      db.run(`
        CREATE TABLE IF NOT EXISTS campaigns (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          character_data TEXT,
          chat_history TEXT,
          setting_description TEXT,
          game_state TEXT DEFAULT 'character-creation',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_played DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating campaigns table:', err.message);
        else console.log('✅ Campaigns table ready');
      });

      // Character sheets table
      db.run(`
        CREATE TABLE IF NOT EXISTS character_sheets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          campaign_id INTEGER NOT NULL,
          character_name TEXT NOT NULL,
          race TEXT NOT NULL,
          class TEXT NOT NULL,
          level INTEGER DEFAULT 1,
          strength INTEGER DEFAULT 10,
          dexterity INTEGER DEFAULT 10,
          constitution INTEGER DEFAULT 10,
          intelligence INTEGER DEFAULT 10,
          wisdom INTEGER DEFAULT 10,
          charisma INTEGER DEFAULT 10,
          hit_points INTEGER DEFAULT 10,
          armor_class INTEGER DEFAULT 10,
          background TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating character_sheets table:', err.message);
        else console.log('✅ Character sheets table ready');
      });

      // Chat messages table
      db.run(`
        CREATE TABLE IF NOT EXISTS chat_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          campaign_id INTEGER NOT NULL,
          message_type TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Error creating chat_messages table:', err.message);
        else console.log('✅ Chat messages table ready');
        resolve();
      });
    });
  });
};

// Get user by email or username
const getUserByEmailOrUsername = async (emailOrUsername) => {
  const query = `
    SELECT * FROM users 
    WHERE email = ? OR username = ?
  `;
  const rows = await executeQuery(query, [emailOrUsername, emailOrUsername]);
  return rows[0] || null;
};

// Get user by ID
const getUserById = async (userId) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  const rows = await executeQuery(query, [userId]);
  return rows[0] || null;
};

// Get campaigns by user ID
const getCampaignsByUserId = async (userId) => {
  const query = `
    SELECT c.*, cs.character_name
    FROM campaigns c
    LEFT JOIN character_sheets cs ON c.id = cs.campaign_id
    WHERE c.user_id = ?
    ORDER BY c.last_played DESC
  `;
  return await executeQuery(query, [userId]);
};

// Get campaign by ID
const getCampaignById = async (campaignId) => {
  const query = `SELECT * FROM campaigns WHERE id = ?`;
  const rows = await executeQuery(query, [campaignId]);
  return rows[0] || null;
};

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve) => {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('✅ Database connection closed');
      }
      resolve();
    });
  });
};

module.exports = {
  db,
  testConnection,
  executeQuery,
  executeUpdate,
  initializeDatabase,
  getUserByEmailOrUsername,
  getUserById,
  getCampaignsByUserId,
  getCampaignById,
  closeDatabase
};