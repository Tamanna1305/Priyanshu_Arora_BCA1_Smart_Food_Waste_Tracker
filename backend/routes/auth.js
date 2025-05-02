const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  console.log('POST /api/auth/register:', req.body);
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  console.log('POST /api/auth/login:', req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  console.log('GET /api/auth/me for user:', req.user);
  try {
    const user = await User.findById(req.user.userId).select('email');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ email: user.email });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;