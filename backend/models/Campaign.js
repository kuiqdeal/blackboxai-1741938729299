const mongoose = require('mongoose');
const logger = require('../utils/logger');

const campaignSchema = new mongoose.Schema({
  tenant: {
    type: String,
    required: [true, 'Tenant is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Campaign name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['email', 'social_media', 'ads', 'sms', 'whatsapp'],
    required: true
  },
  platform: {
    type: String,
    enum: ['mailchimp', 'sendgrid', 'facebook', 'instagram', 'linkedin', 'google_ads', 'tiktok'],
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'active', 'paused', 'completed', 'failed'],
    default: 'draft'
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  content: {
    subject: String, // For email campaigns
    body: String,
    template: String,
    mediaUrls: [String],
    callToAction: {
      text: String,
      url: String
    },
    aiSuggestions: [{
      type: String,
      suggestion: String,
      applied: {
        type: Boolean,
        default: false
      }
    }]
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly']
    },
    timeZone: String,
    bestTimeOptimization: {
      type: Boolean,
      default: false
    }
  },
  targeting: {
    audience: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead'
    }],
    segments: [String],
    filters: {
      location: [String],
      age: {
        min: Number,
        max: Number
      },
      interests: [String],
      behaviors: [String],
      customFilters: mongoose.Schema.Types.Mixed
    }
  },
  budget: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    daily: Number,
    spent: {
      type: Number,
      default: 0
    },
    costPerAction: {
      type: Number,
      default: 0
    }
  },
  performance: {
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    roi: {
      type: Number,
      default: 0
    },
    // Email specific metrics
    opens: {
      type: Number,
      default: 0
    },
    bounces: {
      type: Number,
      default: 0
    },
    unsubscribes: {
      type: Number,
      default: 0
    },
    // Social media specific metrics
    shares: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
  aiInsights: {
    performanceScore: {
      type: Number,
      min: 0,
      max: 100
    },
    recommendations: [{
      type: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      impact: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      implemented: {
        type: Boolean,
        default: false
      }
    }],
    predictedMetrics: {
      ctr: Number,
      conversionRate: Number,
      roi: Number
    }
  },
  abTest: {
    enabled: {
      type: Boolean,
      default: false
    },
    variants: [{
      name: String,
      content: {
        subject: String,
        body: String,
        mediaUrls: [String]
      },
      performance: {
        impressions: Number,
        clicks: Number,
        conversions: Number
      }
    }],
    winningVariant: String
  },
  tracking: {
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    customParameters: mongoose.Schema.Types.Mixed
  },
  notifications: {
    alertThresholds: {
      budget: Number,
      performance: Number
    },
    recipients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
campaignSchema.index({ tenant: 1, type: 1 });
campaignSchema.index({ tenant: 1, status: 1 });
campaignSchema.index({ 'schedule.startDate': 1 });
campaignSchema.index({ 'performance.roi': -1 });

// Methods
campaignSchema.methods.updatePerformance = async function(metrics) {
  Object.assign(this.performance, metrics);
  
  // Calculate ROI
  if (this.budget.spent > 0) {
    this.performance.roi = ((this.performance.revenue - this.budget.spent) / this.budget.spent) * 100;
  }
  
  // Calculate cost per action if there are conversions
  if (this.performance.conversions > 0) {
    this.budget.costPerAction = this.budget.spent / this.performance.conversions;
  }
  
  await this.save();
};

campaignSchema.methods.pause = async function() {
  if (this.status === 'active') {
    this.status = 'paused';
    await this.save();
    logger.info(`Campaign ${this._id} paused`);
  }
};

campaignSchema.methods.resume = async function() {
  if (this.status === 'paused') {
    this.status = 'active';
    await this.save();
    logger.info(`Campaign ${this._id} resumed`);
  }
};

campaignSchema.methods.addAiInsight = async function(recommendation) {
  this.aiInsights.recommendations.push(recommendation);
  await this.save();
};

// Statics
campaignSchema.statics.findActive = function(tenant) {
  return this.find({
    tenant,
    status: 'active',
    'schedule.startDate': { $lte: new Date() },
    $or: [
      { 'schedule.endDate': { $gt: new Date() } },
      { 'schedule.endDate': null }
    ]
  });
};

campaignSchema.statics.findBestPerforming = function(tenant, limit = 5) {
  return this.find({
    tenant,
    status: 'completed'
  })
  .sort({ 'performance.roi': -1 })
  .limit(limit);
};

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
