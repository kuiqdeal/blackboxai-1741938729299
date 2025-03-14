const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Subscription = require('../models/Subscription');
const Lead = require('../models/Lead');
const Campaign = require('../models/Campaign');
const Referral = require('../models/Referral');
const { asyncHandler } = require('../middlewares/errorMiddleware');
const logger = require('../utils/logger');

// @desc    Get all users for a tenant
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ tenant: req.tenant })
    .select('-password')
    .sort('-createdAt');

  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    tenant: req.tenant
  }).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Get user's subscription
  const subscription = await Subscription.findOne({
    user: user._id,
    status: 'active'
  });

  // Get user's leads
  const leads = await Lead.countDocuments({
    tenant: req.tenant,
    assignedTo: user._id
  });

  // Get user's campaigns
  const campaigns = await Campaign.countDocuments({
    tenant: req.tenant,
    createdBy: user._id
  });

  // Get user's referrals
  const referrals = await Referral.find({
    tenant: req.tenant,
    referrer: user._id
  });

  res.json({
    success: true,
    data: {
      user,
      subscription,
      stats: {
        leads,
        campaigns,
        referrals: referrals.length,
        totalEarnings: referrals.reduce((sum, ref) => sum + ref.analytics.totalEarnings, 0)
      }
    }
  });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    tenant: req.tenant
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Update user fields
  const updates = {
    role: req.body.role || user.role,
    isActive: req.body.isActive !== undefined ? req.body.isActive : user.isActive,
    permissions: req.body.permissions || user.permissions
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).select('-password');

  logger.info(`User updated by admin: ${user.email}`);

  res.json({
    success: true,
    data: updatedUser
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    tenant: req.tenant
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Cancel active subscriptions
  await Subscription.updateMany(
    { user: user._id, status: 'active' },
    { status: 'canceled', canceledAt: new Date() }
  );

  // Reassign or delete user's leads
  await Lead.updateMany(
    { assignedTo: user._id },
    { assignedTo: null }
  );

  await user.remove();

  logger.info(`User deleted by admin: ${user.email}`);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get tenant dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get users count
  const totalUsers = await User.countDocuments({ tenant: req.tenant });
  const activeUsers = await User.countDocuments({ 
    tenant: req.tenant,
    isActive: true
  });

  // Get subscriptions stats
  const subscriptions = await Subscription.aggregate([
    { $match: { tenant: req.tenant } },
    { $group: {
      _id: '$status',
      count: { $sum: 1 },
      revenue: { $sum: '$price.amount' }
    }}
  ]);

  // Get leads stats
  const leads = await Lead.aggregate([
    { $match: { tenant: req.tenant } },
    { $group: {
      _id: '$quality',
      count: { $sum: 1 }
    }}
  ]);

  // Get campaigns stats
  const campaigns = await Campaign.aggregate([
    { $match: { tenant: req.tenant } },
    { $group: {
      _id: '$status',
      count: { $sum: 1 },
      impressions: { $sum: '$performance.impressions' },
      clicks: { $sum: '$performance.clicks' },
      conversions: { $sum: '$performance.conversions' },
      revenue: { $sum: '$performance.revenue' }
    }}
  ]);

  // Get referral stats
  const referrals = await Referral.aggregate([
    { $match: { tenant: req.tenant } },
    { $group: {
      _id: null,
      totalEarnings: { $sum: '$analytics.totalEarnings' },
      pendingPayments: { $sum: '$analytics.pendingPayments' },
      totalReferrals: { $sum: 1 }
    }}
  ]);

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      subscriptions: {
        stats: subscriptions,
        totalRevenue: subscriptions.reduce((sum, sub) => sum + (sub.revenue || 0), 0)
      },
      leads: {
        stats: leads,
        total: leads.reduce((sum, lead) => sum + lead.count, 0)
      },
      campaigns: {
        stats: campaigns,
        performance: {
          impressions: campaigns.reduce((sum, camp) => sum + (camp.impressions || 0), 0),
          clicks: campaigns.reduce((sum, camp) => sum + (camp.clicks || 0), 0),
          conversions: campaigns.reduce((sum, camp) => sum + (camp.conversions || 0), 0),
          revenue: campaigns.reduce((sum, camp) => sum + (camp.revenue || 0), 0)
        }
      },
      referrals: referrals[0] || {
        totalEarnings: 0,
        pendingPayments: 0,
        totalReferrals: 0
      }
    }
  });
});

// @desc    Get tenant settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getTenantSettings = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({ tenantId: req.tenant });

  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found'
    });
  }

  res.json({
    success: true,
    data: tenant.settings
  });
});

// @desc    Update tenant settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateTenantSettings = asyncHandler(async (req, res) => {
  const tenant = await Tenant.findOne({ tenantId: req.tenant });

  if (!tenant) {
    return res.status(404).json({
      success: false,
      error: 'Tenant not found'
    });
  }

  // Update settings
  tenant.settings = {
    ...tenant.settings,
    ...req.body
  };

  await tenant.save();

  logger.info(`Tenant settings updated: ${req.tenant}`);

  res.json({
    success: true,
    data: tenant.settings
  });
});

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getSystemLogs = asyncHandler(async (req, res) => {
  // TODO: Implement log retrieval from logging service
  res.json({
    success: true,
    data: []
  });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  getTenantSettings,
  updateTenantSettings,
  getSystemLogs
};
