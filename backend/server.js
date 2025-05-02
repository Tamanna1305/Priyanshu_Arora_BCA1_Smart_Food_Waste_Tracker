const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const foodItemsRoutes = require('./routes/foodItems');
const donationsRoutes = require('./routes/donations');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/food-items', foodItemsRoutes);
app.use('/api/donations', donationsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));