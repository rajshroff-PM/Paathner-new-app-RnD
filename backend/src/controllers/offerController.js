const Offer = require('../models/Offer');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

exports.getOffers = async (req, res) => {
  const offers = await Offer.find({ isActive: true }).populate('store', 'name floor');
  res.json(offers);
};

exports.redeemOffer = async (req, res) => {
  const { offerId } = req.body;
  
  try {
    const offer = await Offer.findById(offerId);
    if (!offer || !offer.isActive) return res.status(404).json({ message: "Offer invalid" });

    const user = await User.findById(req.user._id);
    
    // Check if already redeemed
    const alreadyRedeemed = user.redeemedOffers.find(r => r.offerId.toString() === offerId);
    if (alreadyRedeemed) {
      return res.status(400).json({ message: "Offer already redeemed" });
    }

    // Transaction
    user.redeemedOffers.push({ offerId });
    offer.redemptionCount += 1;

    await user.save();
    await offer.save();

    // Log Analytics
    await Analytics.create({
      eventType: 'offer_redeem',
      userId: req.user._id,
      metaData: { offerId: offer._id, title: offer.title }
    });

    res.json({ success: true, message: "Redeemed successfully", unlockCode: offer.unlockCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};