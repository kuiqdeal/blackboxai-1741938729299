const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('./errorMiddleware');
const logger = require('../utils/logger');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is inactive'
      });
    }

    // Check if tenant matches
    if (user.tenant !== req.tenant) {
      return res.status(401).json({
        success: false,
        error: 'Invalid tenant access'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error('Token verification failed', { error });
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
});

// Authorize roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Check permissions
const checkPermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    // Admin has all permissions
    if (req.user.role === 'admin') {
      return next();
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: `Permission denied: ${permission} is required`
      });
    }
    next();
  });
};

// Rate limiting by tenant
const tenantRateLimit = (limiter) => {
  return asyncHandler(async (req, res, next) => {
    const tenant = req.tenant;
    
    // Create tenant-specific key for rate limiting
    req.rateLimit = {
      ...req.rateLimit,
      key: `${tenant}:${req.ip}`
    };
    
    return limiter(req, res, next);
  });
};

// Subscription check
const checkSubscription = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('subscription');

  if (!user.subscription || user.subscription.status !== 'active') {
    return res.status(403).json({
      success: false,
      error: 'Active subscription required to access this feature'
    });
  }

  // Check if feature is available in subscription plan
  if (req.feature && !user.subscription.features[req.feature].enabled) {
    return res.status(403).json({
      success: false,
      error: `${req.feature} is not available in your current subscription plan`
    });
  }

  next();
});

// Feature access check
const checkFeatureAccess = (feature) => {
  return asyncHandler(async (req, res, next) => {
    req.feature = feature;
    return checkSubscription(req, res, next);
  });
};

// Session tracking
const trackSession = asyncHandler(async (req, res, next) => {
  // Update last activity timestamp
  await User.findByIdAndUpdate(req.user.id, {
    lastLogin: new Date()
  });

  next();
});

// Log API access
const logAccess = asyncHandler(async (req, res, next) => {
  logger.info('API Access', {
    user: req.user.id,
    tenant: req.tenant,
    method: req.method,
    path: req.path,
    ip: req.ip
  });

  next();
});

module.exports = {
  protect,
  authorize,
  checkPermission,
  tenantRateLimit,
  checkSubscription,
  checkFeatureAccess,
  trackSession,
  logAccess
};
