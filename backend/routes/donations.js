const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const FoodItem = require('../models/FoodItem');
const auth = require('../middleware/auth');

// Create a donation
router.post('/', auth, async (req, res) => {
  console.log('POST /api/donations:', req.body, 'User:', req.user);
  try {
    const { foodItemId } = req.body;
    const foodItem = await FoodItem.findOne({ _id: foodItemId, userId: req.user.userId });
    if (!foodItem) {
      console.error('Food item not found for ID:', foodItemId);
      return res.status(404).json({ error: 'Food item not found' });
    }

    const donation = new Donation({
      userId: req.user.userId,
      foodItemId: foodItemId,
      foodItemName: foodItem.name, 
    });
    await donation.save();
    await FoodItem.findByIdAndDelete(foodItemId);
    console.log('Donation created:', JSON.stringify(donation, null, 2));

    res.status(201).json(donation);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all donations for the user
router.get('/', auth, async (req, res) => {
  console.log('GET /api/donations for user:', req.user);
  try {
    const donations = await Donation.find({ userId: req.user.userId });
    console.log('Raw donations:', JSON.stringify(donations, null, 2));
    const validDonations = donations.filter(d => d.foodItemId && d.foodItemName);
    console.log('Valid donations sent:', JSON.stringify(validDonations, null, 2));
    res.json(validDonations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations: ' + error.message });
  }
});

module.exports = router;