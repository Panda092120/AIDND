const express = require('express');

const router = express.Router();

// Import database functions - handle potential import errors
let executeQuery, executeUpdate, getCampaignsByUserId, getCampaignById;
try {
  const db = require('../config/database');
  executeQuery = db.executeQuery;
  executeUpdate = db.executeUpdate;
  getCampaignsByUserId = db.getCampaignsByUserId;
  getCampaignById = db.getCampaignById;
} catch (error) {
  console.error('Database import error in campaigns:', error.message);
}

// Import auth middleware - handle potential import errors
let authMiddleware;
try {
  authMiddleware = require('../middleware/auth');
} catch (error) {
  console.error('Auth middleware import error in campaigns:', error.message);
  // Create a dummy middleware if the file doesn't exist
  authMiddleware = (req, res, next) => {
    res.status(500).json({ error: 'Auth middleware not configured' });
  };
}

// GET /api/campaigns - Get user's campaigns
router.get('/', authMiddleware, async (req, res) => {
  try {
    const campaigns = await getCampaignsByUserId(req.userId);
    
    res.json({
      message: 'Campaigns retrieved successfully',
      campaigns: campaigns || []
    });
    
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      error: 'Failed to get campaigns',
      message: 'Could not retrieve campaigns'
    });
  }
});

// POST /api/campaigns - Create new campaign
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, setting_description } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Campaign title is required'
      });
    }
    
    const result = await executeUpdate(
      'INSERT INTO campaigns (user_id, title, setting_description, game_state) VALUES (?, ?, ?, ?)',
      [req.userId, title.trim(), setting_description || '', 'character-creation']
    );
    
    const newCampaign = await getCampaignById(result.lastID);
    
    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: newCampaign
    });
    
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      error: 'Failed to create campaign',
      message: 'Could not create campaign'
    });
  }
});

// GET /api/campaigns/:id - Get specific campaign
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    
    if (isNaN(campaignId)) {
      return res.status(400).json({
        error: 'Invalid campaign ID',
        message: 'Campaign ID must be a number'
      });
    }
    
    const campaign = await getCampaignById(campaignId);
    
    if (!campaign) {
      return res.status(404).json({
        error: 'Campaign not found',
        message: 'Campaign does not exist'
      });
    }
    
    // Check if user owns this campaign
    if (campaign.user_id !== req.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to access this campaign'
      });
    }
    
    res.json({
      message: 'Campaign retrieved successfully',
      campaign
    });
    
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({
      error: 'Failed to get campaign',
      message: 'Could not retrieve campaign'
    });
  }
});

module.exports = router;