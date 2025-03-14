const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  startCampaign,
  pauseCampaign,
  getCampaignAnalytics
} = require('../controllers/campaignController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// Campaign management routes
router.route('/')
  .get(getCampaigns)
  .post(createCampaign);

router.route('/:id')
  .get(getCampaignById)
  .put(updateCampaign)
  .delete(deleteCampaign);

// Campaign control routes
router.post('/:id/start', startCampaign);
router.post('/:id/pause', pauseCampaign);

// Campaign analytics routes
router.get('/:id/analytics', getCampaignAnalytics);

// Validation middleware for campaign creation
router.use('/', (req, res, next) => {
  if (req.method === 'POST') {
    const { name, type, platform } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Campaign name is required'
      });
    }
    
    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Campaign type is required'
      });
    }
    
    if (!platform) {
      return res.status(400).json({
        success: false,
        error: 'Campaign platform is required'
      });
    }
    
    // Validate campaign type
    const validTypes = ['email', 'social_media', 'ads', 'sms', 'whatsapp'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid campaign type'
      });
    }
    
    // Validate platform based on type
    const validPlatforms = {
      email: ['mailchimp', 'sendgrid'],
      social_media: ['facebook', 'instagram', 'linkedin'],
      ads: ['google_ads', 'facebook', 'linkedin', 'tiktok'],
      sms: ['twilio', 'messagebird'],
      whatsapp: ['twilio', 'messagebird']
    };
    
    if (!validPlatforms[type].includes(platform)) {
      return res.status(400).json({
        success: false,
        error: `Invalid platform for ${type} campaign`
      });
    }
  }
  
  next();
});

// Rate limiting for campaign creation
const rateLimit = require('express-rate-limit');
const campaignLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each tenant to 50 campaign creations per hour
  message: {
    success: false,
    error: 'Too many campaigns created. Please try again later.'
  }
});

router.post('/', campaignLimiter);

module.exports = router;
