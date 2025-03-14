const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  tenant: {
    type: String,
    required: [true, 'Tenant is required'],
    index: true
  },
  source: {
    type: String,
    enum: ['google_maps', 'yellow_pages', 'linkedin', 'facebook', 'instagram', 'amazon', 'shopify'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'qualified', 'contacted', 'converted', 'rejected'],
    default: 'new'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  quality: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'cold'
  },
  businessInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    website: String,
    industry: String,
    size: String,
    founded: String,
    revenue: String,
    employees: String
  },
  contactInfo: {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    socialProfiles: {
      linkedin: String,
      facebook: String,
      instagram: String,
      twitter: String
    }
  },
  marketingInfo: {
    tags: [String],
    segments: [String],
    campaigns: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign'
    }],
    lastContactDate: Date,
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'sms', 'whatsapp'],
      default: 'email'
    }
  },
  aiAnalysis: {
    interests: [String],
    buyingIntent: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'low'
    },
    budget: {
      range: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      estimatedValue: Number
    },
    decisionMakingStage: {
      type: String,
      enum: ['awareness', 'consideration', 'decision'],
      default: 'awareness'
    },
    recommendedActions: [{
      action: String,
      priority: {
        type: String,
        enum: ['high', 'medium', 'low']
      },
      dueDate: Date
    }]
  },
  engagement: {
    emailOpens: {
      type: Number,
      default: 0
    },
    emailClicks: {
      type: Number,
      default: 0
    },
    websiteVisits: {
      type: Number,
      default: 0
    },
    socialInteractions: {
      type: Number,
      default: 0
    },
    lastEngagement: Date
  },
  scrapeData: {
    originalUrl: String,
    lastScraped: Date,
    rawData: mongoose.Schema.Types.Mixed,
    confidence: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  verificationStatus: {
    email: {
      verified: {
        type: Boolean,
        default: false
      },
      verifiedAt: Date,
      verificationMethod: String
    },
    phone: {
      verified: {
        type: Boolean,
        default: false
      },
      verifiedAt: Date,
      verificationMethod: String
    }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  activities: [{
    type: {
      type: String,
      enum: ['email_sent', 'email_opened', 'email_clicked', 'call_made', 'meeting_scheduled', 'note_added']
    },
    description: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
leadSchema.index({ tenant: 1, source: 1 });
leadSchema.index({ tenant: 1, status: 1 });
leadSchema.index({ tenant: 1, score: -1 });
leadSchema.index({ 'contactInfo.email': 1, tenant: 1 });
leadSchema.index({ assignedTo: 1, tenant: 1 });
leadSchema.index({ 'businessInfo.name': 'text', 'businessInfo.description': 'text' });

// Methods
leadSchema.methods.updateScore = async function() {
  let score = 0;
  
  // Calculate score based on various factors
  if (this.contactInfo.email) score += 20;
  if (this.contactInfo.phone) score += 15;
  if (this.businessInfo.website) score += 10;
  if (this.engagement.emailOpens > 0) score += 5;
  if (this.engagement.emailClicks > 0) score += 10;
  if (this.engagement.websiteVisits > 0) score += 15;
  
  // Update quality based on score
  this.score = Math.min(score, 100);
  this.quality = this.score >= 70 ? 'hot' : (this.score >= 40 ? 'warm' : 'cold');
  
  await this.save();
};

leadSchema.methods.addActivity = async function(type, description, userId) {
  this.activities.push({
    type,
    description,
    performedBy: userId,
    performedAt: new Date()
  });
  
  if (type === 'email_opened') this.engagement.emailOpens += 1;
  if (type === 'email_clicked') this.engagement.emailClicks += 1;
  
  this.engagement.lastEngagement = new Date();
  await this.save();
};

leadSchema.methods.addNote = async function(content, userId) {
  this.notes.push({
    content,
    createdBy: userId,
    createdAt: new Date()
  });
  
  await this.save();
};

// Statics
leadSchema.statics.findByQuality = function(tenant, quality) {
  return this.find({ tenant, quality });
};

leadSchema.statics.findUnassigned = function(tenant) {
  return this.find({ 
    tenant,
    assignedTo: { $exists: false }
  });
};

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
