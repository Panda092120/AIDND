const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'dnd_simulator.db');
console.log('🔍 Verifying database tables...');
console.log('📁 Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
});

// Check if tables exist
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('❌ Error getting tables:', err.message);
    return;
  }

  console.log('\n📋 Tables in database:');
  if (tables.length === 0) {
    console.log('❌ No tables found! Run setup-database-fixed.js first.');
  } else {
    tables.forEach(table => {
      console.log(`✅ ${table.name}`);
    });

    // Count records in each table
    console.log('\n📊 Record counts:');
    
    const checkTable = (tableName) => {
      return new Promise((resolve) => {
        db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
          if (err) {
            console.log(`❌ ${tableName}: Error - ${err.message}`);
          } else {
            console.log(`📈 ${tableName}: ${row.count} records`);
          }
          resolve();
        });
      });
    };

    // Check all tables
    Promise.all([
      checkTable('users'),
      checkTable('campaigns'),
      checkTable('character_sheets'),
      checkTable('chat_messages')
    ]).then(() => {
      db.close();
      console.log('\n✅ Database verification complete!');
    });
  }
});