const express = require('express');
const router = express.Router();

// Import OpenAI
const OpenAI = require('openai');

// Import database functions safely
let executeQuery, executeUpdate;
try {
  const db = require('../config/database');
  executeQuery = db.executeQuery;
  executeUpdate = db.executeUpdate;
} catch (error) {
  console.error('Database import error in openai:', error.message);
}

// Initialize OpenAI client
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI client initialized');
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI:', error.message);
  }
} else {
  console.log('⚠️  No valid OpenAI API key found, using mock responses');
}

// Enhanced Mock DM response generator (fallback)
const generateInteractiveDMResponse = (userMessage, character) => {
  const message = userMessage.toLowerCase();
  const characterName = character?.name || 'adventurer';
  const characterClass = character?.class || 'hero';
  const characterRace = character?.race || 'being';
  
  // Analyze user input for specific actions
  if (message.includes('attack') || message.includes('fight') || message.includes('strike')) {
    return `${characterName} draws their weapon! Roll a d20 + your attack bonus to see if you hit. The enemy notices your aggressive stance and prepares to defend.`;
  }
  
  if (message.includes('look') || message.includes('examine') || message.includes('inspect')) {
    return `You carefully examine the area. As a ${characterRace} ${characterClass}, your keen senses reveal hidden details others might miss. You notice something interesting that might be important...`;
  }
  
  if (message.includes('search') || message.includes('investigate')) {
    return `${characterName} begins searching methodically. Roll an Investigation check (d20 + Intelligence modifier). Your ${characterClass} training helps guide your search for clues.`;
  }
  
  if (message.includes('cast') || message.includes('spell') || message.includes('magic')) {
    if (['Wizard', 'Sorcerer', 'Warlock', 'Cleric', 'Druid', 'Bard'].includes(characterClass)) {
      return `${characterName} begins weaving arcane energies! What spell do you want to cast? Remember to check if you have spell slots remaining for this level of magic.`;
    } else {
      return `As a ${characterClass}, you don't have traditional spellcasting abilities, but perhaps there's another way to achieve what you're trying to do?`;
    }
  }
  
  // Default contextual response
  return `${characterName} considers "${userMessage}" carefully. As a ${characterRace} ${characterClass}, you approach this situation with your unique perspective. The world responds to your actions...`;
};

// Real OpenAI DM response generator
const generateRealDMResponse = async (userMessage, character, chatHistory = []) => {
  if (!openai) {
    throw new Error('OpenAI not configured');
  }

  const characterInfo = character ? 
    `Character: ${character.name}, a level ${character.level} ${character.race} ${character.class}.\n` +
    `Ability Scores - STR: ${character.strength}, DEX: ${character.dexterity}, CON: ${character.constitution}, INT: ${character.intelligence}, WIS: ${character.wisdom}, CHA: ${character.charisma}.\n` +
    `HP: ${character.hitPoints}, AC: ${character.armorClass}.\n` +
    `Background: ${character.background || 'Unknown background'}`
    : 'Character details not provided';

  // Build conversation history for context
  const recentHistory = chatHistory.slice(-10); // Keep last 10 messages for context

  const systemPrompt = `You are a masterful Dungeon Master running an immersive D&D 5e campaign. Create engaging, interactive storytelling that responds directly to player actions.

CHARACTER INFO:
${characterInfo}

DM GUIDELINES:
• Always respond specifically to the player's action
• Use the character's name, race, class, and stats in your responses
• Ask for dice rolls when appropriate (format: "Roll a d20 + [modifier]" or "Roll [specific check]")
• Create vivid, immersive descriptions (3-5 sentences)
• Present meaningful choices and consequences
• Advance the story with each response
• Include sensory details (what they see, hear, feel, smell)
• Reference the character's abilities and background when relevant
• Keep responses under 200 words
• Be creative and unpredictable while staying true to D&D mechanics

CURRENT SCENE: The character is exploring a mysterious location filled with adventure opportunities.

Respond to their action with rich detail and clear next steps.`;

  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  // Add recent chat history for context
  recentHistory.forEach(msg => {
    if (msg.type === 'player') {
      messages.push({ role: 'user', content: msg.content });
    } else if (msg.type === 'dm') {
      messages.push({ role: 'assistant', content: msg.content });
    }
  });

  // Add the current user message
  messages.push({ role: 'user', content: userMessage });

  console.log('🤖 Sending to OpenAI with context:', messages.length, 'messages');

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages,
    max_tokens: 250,
    temperature: 0.8,
    presence_penalty: 0.1,
    frequency_penalty: 0.1,
  });

  return completion.choices[0].message.content;
};

