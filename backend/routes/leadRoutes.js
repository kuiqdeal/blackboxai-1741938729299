const express = require('express');
const router = express.Router();
const {
  scrapeLeads,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  analyzeLeads,
  exportLeads
} = require('../controllers/leadController');
const { protect } = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(protect);

// Lead management routes
router.route('/')
  .get(getLeads)
  .post(scrapeLeads);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

// AI analysis routes
router.post('/analyze', analyzeLeads);

// Export routes
router.post('/export', exportLeads);

// Validation middleware for scraping
router.use('/scrape', (req, res, next) => {
  const { source, searchParams } = req.body;
  
  if (!source) {
    return res.status(400).json({
      success: false,
      error: 'Source is required for scraping'
    });
  }
  
  if (!searchParams) {
    return res.status(400).json({
      success: false,
      error: 'Search parameters are required'
    });
  }
  
  next();
});

// Rate limiting for scraping endpoints
const rateLimit = require('express-rate-limit');
const scrapeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each tenant to 10 scraping requests per windowMs
  message: {
    success: false,
    error: 'Too many scraping requests. Please try again later.'
  }
});

router.post('/scrape', scrapeLimiter, scrapeLeads);

module.exports = router;
