const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  getTenantSettings,
  updateTenantSettings,
  getSystemLogs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// User management routes
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Dashboard and analytics routes
router.get('/dashboard', getDashboardStats);

// Tenant settings routes
router.route('/settings')
  .get(getTenantSettings)
  .put(updateTenantSettings);

// System logs routes
router.get('/logs', getSystemLogs);

module.exports = router;