// Test route
router.get('/test', (req, res) => {
  res.json({
    message: 'OpenAI routes are working!',
    timestamp: new Date().toISOString(),
    openaiConfigured: !!openai,
    status: 'OK'
  });
});

// POST /api/openai/chat - Send message to AI DM
router.post('/chat', async (req, res) => {
  try {
    console.log('📨 Received chat request:', req.body);
    
    const { message, character, campaignId, chatHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Missing message',
        message: 'Message is required'
      });
    }
    
    const messageText = typeof message === 'string' ? message.trim() : String(message).trim();
    
    if (messageText === '') {
      return res.status(400).json({
        error: 'Empty message',
        message: 'Message cannot be empty'
      });
    }
    
    console.log(`🎭 Processing message: "${messageText}" for character: ${character?.name || 'Unknown'}`);
    console.log(`🤖 Using ${openai ? 'REAL OpenAI' : 'Mock responses'}`);
    
    let dmResponse;
    let usingRealAI = false;
    
    // Try to use real OpenAI first, fallback to enhanced mock
    if (openai) {
      try {
        console.log('🔮 Generating response with OpenAI...');
        dmResponse = await generateRealDMResponse(messageText, character, chatHistory || []);
        usingRealAI = true;
        console.log('✅ OpenAI response generated successfully');
      } catch (openaiError) {
        console.warn('⚠️ OpenAI failed, using enhanced mock:', openaiError.message);
        dmResponse = generateInteractiveDMResponse(messageText, character);
        usingRealAI = false;
      }
    } else {
      console.log('🎭 Using enhanced mock response (no OpenAI key)...');
      dmResponse = generateInteractiveDMResponse(messageText, character);
      usingRealAI = false;
    }
    
    console.log(`🤖 Generated DM response: "${dmResponse}"`);
    
    // Optional: Save to database if campaign ID provided
    if (campaignId && executeUpdate) {
      try {
        console.log(`💾 Saving messages to database for campaign ${campaignId}`);
        
        // Save user message
        await executeUpdate(
          'INSERT INTO chat_messages (campaign_id, message_type, content) VALUES (?, ?, ?)',
          [campaignId, 'player', messageText]
        );
        
        // Save DM response
        await executeUpdate(
          'INSERT INTO chat_messages (campaign_id, message_type, content) VALUES (?, ?, ?)',
          [campaignId, 'dm', dmResponse]
        );
        
        console.log('✅ Messages saved to database');
      } catch (dbError) {
        console.warn('⚠️ Failed to save to database:', dbError.message);
      }
    }
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      response: dmResponse,
      timestamp: new Date().toISOString(),
      usingRealAI: usingRealAI,
      characterName: character?.name || 'Unknown'
    });
    
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET chat history for a campaign
router.get('/chat/:campaignId', async (req, res) => {
  try {
    const { campaignId } = req.params;
    
    if (!executeQuery) {
      return res.status(500).json({
        error: 'Database not configured',
        message: 'Cannot retrieve chat history'
      });
    }
    
    const messages = await executeQuery(
      'SELECT * FROM chat_messages WHERE campaign_id = ? ORDER BY created_at ASC LIMIT 50',
      [campaignId]
    );
    
    res.json({
      success: true,
      messages: messages || [],
      campaignId: campaignId
    });
    
  } catch (error) {
    console.error('❌ Get chat history error:', error);
    res.status(500).json({
      error: 'Failed to get chat history',
      message: error.message
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    service: 'OpenAI Routes',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    openaiConfigured: !!openai,
    endpoints: [
      'GET /api/openai/test',
      'POST /api/openai/chat',
      'GET /api/openai/chat/:campaignId'
    ]
  });
});

console.log('🤖 OpenAI routes module loaded');
module.exports = router;