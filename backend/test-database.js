const { testConnection, executeQuery, initializeDatabase } = require('./config/database');

async function testDatabase() {
  console.log('🧪 Testing D&D Simulator Database...\n');

  try {
    // Test connection
    const connectionOK = await testConnection();
    if (!connectionOK) {
      console.error('❌ Database connection failed');
      return;
    }

    // Test queries
    console.log('📊 Testing database queries...\n');

    // Get all users
    const users = await executeQuery('SELECT * FROM users');
    console.log('👥 Users in database:');
    users.forEach(user => {
      console.log(`   - ${user.username} (${user.email})`);
    });

    // Get all campaigns
    const campaigns = await executeQuery('SELECT * FROM campaigns');
    console.log('\n🏰 Campaigns in database:');
    campaigns.forEach(campaign => {
      console.log(`   - ${campaign.title} (ID: ${campaign.id})`);
    });

    // Get all characters
    const characters = await executeQuery('SELECT * FROM character_sheets');
    console.log('\n⚔️  Characters in database:');
    characters.forEach(char => {
      console.log(`   - ${char.character_name} (Level ${char.level} ${char.race} ${char.class})`);
    });

    // Get chat messages
    const messages = await executeQuery('SELECT * FROM chat_messages ORDER BY created_at');
    console.log('\n💬 Recent chat messages:');
    messages.slice(0, 3).forEach(msg => {
      console.log(`   - [${msg.message_type.toUpperCase()}]: ${msg.content.substring(0, 50)}...`);
    });

    // Test joining tables
    const campaignDetails = await executeQuery(`
      SELECT 
        c.title as campaign_title,
        cs.character_name,
        u.username
      FROM campaigns c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN character_sheets cs ON c.id = cs.campaign_id
    `);

    console.log('\n🔗 Campaign details (with joins):');
    campaignDetails.forEach(detail => {
      console.log(`   - "${detail.campaign_title}" by ${detail.username} with character ${detail.character_name || 'No character yet'}`);
    });

    console.log('\n✅ All database tests passed!');
    console.log('🎯 Your database is ready for the D&D Simulator backend!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  }
}

// Run the test
testDatabase();