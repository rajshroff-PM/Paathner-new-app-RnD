const Store = require('../models/Store');
const Offer = require('../models/Offer');
const Analytics = require('../models/Analytics');

exports.checkProximity = async (req, res) => {
  // This is called every 5-10 seconds by the app
  const { lat, lng, floor } = req.body;

  if (!lat || !lng) return res.status(400).json({ message: "Location data missing" });

  try {
    // 1. Find Active Offers associated with stores near the user
    const nearbyStores = await Store.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 50 // Check within 50 meters
        }
      }
    }).select('_id name floor');

    if (nearbyStores.length === 0) {
      return res.json({ nearby: [], unlockedOffers: [] });
    }

    const storeIds = nearbyStores.map(s => s._id);

    // 2. Check for offers linked to these stores
    const offers = await Offer.find({ 
      store: { $in: storeIds },
      isActive: true 
    }).populate('store');

    const unlockedOffers = [];

    // 3. Apply Business Logic (Floor check + Radius Check)
    for (const offer of offers) {
      // Specific Logic for "Food Court" Samosa
      if (offer.requiredFloor && offer.requiredFloor !== floor) {
        continue; // Skip if user is on the wrong floor (e.g. Ground vs Food Court)
      }

      // Calculate precise distance (simple Haversine or use logic passed from DB query)
      // Since we used $near with 50m, we assume they are close enough, 
      // but we can refine based on `offer.triggerRadius` here if needed.
      
      unlockedOffers.push(offer);
      
      // Log Analytics Event
      if (req.user) {
        await Analytics.create({
          eventType: 'offer_unlock',
          userId: req.user._id,
          metaData: { offerId: offer._id, storeName: offer.store.name }
        });
      }
    }

    res.json({
      detectedFloor: floor,
      nearbyStores: nearbyStores.map(s => s.name),
      unlockedOffers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};