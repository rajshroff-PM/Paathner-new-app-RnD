const Store = require('../models/Store');

exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find({});
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Find stores sorted by distance from user
exports.getNearbyStores = async (req, res) => {
  const { lat, lng } = req.query;
  
  if (!lat || !lng) return res.status(400).json({ message: "Coordinates required" });

  try {
    const stores = await Store.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 500 // 500 meters max
        }
      }
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};