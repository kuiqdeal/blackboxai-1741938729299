const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: [true, 'Tenant ID is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9-]+$/, 'Tenant ID can only contain letters, numbers, and hyphens']
  },
  name: {
    type: String,
    required: [true, 'Tenant name is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  settings: {
    theme: {
      primary: {
        type: String,
        default: '#007bff'
      },
      secondary: {
        type: String,
        default: '#6c757d'
      },
      logo: String,
      favicon: String
    },
    customDomain: {
      domain: String,
      verified: {
        type: Boolean,
        default: false
      },
      sslEnabled: {
        type: Boolean,
        default: false
      }
    },
    features: {
      aiLeadGeneration: {
        type: Boolean,
        default: true
      },
      emailMarketing: {
        type: Boolean,
        default: true
      },
      socialMediaManagement: {
        type: Boolean,
        default: true
      },
      adsManagement: {
        type: Boolean,
        default: true
      },
      websiteAutomation: {
        type: Boolean,
        default: true
      },
      ecommerceAutomation: {
        type: Boolean,
        default: true
      },
      videoGeneration: {
        type: Boolean,
        default: true
      },
      vpnAccess: {
        type: Boolean,
        default: true
      }
    },
    limits: {
      maxUsers: {
        type: Number,
        default: 5
      },
      maxLeads: {
        type: Number,
        default: 1000
      },
      maxEmailsPerMonth: {
        type: Number,
        default: 10000
      },
      maxSocialAccounts: {
        type: Number,
        default: 5
      }
    },
    localization: {
      defaultLanguage: {
        type: String,
        default: 'en'
      },
      timezone: {
        type: String,
        default: 'UTC'
      },
      dateFormat: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    security: {
      twoFactorAuth: {
        type: Boolean,
        default: false
      },
      passwordPolicy: {
        minLength: {
          type: Number,
          default: 8
        },
        requireSpecialChar: {
          type: Boolean,
          default: true
        },
        requireNumber: {
          type: Boolean,
          default: true
        }
      },
      ipWhitelist: [{
        ip: String,
        description: String
      }]
    }
  },
  billing: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'past_due', 'canceled'],
      default: 'active'
    },
    subscriptionId: String,
    validUntil: Date,
    paymentMethod: {
      type: {
        type: String,
        enum: ['credit_card', 'paypal', 'crypto', 'bank_transfer']
      },
      last4: String,
      expiryDate: String
    }
  },
  analytics: {
    totalUsers: {
      type: Number,
      default: 0
    },
    totalLeads: {
      type: Number,
      default: 0
    },
    monthlyEmailsSent: {
      type: Number,
      default: 0
    },
    monthlyActiveUsers: {
      type: Number,
      default: 0
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
tenantSchema.index({ tenantId: 1 });
tenantSchema.index({ 'settings.customDomain.domain': 1 }, { sparse: true });
tenantSchema.index({ owner: 1 });

// Methods
tenantSchema.methods.isFeatureEnabled = function(featureName) {
  return this.settings.features[featureName] || false;
};

tenantSchema.methods.hasReachedLimit = function(limitName, currentValue) {
  return currentValue >= this.settings.limits[limitName];
};

tenantSchema.methods.updateAnalytics = async function(field, value) {
  this.analytics[field] = value;
  await this.save();
};

// Statics
tenantSchema.statics.findByDomain = function(domain) {
  return this.findOne({ 'settings.customDomain.domain': domain });
};

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;
