const User = require('../models/User');
const Tenant = require('../models/Tenant');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register user & tenant
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    name,
    company,
    tenantId,
    role = 'user'
  } = req.body;

  // Validate tenant ID format
  const tenantRegex = /^[a-zA-Z0-9-]+$/;
  if (!tenantRegex.test(tenantId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid tenant ID format. Use only letters, numbers, and hyphens.'
    });
  }

  // Check if tenant exists
  const existingTenant = await Tenant.findOne({ tenantId });
  if (existingTenant) {
    return res.status(400).json({
      success: false,
      error: 'Tenant ID already exists'
    });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists'
    });
  }

  // Create user
  const user = await User.create({
    email,
    password,
    name,
    company,
    tenant: tenantId,
    role
  });

  // Create tenant
  const tenant = await Tenant.create({
    tenantId,
    name: company,
    owner: user._id,
    status: 'active',
    settings: {
      theme: {
        primary: '#007bff',
        secondary: '#6c757d'
      },
      features: {
        aiLeadGeneration: true,
        emailMarketing: true,
        socialMediaManagement: true,
        adsManagement: true,
        websiteAutomation: true,
        ecommerceAutomation: true,
        videoGeneration: true,
        vpnAccess: true
      }
    }
  });

  // Generate referral code
  user.generateReferralCode();
  await user.save();

  // Create token
  const token = user.generateAuthToken();

  logger.info(`New user registered: ${user.email} for tenant: ${tenantId}`);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: user.tenant,
        referralCode: user.referralCode
      },
      tenant: {
        id: tenant._id,
        tenantId: tenant.tenantId,
        name: tenant.name,
        settings: tenant.settings
      },
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      error: 'Account is inactive. Please contact support.'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Get tenant details
  const tenant = await Tenant.findOne({ tenantId: user.tenant });
  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found'
    });
  }

  // Create token
  const token = user.generateAuthToken();

  logger.info(`User logged in: ${user.email}`);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: user.tenant,
        theme: user.theme,
        language: user.language
      },
      tenant: {
        id: tenant._id,
        tenantId: tenant.tenantId,
        name: tenant.name,
        settings: tenant.settings
      },
      token
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const tenant = await Tenant.findOne({ tenantId: user.tenant });

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant: user.tenant,
        theme: user.theme,
        language: user.language,
        referralCode: user.referralCode
      },
      tenant: {
        id: tenant._id,
        tenantId: tenant.tenantId,
        name: tenant.name,
        settings: tenant.settings
      }
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  const updates = {
    name: req.body.name || user.name,
    theme: req.body.theme || user.theme,
    language: req.body.language || user.language
  };

  // Update password if provided
  if (req.body.password) {
    updates.password = req.body.password;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  );

  logger.info(`User profile updated: ${user.email}`);

  res.json({
    success: true,
    data: {
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        tenant: updatedUser.tenant,
        theme: updatedUser.theme,
        language: updatedUser.language
      }
    }
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // TODO: Send reset password email
  logger.info(`Password reset requested for: ${user.email}`);

  res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Update password
  user.password = password;
  await user.save();

  logger.info(`Password reset completed for: ${user.email}`);

  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword
};
