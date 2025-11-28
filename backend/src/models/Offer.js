const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g., "₹1 Bikaner Samosa"
  description: String,
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  isActive: { type: Boolean, default: true },
  discountAmount: Number,
  maxRedemptions: { type: Number, default: 1000 },
  redemptionCount: { type: Number, default: 0 },
  // Proximity trigger rule
  triggerRadius: { type: Number, default: 20 }, // In meters
  requiredFloor: { type: String }, // e.g., "Food Court"
  unlockCode: String, // QR or Code to show merchant
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);