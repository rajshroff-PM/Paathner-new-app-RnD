const Analytics = require('../models/Analytics');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const today = new Date();
    today.setHours(0,0,0,0);

    const footfallToday = await Analytics.countDocuments({
      eventType: 'store_visit',
      createdAt: { $gte: today }
    });

    const redemptions = await Analytics.countDocuments({ eventType: 'offer_redeem' });

    res.json({
      totalUsers,
      footfallToday,
      totalRedemptions: redemptions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackQR = async (req, res) => {
  const { source } = req.body; // e.g. "Entrance_Standee"
  
  await Analytics.create({
    eventType: 'qr_scan',
    metaData: { source }
  });
  
  res.json({ success: true });
};