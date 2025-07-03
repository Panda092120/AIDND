const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database file in the backend directory
const dbPath = path.join(__dirname, 'dnd_simulator.db');

console.log('🎲 Setting up D&D Simulator database...');
console.log('📁 Database location:', dbPath);

// Delete existing database file if it exists (for clean setup)
if (fs.existsSync(dbPath)) {
  console.log('🗑️  Removing existing database file...');
  fs.unlinkSync(dbPath);
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error creating database:', err.message);
    process.exit(1);
  } else {
    console.log('✅ SQLite database created successfully');
  }
});

// Function to run SQL and wait for completion
const runSQL = (sql, description) => {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        console.error(`❌ Error ${description}:`, err.message);
        reject(err);
      } else {
        console.log(`✅ ${description}`);
        resolve();
      }
    });
  });
};

// Function to insert data and wait for completion
const insertData = (sql, params, description) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) {
        console.error(`❌ Error ${description}:`, err.message);
        reject(err);
      } else {
        console.log(`✅ ${description}`);
        resolve();
      }
    });
  });
};

// Setup database tables and data
async function setupDatabase() {
  try {
    console.log('\n📋 Creating tables...');

    // Users table
    await runSQL(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, 'Users table created');

    // Campaigns table
    await runSQL(`
      CREATE TABLE campaigns (
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
    `, 'Campaigns table created');

    // Character sheets table
    await runSQL(`
      CREATE TABLE character_sheets (
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
    `, 'Character sheets table created');

    // Chat messages table
    await runSQL(`
      CREATE TABLE chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id INTEGER NOT NULL,
        message_type TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
      )
    `, 'Chat messages table created');

    console.log('\n📝 Inserting sample data...');

    // Sample user (password is 'password123' hashed with bcrypt)
    await insertData(`
      INSERT INTO users (username, email, password_hash) 
      VALUES (?, ?, ?)
    `, ['testuser', 'test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'], 
    'Sample user created (username: testuser, password: password123)');

    // Sample campaign
    await insertData(`
      INSERT INTO campaigns (user_id, title, setting_description, game_state) 
      VALUES (?, ?, ?, ?)
    `, [1, 'The Lost Mines of Phandelver', 'A classic D&D starter adventure in the Forgotten Realms', 'playing'],
    'Sample campaign created');

    // Sample character
    await insertData(`
      INSERT INTO character_sheets (
        campaign_id, character_name, race, class, level, 
        strength, dexterity, constitution, intelligence, wisdom, charisma,
        hit_points, armor_class, background
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [1, 'Thorin Ironforge', 'Dwarf', 'Fighter', 3, 16, 12, 15, 10, 13, 8, 28, 16, 'Folk Hero - Saved village from dragon attack'],
    'Sample character created');

    // Sample chat messages
    const messages = [
      [1, 'dm', 'Welcome to the Lost Mines of Phandelver! You stand at the entrance of a mysterious cave.'],
      [1, 'player', 'I want to examine the cave entrance for traps.'],
      [1, 'dm', 'Roll a Perception check to search for traps.'],
      [1, 'system', '🎲 Thorin rolled 1d20+2: 15'],
      [1, 'dm', 'You notice some loose stones that might indicate a tripwire.']
    ];

    for (const [campaignId, type, content] of messages) {
      await insertData(`
        INSERT INTO chat_messages (campaign_id, message_type, content) 
        VALUES (?, ?, ?)
      `, [campaignId, type, content], `Chat message added (${type})`);
    }

    console.log('\n🎉 Database setup complete!');
    console.log('🔗 You can now connect your backend to the database');
    console.log('📁 Database file:', dbPath);
    console.log('\n👤 Test user credentials:');
    console.log('   Username: testuser');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('\n✅ Database setup script completed successfully!');
      }
    });
  }
}

// Run the setup
setupDatabase();