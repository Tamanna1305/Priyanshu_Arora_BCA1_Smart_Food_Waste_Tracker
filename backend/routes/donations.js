const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const FoodItem = require('../models/FoodItem');
const auth = require('../middleware/auth');

// Create donation
router.post('/', auth, async (req, res) => {
  try {
    const { foodItemId, pickupDate, pickupTime } = req.body;
    const foodItem = await FoodItem.findOne({ _id: foodItemId, userId: req.user.userId });
    if (!foodItem) return res.status(404).json({ error: 'Food item not found' });

    const donation = new Donation({
      userId: req.user.userId,
      foodItemId,
      foodItemName: foodItem.name,
      pickupDate,
      pickupTime
    });

    await donation.save();
    await FoodItem.findByIdAndDelete(foodItemId);
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all donations
router.get('/', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.userId });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a donation
router.delete('/:id', auth, async (req, res) => {
  try {
    await Donation.deleteOne({ _id: req.params.id, userId: req.user.userId });
    res.status(200).json({ message: 'Donation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
