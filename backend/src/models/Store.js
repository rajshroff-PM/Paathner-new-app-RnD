const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: String, required: true },
  floor: { type: String, required: true }, // "Ground", "1st Floor", "Food Court"
  iconName: String,
  color: String,
  // GeoJSON Point for Proximity Calculations
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  // Local Mall Coordinates (for the indoor map rendering)
  indoorPosition: {
    x: Number,
    y: Number
  },
  menu: [{
    name: String,
    price: Number,
    image: String
  }]
}, { timestamps: true });

// Create 2dsphere index for geospatial queries
storeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Store', storeSchema);