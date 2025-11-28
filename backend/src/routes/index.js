const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');

const authController = require('../controllers/authController');
const storeController = require('../controllers/storeController');
const proximityController = require('../controllers/proximityController');
const offerController = require('../controllers/offerController');
const adminController = require('../controllers/adminController');

// Auth
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);

// Stores
router.get('/stores', storeController.getStores);
router.get('/stores/nearby', storeController.getNearbyStores);
router.post('/stores', protect, admin, storeController.createStore);

// Proximity Logic (The Core Feature)
router.post('/proximity/check', protect, proximityController.checkProximity);

// Offers
router.get('/offers', offerController.getOffers);
router.post('/offers/redeem', protect, offerController.redeemOffer);

// Admin / Analytics / QR
router.get('/admin/stats', protect, admin, adminController.getDashboardStats);
router.post('/qr/scan', adminController.trackQR);

module.exports = router;