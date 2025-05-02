const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const Donation = require('../models/Donation');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  console.log('POST /api/food-items received:', req.body, 'User:', req.user);
  try {
    const foodItem = new FoodItem({
      ...req.body,
      userId: req.user.userId,
    });
    await foodItem.save();
    res.status(201).json(foodItem);
  } catch (error) {
    console.error('Error saving food item:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  console.log('GET /api/food-items for user:', req.user);
  try {
    const foodItems = await FoodItem.find({ userId: req.user.userId });
    res.json(foodItems);
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  console.log('DELETE /api/food-items/:id', req.params.id);
  try {
    const foodItem = await FoodItem.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!foodItem) return res.status(404).json({ error: 'Food item not found' });
    res.json({ message: 'Food item deleted' });
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/stats', auth, async (req, res) => {
  console.log('GET /api/food-items/stats for user:', req.user);
  try {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    const totalItems = await FoodItem.countDocuments({ userId: req.user.userId });
    const expiringSoon = await FoodItem.countDocuments({
      userId: req.user.userId,
      expiryDate: { $lte: threeDaysFromNow, $gte: today },
    });
    const totalDonations = await Donation.countDocuments({ userId: req.user.userId });

    res.json({ totalItems, expiringSoon, totalDonations });
  } catch (error) {
    console.error('Error in stats:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;