const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FoodItem', foodItemSchema);