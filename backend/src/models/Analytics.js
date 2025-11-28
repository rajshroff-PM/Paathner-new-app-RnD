const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: { 
    type: String, 
    enum: ['app_open', 'qr_scan', 'store_visit', 'offer_unlock', 'offer_redeem'], 
    required: true 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metaData: { type: Object }, // Flexible data (storeId, campaignSource, etc.)
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);