const express = require('express');

const router = express.Router();

// Import database functions - handle potential import errors
let executeQuery, executeUpdate;
try {
  const db = require('../config/database');
  executeQuery = db.executeQuery;
  executeUpdate = db.executeUpdate;
} catch (error) {
  console.error('Database import error in openai:', error.message);
}

// Import auth middleware - handle potential import errors
let authMiddleware;
try {
  authMiddleware = require('../middleware/auth');
} catch (error) {
  console.error('Auth middleware import error in openai:', error.message);
  // Create a dummy middleware if the file doesn't exist
  authMiddleware = (req, res, next) => {
    res.status(500).json({ error: 'Auth middleware not configured' });
  };
}

// Mock DM response generator
const generateMockDMResponse = (userMessage, character) => {
  const responses = [
    `As you ${userMessage.toLowerCase()}, the ancient stone walls seem to whisper secrets of ages past. What do you do next?`,
    `Your action succeeds! The ${character?.race || 'adventurer'} ${character?.class || 'hero'} moves forward with determination.`,
    `Roll a d20 for your action check!`,
    `The DM considers your approach. ${character?.name || 'Hero'}, your instincts guide you as you proceed.`,
    `Interesting choice! The environment around you shifts. Something catches your attention in the distance.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// POST /api/openai/chat - Send message to AI DM
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { campaignId, message, character } = req.body;
    
    if (!campaignId || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Campaign ID and message are required'
      });
    }
    
    // Generate mock AI response
    const dmResponse = generateMockDMResponse(message, character);
    
    res.json({
      message: 'Message sent successfully',
      response: dmResponse
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: 'Could not send message to DM'
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({
    message: 'OpenAI routes are working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;