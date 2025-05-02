const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foodItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    required: true,
  },
  foodItemName: {
    type: String,
    required: true,
  },
  donatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Donation', donationSchema);