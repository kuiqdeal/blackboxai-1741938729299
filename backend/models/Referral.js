const mongoose = require('mongoose');
const logger = require('../utils/logger');

const referralSchema = new mongoose.Schema({
  tenant: {
    type: String,
    required: [true, 'Tenant is required'],
    index: true
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referred: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referralCode: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'expired', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['user', 'agency', 'reseller'],
    required: true
  },
  commission: {
    percentage: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paid: {
      type: Boolean,
      default: false
    },
    paidAt: Date
  },
  earnings: [{
    amount: Number,
    currency: String,
    description: String,
    generatedFrom: {
      type: String,
      enum: ['subscription', 'purchase', 'upgrade']
    },
    date: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'rejected'],
      default: 'pending'
    }
  }],
  withdrawals: [{
    amount: Number,
    currency: String,
    method: {
      type: String,
      enum: ['paypal', 'bank_transfer', 'crypto', 'stripe']
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    paymentDetails: {
      paypal_email: String,
      bank_account: {
        name: String,
        number: String,
        bank: String,
        swift: String
      },
      crypto_address: String,
      stripe_account: String
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: Date,
    transactionId: String,
    notes: String
  }],
  milestones: [{
    type: {
      type: String,
      enum: ['first_payment', 'recurring_payment', 'upgrade', 'retention']
    },
    achieved: {
      type: Boolean,
      default: false
    },
    achievedAt: Date,
    bonus: {
      amount: Number,
      currency: String,
      paid: Boolean
    }
  }],
  analytics: {
    clickCount: {
      type: Number,
      default: 0
    },
    signupCount: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    pendingPayments: {
      type: Number,
      default: 0
    }
  },
  tracking: {
    firstClickDate: Date,
    signupDate: Date,
    qualificationDate: Date,
    lastActivityDate: Date
  },
  notifications: {
    emailsSent: [{
      type: String,
      date: Date,
      subject: String
    }],
    preferences: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      earnings: {
        type: Boolean,
        default: true
      },
      withdrawals: {
        type: Boolean,
        default: true
      }
    }
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
referralSchema.index({ referrer: 1, status: 1 });
referralSchema.index({ referralCode: 1 });
referralSchema.index({ 'earnings.status': 1 });
referralSchema.index({ 'withdrawals.status': 1 });

// Methods
referralSchema.methods.addEarning = async function(earning) {
  this.earnings.push(earning);
  this.analytics.totalEarnings += earning.amount;
  this.analytics.pendingPayments += earning.status === 'pending' ? earning.amount : 0;
  
  // Update conversion rate
  if (this.analytics.clickCount > 0) {
    this.analytics.conversionRate = (this.analytics.signupCount / this.analytics.clickCount) * 100;
  }
  
  await this.save();
  logger.info(`New earning added to referral ${this._id}`, { earning });
};

referralSchema.methods.requestWithdrawal = async function(withdrawalData) {
  const totalPendingWithdrawals = this.withdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + w.amount, 0);
    
  const availableBalance = this.analytics.totalEarnings - totalPendingWithdrawals;
  
  if (withdrawalData.amount > availableBalance) {
    throw new Error('Insufficient balance for withdrawal');
  }
  
  this.withdrawals.push(withdrawalData);
  await this.save();
  
  logger.info(`New withdrawal request for referral ${this._id}`, { withdrawalData });
};

referralSchema.methods.updateWithdrawalStatus = async function(withdrawalId, status, transactionId = null) {
  const withdrawal = this.withdrawals.id(withdrawalId);
  if (!withdrawal) {
    throw new Error('Withdrawal not found');
  }
  
  withdrawal.status = status;
  withdrawal.processedAt = new Date();
  if (transactionId) {
    withdrawal.transactionId = transactionId;
  }
  
  if (status === 'completed') {
    this.analytics.pendingPayments -= withdrawal.amount;
  }
  
  await this.save();
  logger.info(`Withdrawal ${withdrawalId} status updated to ${status}`);
};

referralSchema.methods.trackClick = async function() {
  this.analytics.clickCount += 1;
  if (!this.tracking.firstClickDate) {
    this.tracking.firstClickDate = new Date();
  }
  this.tracking.lastActivityDate = new Date();
  await this.save();
};

referralSchema.methods.achieveMilestone = async function(milestoneType) {
  const milestone = this.milestones.find(m => m.type === milestoneType && !m.achieved);
  if (milestone) {
    milestone.achieved = true;
    milestone.achievedAt = new Date();
    await this.save();
    logger.info(`Milestone ${milestoneType} achieved for referral ${this._id}`);
  }
};

// Statics
referralSchema.statics.findActiveReferrers = function(tenant) {
  return this.find({
    tenant,
    status: 'completed',
    'analytics.totalEarnings': { $gt: 0 }
  })
  .populate('referrer')
  .sort({ 'analytics.totalEarnings': -1 });
};

referralSchema.statics.findPendingWithdrawals = function(tenant) {
  return this.find({
    tenant,
    'withdrawals.status': 'pending'
  })
  .populate('referrer');
};

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
