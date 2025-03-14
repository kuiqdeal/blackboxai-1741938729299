const { asyncHandler } = require('./errorMiddleware');
const logger = require('../utils/logger');

const tenantMiddleware = asyncHandler(async (req, res, next) => {
  // Extract tenant from subdomain or custom header
  const tenant = req.headers['x-tenant-id'] || 
                req.hostname.split('.')[0];

  // Skip tenant check for public routes
  const publicRoutes = ['/api/auth/login', '/api/auth/register'];
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  if (!tenant) {
    logger.warn('No tenant identifier provided', {
      path: req.path,
      headers: req.headers,
      hostname: req.hostname
    });
    
    return res.status(400).json({
      success: false,
      error: 'Tenant Error',
      details: 'Tenant identifier is required'
    });
  }

  // Validate tenant format
  const tenantRegex = /^[a-zA-Z0-9-]+$/;
  if (!tenantRegex.test(tenant)) {
    logger.warn('Invalid tenant format', { tenant });
    return res.status(400).json({
      success: false,
      error: 'Tenant Error',
      details: 'Invalid tenant identifier format'
    });
  }

  // Attach tenant to request object
  req.tenant = tenant;
  
  // Add tenant to response headers for debugging
  res.setHeader('x-tenant-id', tenant);

  logger.debug('Tenant middleware processed', { 
    tenant,
    path: req.path,
    method: req.method 
  });

  next();
});

module.exports = { tenantMiddleware };
