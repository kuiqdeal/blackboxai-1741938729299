const mongoose = require('mongoose');
const logger = require('../utils/logger');

const subscriptionSchema = new mongoose.Schema({
  tenant: {
    type: String,
    required: [true, 'Tenant is required'],
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'past_due', 'canceled', 'pending'],
    default: 'pending'
  },
  paymentProvider: {
    type: String,
    enum: ['stripe', 'paymob', 'paytabs', 'utap', 'crypto', 'paypal'],
    required: true
  },
  paymentDetails: {
    providerId: String, // Payment provider's subscription/customer ID
    last4: String,     // Last 4 digits of card if applicable
    brand: String,     // Card brand if applicable
    expiryDate: String // Card expiry if applicable
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  features: {
    aiLeadGeneration: {
      enabled: Boolean,
      limit: Number
    },
    emailMarketing: {
      enabled: Boolean,
      monthlyQuota: Number
    },
    socialMediaManagement: {
      enabled: Boolean,
      accountLimit: Number
    },
    adsManagement: {
      enabled: Boolean,
      budgetLimit: Number
    },
    websiteAutomation: {
      enabled: Boolean,
      visitorLimit: Number
    },
    ecommerceAutomation: {
      enabled: Boolean,
      productLimit: Number
    },
    videoGeneration: {
      enabled: Boolean,
      monthlyLimit: Number
    },
    vpnAccess: {
      enabled: Boolean,
      locationLimit: Number
    }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  canceledAt: Date,
  trialEndsAt: Date,
  nextBillingDate: Date,
  lastBillingDate: Date,
  failedPayments: [{
    date: Date,
    reason: String,
    amount: Number
  }],
  paymentHistory: [{
    date: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['success', 'failed', 'pending', 'refunded']
    },
    transactionId: String
  }]
}, {
  timestamps: true
});

// Indexes
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ 'paymentDetails.providerId': 1 });
subscriptionSchema.index({ endDate: 1 }, { 
  expireAfterSeconds: 0,
  partialFilterExpression: { status: 'canceled' }
});

// Methods
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

subscriptionSchema.methods.cancel = async function() {
  this.status = 'canceled';
  this.canceledAt = new Date();
  await this.save();
};

subscriptionSchema.methods.renew = async function() {
  const duration = this.billingCycle === 'monthly' ? 30 : 365;
  this.startDate = new Date();
  this.endDate = new Date(this.startDate.getTime() + duration * 24 * 60 * 60 * 1000);
  this.status = 'active';
  await this.save();
};

subscriptionSchema.methods.addPayment = async function(amount, status, transactionId) {
  this.paymentHistory.push({
    date: new Date(),
    amount,
    status,
    transactionId
  });
  
  if (status === 'success') {
    this.lastBillingDate = new Date();
    this.status = 'active';
  } else if (status === 'failed') {
    this.failedPayments.push({
      date: new Date(),
      amount,
      reason: 'Payment failed'
    });
    
    if (this.failedPayments.length >= 3) {
      this.status = 'past_due';
    }
  }
  
  await this.save();
};

// Pre-save hook
subscriptionSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set trial end date for new subscriptions
    if (!this.trialEndsAt) {
      this.trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days trial
    }
    
    // Set next billing date
    if (!this.nextBillingDate) {
      this.nextBillingDate = this.trialEndsAt;
    }
  }
  next();
});

// Statics
subscriptionSchema.statics.findActiveByUser = function(userId) {
  return this.findOne({
    user: userId,
    status: 'active',
    endDate: { $gt: new Date() }
  });
};

subscriptionSchema.statics.findExpiring = function(days = 7) {
  const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return this.find({
    status: 'active',
    endDate: { 
      $lte: expiryDate,
      $gt: new Date()
    }
  }).populate('user');
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
